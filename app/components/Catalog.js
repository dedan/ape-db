import React, {Component} from 'react';
import path from 'path'
import { Link } from 'react-router-dom';

export default class Catalog extends Component {

  render() {
    const {allPages} = this.props

    return <div>
      <h1>Catalog</h1>
      <ul>
        {allPages.map(page => {
          const filePath = 'file://' + page.original
          return <li key={page.original}>
            <img src={filePath} width="100" height="100" />
            {page.original }
            <Link to={`/current-page/${page.book}/${page.page}`}>Edit</Link>
          </li>
        })}
      </ul>
    </div>
  }
}
