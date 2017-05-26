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
import Chip from 'material-ui/Chip';
import {green300, red300, blue300} from 'material-ui/styles/colors';

export default class Catalog extends Component {

  render() {
    const {bookId, bookPages, entries, dispatch} = this.props
    return <div>
      <Table selectable={false}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn style={{width: 100}}>Image</TableHeaderColumn>
            <TableHeaderColumn style={{width: 100}}>Page</TableHeaderColumn>
            <TableHeaderColumn>Entries</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {bookPages.map(page => {
            return <TableRow key={page.pageId}>
              <TableRowColumn style={{width: 100}}>
                <Thumbnail page={page} size={100} />
              </TableRowColumn>
              <TableRowColumn style={{width: 100}}>
                <Link to={`/current-page/${bookId}/${page.pageId}`}>{page.pageId}</Link>
              </TableRowColumn>
              <TableRowColumn>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                  {(page.entries || []).map((entryId, i) => {
                    const entry = entries[entryId]
                    const color = entry.isPlaceholder ?
                      blue300
                      : entry.isValidated ?
                        entry.isValid ? green300 : red300
                        : null
                    const entryUrl = `/current-page/${bookId}/${page.pageId}/${entryId}`
                    return <Link to={entryUrl} key={i}>
                      <Chip
                          backgroundColor={color}
                          style={{margin: 4}}>
                        {entry.form}
                      </Chip>
                    </Link>
                  })}
                </div>
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

const Thumbnail = ({page, size}) => {
  const filePath = 'file://' + page.thumbnail
  const style= {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
  const placeholderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
    flexDirection: 'column',
    color: '#bbb',
  }
  return (
    <div style={style}>
      {page.thumbnail ?
        <img src={filePath} width={size} height={size} />
        : <div style={placeholderStyle}>
          <div>🐒</div>
          <div>missing</div>
        </div>}
    </div>
  )
}
