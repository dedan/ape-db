import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import ContentAdd from 'material-ui/svg-icons/image/add-a-photo';
const {dialog} = require('electron').remote
import path from 'path'
import fs from 'fs-extra'
import {thumb} from 'node-thumbnail'
import _ from 'underscore'
import {PAGE_REG} from '../actions/actions'
import RegexValidationField from './RegexValidationField'


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
      <RaisedButton
        label="add page"
        icon={<ContentAdd />}
        primary={true}
        onClick={this.handleOpenFileClick} />
      <FileNamingDialog
          onNewBookCreated={onNewBookCreated}
          bookNames={settings.bookNames}
          isOpen={!!this.state.path}
          onClose={() => this.setState({path: null})}
          onFileNamed={this.handleDialogClose} />
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


function pad(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length-size);
}


class FileNamingDialog extends Component {

  state = {
    book: '',
    page: '',
    isNewBookDialogOpen: false,
  }

  handleSaveClick = () => {
    const {onFileNamed} = this.props
    const {book, page} = this.state
    const m = /^(\d+)(\w)?$/.exec(page)
    const pageDigits = m[1]
    const pageChar = m[2] || ''
    const correctPageName = 'p' + pad(pageDigits, 3) + pageChar
    onFileNamed({
      book,
      page: correctPageName,
      fileName: `${book}_p${page}.jpg`
    })
  }

  handleChange = field => (event, isInValid) => {
    this.setState({
      [field]: event.target.value,
      [field + 'IsInvalid']: isInValid,
    })
  }

  handleNewBookCreated = newBookName => {
    const {onNewBookCreated} = this.props
    this.setState({isNewBookDialogOpen: false})
    onNewBookCreated(newBookName)
  }

  render() {
    const {bookNames, isOpen, onNewBookCreated, onClose} = this.props
    const {book, page, isNewBookDialogOpen, pageIsInvalid} = this.state
    const actions = [
      <FlatButton label="Close" onClick={onClose} />,
      <FlatButton
        label="Save"
        primary={true}
        disabled={!book || !page || pageIsInvalid}
        onClick={this.handleSaveClick} />,
    ];

    // TODO: Add validation.
    return <Dialog actions={actions} modal={true} open={isOpen}>
      <NewBookDialog
          isOpen={isNewBookDialogOpen}
          onCloseClick={() => this.setState({isNewBookDialogOpen: false})}
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
      <RegexValidationField
          label="Page"
          value={page}
          onChange={this.handleChange('page')}
          regex={/^\d{1,3}[a-z]?$/}
          errorMessage="Page can have a maximum of 3 digits plus one optional character" />
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
    onNewBookCreated(newBookName)
    this.setState({
      bookCategory: '',
      apeName: '',
      sex: '',
      bookType: '',
      year: '',
    })
  }

  render() {
    const {isOpen, onCloseClick} = this.props
    const {bookCategory, apeName, sex, bookType, year} = this.state
    const actions = [
      <FlatButton
        label="close"
        onClick={onCloseClick} />,
      <FlatButton
        label="Create"
        primary={true}
        disabled={!(bookCategory && apeName && sex && bookType && year)}
        onClick={this.handleCreateClick} />,
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
