/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */
import React, { Component } from 'react'
import {
  Checkbox,
  Menu,
  MenuItem,
  Intent,
  ContextMenu,
  Icon
} from '@blueprintjs/core'
import { get, size } from 'lodash-es'
import { observer } from 'mobx-react'
import Thead from './thead'
import PropTypes from 'prop-types'
import { noop } from '../utils'

const fakeCols = [0, 1, 2, 3, 4]
const fakeRows = [0]

const loadingCell = (
  <div style={{ height: '10px', verticalAlign: 'middle' }}>
    <div className='bp3-skeleton' style={{ height: '10px' }} />
  </div>
)

// @ContextMenuTarget
class body extends Component {
  static propTypes = {
    entities: PropTypes.array,
    customRender: PropTypes.func,
    contextMenu: PropTypes.any,
    onRemove: PropTypes.bool,
    store: PropTypes.any,
    refetch: PropTypes.func,
    schema: PropTypes.any,
    loading: PropTypes.bool,
    withSelection: PropTypes.bool,
    withRowHeaders: PropTypes.bool,
    onRowSelected: PropTypes.func,
    doubleClick: PropTypes.func,
    minimal: PropTypes.bool,
    dark: PropTypes.bool
  }
  renderCell(field, index, row) {
    const { entities, customRender } = this.props
    if (typeof get(customRender, field.path) === 'function') {
      return customRender[field.path](
        entities[index],
        row,
        get(row, field.path)
      )
    } else if (field.type === 'boolean') {
      if (get(row, field.path)) {
        return <Icon icon='small-tick' intent={Intent.SUCCESS} />
      } else {
        return <Icon icon='small-cross' intent={Intent.DANGER} />
      }
    } else {
      return get(row, field.path)
    }
  }

  renderContextMenu() {
    const {
      contextMenu,
      onRemove,
      store: { contextMenuData }
    } = this.props
    const menu = []
    if (contextMenu) {
      menu.push(contextMenu(contextMenuData))
    }

    if (onRemove) {
      const removeMenu = (
        <MenuItem
          key='remove-item'
          onClick={() => { }}
          text='Delete'
        />
      )
      menu.push(removeMenu)
    }
    if (size(menu)) {
      return <Menu>{menu}</Menu>
    } else {
      return ContextMenu.hide()
    }
  }

  renderTbody() {
    const {
      loading,
      schema,
      entities,
      withSelection,
      withRowHeaders,
      onRowSelected = noop,
      store,
      doubleClick
    } = this.props
    if (loading) {
      if (size(entities)) {
        return entities.map((row, index) => (
          <tr key={index} className='simple-table-row'>
            {fakeCols.map(field => (
              <td key={field} className='simple-table-cell'>
                {loadingCell}
              </td>
            ))}
          </tr>
        ))
      }
      return fakeRows.map((row, index) => (
        <tr key={index} className='simple-table-row'>
          {fakeCols.map(field => (
            <td key={field} className='simple-table-cell'>
              {loadingCell}
            </td>
          ))}
        </tr>
      ))
    } else if (!size(entities)) {
      return (
        <tr className='tr-empty-rows'>
          <td className='td-empty-rows'>No records found.</td>
        </tr>
      )
    } else {
      return entities.map((row, index) => (
        <tr
          key={index}
          className={
            store.checked(index)
              ? ''
              : ''
          }
        >
          {withRowHeaders && (
            <td className=''>
              {index + 1}
            </td>
          )}
          {withSelection && (
            <td className=''>
              <Checkbox
                style={{ position: 'absolute', marginTop: '-6px' }}
                checked={store.checked(index)}
                onChange={() => {
                  store.selectIndex(index, row)
                  onRowSelected(store.rowSelection)
                }}
              />
            </td>
          )}
          {schema.fields.map(field => (
            <td
              style={doubleClick && { cursor: 'pointer' }}
              key={field.path}
              className=''
              onContextMenu={() => store.handleContextMenu(row)}
              onDoubleClick={() => {
                if (doubleClick) doubleClick(row, store)
              }}
            >
              {this.renderCell(field, index, row)}
            </td>
          ))}
        </tr>
      ))
    }
  }

  getClassName(dark, minimal) {
    if (dark && minimal) {
      return 'dark-minimal'
    } else if (dark) {
      return 'dark'
    } else if (minimal) {
      return 'minimal'
    } else {
      return 'data-table'
    }
  }

  render() {
    const { store, dark, minimal } = this.props
    return (
      <table
        id={store.id}
        className={this.getClassName(dark, minimal)}
      >
        <thead className=''>
          <Thead {...this.props} />
        </thead>
        <tbody>{this.renderTbody()}</tbody>
      </table>
    )
  }
}
export default observer(body)
