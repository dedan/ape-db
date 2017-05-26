import React, {Component} from 'react'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import ContentAdd from 'material-ui/svg-icons/content/add';
const {dialog} = require('electron').remote
import path from 'path'
import fs from 'fs-extra'
import {thumb} from 'node-thumbnail'
import _ from 'underscore'


const BOOK_CATEGORIES = {
  'OU': 'Orangutan Book',
  'BT': 'Botany Book',
  'PR': 'Procedure Book',
  'FL': 'Following Book',
  'FD': 'Feeding Book',
  'SC': 'Searching Book',
}
const SEXES = {
  'F': 'Female',
  'M': 'Male',
}
const BOOK_TYPES = {
  '1': 'Care',
  '2': 'Release',
  '3': 'Medical',
}

const todaysYear = new Date().getFullYear()
const last40Years = _.range(40).map(offset => {
  return String(todaysYear - offset)
})



export default class FileAdder extends Component {

  state = {
    path: '',
  }

  handleOpenFileClick = () => {
    const dialogOptions = {
      properties: ['openFile'],
      filters: [
        {name: 'Images', extensions: ['jpg']},
      ]
    }
    dialog.showOpenDialog(dialogOptions, fileNames => {
      if(fileNames === undefined){
          console.log("No file selected");
          return;
      }
      this.setState({path: fileNames[0]})
    })
  }

  handleDialogClose = fileNameInfo => {
    const {settings, onFileCopied} = this.props
    const basePath = settings.path
    const {book, page, fileName} = fileNameInfo
    const bookPath = [basePath, book].join(path.sep);
    const pagePath = [bookPath, page].join(path.sep);
    const filePath = [pagePath, fileName].join(path.sep);
    [bookPath, pagePath].forEach(pathToCheck => {
      if (!fs.existsSync(pathToCheck)) {
        fs.mkdirSync(pathToCheck)
      }
    })
    fs.copySync(this.state.path, filePath);
    createThumbnail(filePath)

    const thumbnailPath = filePath.slice(0, filePath.length - 4) + '_thumbnail.jpg'
    const newPage = {
      pageId: page,
      original: filePath,
      thumbnail: thumbnailPath,
      entries: [],
    }
    onFileCopied(book, newPage)
    this.setState({path: ''})
  }

  render() {
    const {settings, onNewBookCreated} = this.props
    const style = {
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 2,
    }
    return <div style={style}>
      <FloatingActionButton onClick={this.handleOpenFileClick}>
        <ContentAdd />
      </FloatingActionButton>
      <FileNamingDialog
          onNewBookCreated={onNewBookCreated}
          bookNames={settings.bookNames}
          isOpen={!!this.state.path}
          onClose={this.handleDialogClose} />
    </div>
  }
}


function createThumbnail(imagePath) {
  thumb({
    source: imagePath,
    destination: path.dirname(imagePath),
    concurrency: 1,
    width: 200,
    suffix: '_thumbnail',
  }, function(files, err, stdout, stderr) {
    if (err) {
      console.log('>>', err)
    } else {
      console.log('All done, yo!');
    }
  })
}


class FileNamingDialog extends Component {

  state = {
    book: '',
    page: '',
    isNewBookDialogOpen: false,
  }

  handleSaveClick = () => {
    const {onClose} = this.props
    const {book, page} = this.state
    onClose({
      book,
      page,
      fileName: `${book}_${page}.jpg`
    })
  }

  handleChange = field => event => {
    this.setState({[field]: event.target.value})
  }

  handleNewBookCreated = newBookName => {
    const {onNewBookCreated} = this.props
    this.setState({isNewBookDialogOpen: false})
    onNewBookCreated(newBookName)
  }

  render() {
    const {bookNames, isOpen, onNewBookCreated} = this.props
    const {book, page, isNewBookDialogOpen} = this.state
    const actions = [
      <FlatButton
        label="Save"
        primary={true}
        disabled={!book || !page}
        onClick={this.handleSaveClick}
      />,
    ];

    // TODO: Add validation.
    return <Dialog actions={actions} modal={true} open={isOpen}>
      <NewBookDialog
          isOpen={isNewBookDialogOpen}
          onNewBookCreated={this.handleNewBookCreated} />
      <div>
        <div>Book Name:</div>
        <FlatButton
            label="add book +"
            onClick={() => this.setState({isNewBookDialogOpen: true})} />
      </div>
      <select onChange={this.handleChange('book')}>
        <option />
        {(bookNames || []).map(bookName => {
          return <option key={bookName} value={bookName}>{bookName}</option>
        })}
      </select>
      <br />
      <TextField
          hintText="Page" floatingLabelText="Page"
          onChange={this.handleChange('page')} />
    </Dialog>
  }
}


class NewBookDialog extends Component {

  state = {
    bookCategory: '',
    apeName: '',
    sex: '',
    bookType: '',
    year: '',
  }

  handleChange = field => event => {
    this.setState({[field]: event.target.value})
  }

  handleCreateClick = () => {
    const {onNewBookCreated} = this.props
    const {bookCategory, apeName, sex, bookType, year} = this.state
    const newBookName = [bookCategory, apeName.toUpperCase(), sex, bookType, year].join('.')
    console.log('>>', newBookName)
    onNewBookCreated(newBookName)
  }

  render() {
    const {isOpen} = this.props
    const {bookCategory, apeName, sex, bookType, year} = this.state
    const actions = [
      <FlatButton
        label="Create"
        primary={true}
        disabled={!(bookCategory && apeName && sex && bookType && year)}
        onClick={this.handleCreateClick}
      />,
    ];
    return <Dialog actions={actions} modal={true} open={isOpen}>
      <div>Book Category:</div>
      <select onChange={this.handleChange('bookCategory')}>
        <option />
        {_.map(BOOK_CATEGORIES, (categoryName, category) => {
          return <option key={category} value={category}>{categoryName}</option>
        })}
      </select>
      <br />
      <TextField
          floatingLabelText="Orangutan Name"
          onChange={this.handleChange('apeName')} />
      <br />
      <div>Sex:</div>
      <select onChange={this.handleChange('sex')}>
        <option />
        {_.map(SEXES, (sexName, sex) => {
          return <option key={sex} value={sex}>{sexName}</option>
        })}
      </select>
      <br />
      <div>Book Type:</div>
      <select onChange={this.handleChange('bookType')}>
        <option />
        {_.map(BOOK_TYPES, (typeName, type) => {
          return <option key={type} value={type}>{typeName}</option>
        })}
      </select>
      <div>Year:</div>
      <select onChange={this.handleChange('year')}>
        <option />
        {last40Years.map(year => {
          return <option key={year} value={year}>{year}</option>
        })}
      </select>
    </Dialog>
  }
}
