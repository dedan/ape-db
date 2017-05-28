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
import {green300, red300, blue300, green100, red100, blue100} from 'material-ui/styles/colors';

export default class Catalog extends Component {

  render() {
    const {bookId, bookPages, entries, dispatch} = this.props
    return <div>
      <Table selectable={false}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn style={{width: 100}}>Image</TableHeaderColumn>
            <TableHeaderColumn style={{width: 100}}>Page</TableHeaderColumn>
            <TableHeaderColumn>
              <span>Entries</span>
              <ColoredChip isLight={true} status="valid" label="valid" />
              <ColoredChip isLight={true} status="invalid" label="invalid" />
              <ColoredChip isLight={true} status="placeholder" label="placeholder" />
            </TableHeaderColumn>
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
                    return <EntryChip
                        key={entryId}
                        bookId={bookId} pageId={page.pageId}
                        entry={entries[entryId]} />
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


const CHIP_STATUS_COLORS = {
  valid: green300,
  invalid: red300,
  placeholder: blue300,
}

const LIGHT_CHIP_STATUS_COLORS = {
  valid: green100,
  invalid: red100,
  placeholder: blue100,
}

const EntryChip = ({bookId, pageId, entry}) => {
  const entryStatus = entry.isPlaceholder ?
    'placeholder'
    : entry.isValidated ?
      entry.isValid ? 'valid' : 'invalid'
      : null
  const entryUrl = `/current-page/${bookId}/${pageId}/${entry.entryId}`
  return <Link to={entryUrl}>
    <ColoredChip style={{cursor: 'pointer'}} status={entryStatus} label={entry.form} />
  </Link>
}

const ColoredChip = ({status, label, style, isLight}) => (
  <Chip
      backgroundColor={isLight ? LIGHT_CHIP_STATUS_COLORS[status] : CHIP_STATUS_COLORS[status]}
      style={{margin: 4, ...style}}>
    {label}
  </Chip>
)



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
