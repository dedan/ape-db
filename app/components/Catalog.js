import React, {Component} from 'react';
import path from 'path'

export default class Catalog extends Component {

  render() {
    const {allPages} = this.props

    return <div>
      <h1>Catalog</h1>
      <ul>
        {allPages.map(page => {
          const filePath = 'file://' + [page.pagePath, page.original].join(path.sep)
          return <li key={page.original}>
            <img src={filePath} width="100" height="100" />
            {page.original }
          </li>
        })}
      </ul>
    </div>
  }
}
