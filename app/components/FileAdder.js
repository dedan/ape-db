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
    const {settings} = this.props
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

  render() {
    const {bookNames, isOpen} = this.props
    const {book, page} = this.state
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
      <div>
        <div>Book Name:</div>
        <FlatButton
            label="add book +"
            onClick={() => alert('coming soon')} />
      </div>
      <select onChange={this.handleChange('book')}>
        <option />
        {(bookNames || []).map(bookName => {
          return <option value={bookName}>{bookName}</option>
        })}
      </select>
      <br />
      <TextField
          hintText="Page" floatingLabelText="Page"
          onChange={this.handleChange('page')} />
    </Dialog>
  }
}
