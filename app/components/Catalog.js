import React, {Component} from 'react';
import path from 'path'
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

export default class Catalog extends Component {

  render() {
    const {allPages} = this.props

    return <div>
      <h1>Catalog</h1>
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Image</TableHeaderColumn>
            <TableHeaderColumn>Book</TableHeaderColumn>
            <TableHeaderColumn>Page</TableHeaderColumn>
            <TableHeaderColumn>Link</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {allPages.map(page => {
            const filePath = 'file://' + page.original
            const key = [page.book, page.page].join('-')
            return <TableRow key={key}>
              <TableRowColumn>
                {page.original ? <img src={filePath} width="100" height="100" /> : null}
              </TableRowColumn>
              <TableRowColumn>{page.book}</TableRowColumn>
              <TableRowColumn>{page.page}</TableRowColumn>
              <TableRowColumn>
                <Link to={`/current-page/${page.book}/${page.page}`}>Edit</Link>
              </TableRowColumn>
            </TableRow>
          })}
        </TableBody>
      </Table>
      <ul>
      </ul>
    </div>
  }
}
