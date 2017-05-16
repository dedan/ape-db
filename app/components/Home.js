// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const {dialog} = require('electron').remote;
var fs = require('fs-extra');

export default class Home extends Component {
  render() {
    return (
      <div>
        <Header />
        <Catalog />
      </div>
    );
  }
}


class Header extends Component {
  render() {
    return <div>Head</div>
  }
}


class Catalog extends Component {

  openFile = () => {
    dialog.showOpenDialog((fileNames) => {
      if(fileNames === undefined){
        console.log("No file selected");
        return;
      }
      fs.copySync(fileNames[0], '/Users/dedan/test/bla');
    });
  }

  render() {
    return <div>
      <h1>Catalog</h1>
      <FloatingActionButton onClick={this.openFile}>
        <ContentAdd />
      </FloatingActionButton>
    </div>
  }
}
