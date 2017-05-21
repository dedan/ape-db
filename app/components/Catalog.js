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
import {validateEntries} from '../actions/actions'
import {green300, red300} from 'material-ui/styles/colors';

class Catalog extends Component {

  state = {
    onlyWithEntries: true,
  }

  render() {
    const {allPages, entries, dispatch} = this.props
    const {onlyWithEntries} = this.state

    // TODO: Move filtering to reducer and selector.
    const filteredPages = allPages.filter(page => {
      return !onlyWithEntries || page.entries.length
    })

    return <div>
      <h1>Catalog</h1>
      <div>
        <h2>Filters</h2>
        <label>
          only with entries
          <input
              type="checkbox"
              checked={onlyWithEntries}
              onClick={() => this.setState({onlyWithEntries: !onlyWithEntries})} />
        </label>
      </div>
      <div>
        <h2>Validation</h2>
        <button onClick={() => dispatch(validateEntries())}>validate entries</button>
      </div>
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Image</TableHeaderColumn>
            <TableHeaderColumn>Book</TableHeaderColumn>
            <TableHeaderColumn>Page</TableHeaderColumn>
            <TableHeaderColumn>Link</TableHeaderColumn>
            <TableHeaderColumn>Entries</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {filteredPages.map(page => {
            const filePath = 'file://' + page.thumbnail
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
              <TableRowColumn>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                  {page.entries.map((entryId, i) => {
                    const entry = entries[entryId]
                    const color = entry.isValidated ?
                      entry.isValid ? green300 : red300
                      : null
                    return <Chip
                        backgroundColor={color}
                        key={i} style={{margin: 4}}>
                      {entry.form}
                    </Chip>
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
