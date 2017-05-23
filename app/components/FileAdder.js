import React, {Component} from 'react'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import ContentAdd from 'material-ui/svg-icons/content/add';
const {dialog} = require('electron').remote
import path from 'path'
import fs from 'fs-extra'

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
    const {basePath, onFileCopied} = this.props
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
    const relFilePath = [book, page, fileName].join(path.sep)
    onFileCopied(relFilePath)
    this.setState({path: ''})
  }

  render() {
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
          isOpen={!!this.state.path}
          onClose={this.handleDialogClose} />
    </div>
  }
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
    const {isOpen} = this.props
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
      <TextField
          hintText="Book" floatingLabelText="Book"
          onChange={this.handleChange('book')} />
      <br />
      <TextField
          hintText="Page" floatingLabelText="Page"
          onChange={this.handleChange('page')} />
    </Dialog>
  }
}
