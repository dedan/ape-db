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
import {connect} from 'react-redux'
import {green300, red300} from 'material-ui/styles/colors';

class Catalog extends Component {

  state = {
    onlyWithEntries: true,
    onlyWithInvalidEntries: false,
  }

  render() {
    const {bookId, allPages, entries, dispatch} = this.props
    const {onlyWithEntries, onlyWithInvalidEntries} = this.state

    // TODO: Move filtering to reducer and selector to have it non blocking.
    const filteredPages = allPages.filter(page => {
      return !onlyWithEntries || page.entries.length &&
        !onlyWithInvalidEntries || page.entries.some(entryId => {
          const entry = entries[entryId]
          return entry.isValidated && !entry.isValid
        })
    })

    return <div>
      <div>
        <h2>Filters</h2>
        <label>
          only with entries
          <input
              type="checkbox"
              checked={onlyWithEntries}
              onChange={() => this.setState({onlyWithEntries: !onlyWithEntries})} />
        </label>
        <label>
          only with invalid entries
          <input
              type="checkbox"
              checked={onlyWithInvalidEntries}
              onChange={() => this.setState({onlyWithInvalidEntries: !onlyWithInvalidEntries})} />
        </label>
      </div>
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn style={{width: 100}}>Image</TableHeaderColumn>
            <TableHeaderColumn style={{width: 100}}>Page</TableHeaderColumn>
            <TableHeaderColumn>Entries</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {filteredPages.map(page => {
            const filePath = 'file://' + page.thumbnail
            return <TableRow key={page.pageId}>
              <TableRowColumn style={{width: 100}}>
                {page.original ? <img src={filePath} width="100" height="100" /> : null}
              </TableRowColumn>
              <TableRowColumn style={{width: 100}}>
                <Link to={`/current-page/${bookId}/${page.pageId}`}>{page.pageId}</Link>
              </TableRowColumn>
              <TableRowColumn>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                  {page.entries.map((entryId, i) => {
                    const entry = entries[entryId]
                    const color = entry.isValidated ?
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

export default connect()(Catalog)
