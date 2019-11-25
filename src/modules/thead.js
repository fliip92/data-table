/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */
import React, { Component } from 'react'
import {
  Checkbox
} from '@blueprintjs/core'
import ColName from './colName'
import { observer } from 'mobx-react'
import { getChar, noop } from '../utils'
import PropTypes from 'prop-types'

export default observer(
  class thead extends Component {
    static propTypes = {
      entities: PropTypes.array,
      store: PropTypes.any,
      schema: PropTypes.any,
      loading: PropTypes.bool,
      withSelection: PropTypes.bool,
      withRowHeaders: PropTypes.bool,
      withColHeaders: PropTypes.bool,
      onRowSelected: PropTypes.func
    }

    renderCellHeader() {
      const { schema } = this.props
      return schema.fields.map((field, index) => (
        <th className='' key={'th' + index}>
          <ColName field={field} {...this.props} />
        </th>
      ))
    }

    render() {
      const {
        store,
        schema,
        withSelection,
        withColHeaders,
        withRowHeaders,
        entities,
        onRowSelected = noop
      } = this.props
      if (withColHeaders) {
        return (
          <React.Fragment>
            <tr>
              {withRowHeaders && <th>{''}</th>}
              {withSelection && <th className='' />}
              {schema.fields.map((field, index) => (
                <th
                  className=''
                  key={'th-letter' + index}
                >
                  {getChar(index)}
                </th>
              ))}
            </tr>
            <tr>
              {withRowHeaders && <th>{''}</th>}
              {withSelection && (
                <th className=''>
                  <Checkbox
                    checked={store.allSelectedChecked}
                    onChange={() => {
                      store.handleSelectAll(entities)
                      onRowSelected(store.rowSelection)
                    }}
                  />
                </th>
              )}
              {this.renderCellHeader()}
            </tr>
          </React.Fragment>
        )
      } else {
        return (
          <tr>
            {withRowHeaders && <th>{''}</th>}
            {withSelection && (
              <th className=''>
                <Checkbox
                  checked={store.allSelectedChecked}
                  onChange={() => {
                    store.handleSelectAll(entities)
                    onRowSelected(store.rowSelection)
                  }}
                />
              </th>
            )
            }
            {this.renderCellHeader()}
          </tr >
        )
      }
    }
  }
)
