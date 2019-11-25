import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Popover, Menu, MenuItem, Position } from '@blueprintjs/core'
import PropTypes from 'prop-types'
import { noop } from '../utils'

export default observer(
  class colName extends Component {
    static propTypes = {
      store: PropTypes.any,
      refetch: PropTypes.func,
      field: PropTypes.object,
      sorteable: PropTypes.bool
    }
    renderSortMenu(field) {
      const { store, refetch = noop } = this.props
      return (
        <Menu>
          <MenuItem
            icon='sort-asc'
            text='Sort Asc'
            onClick={() => store.setSort(field.path, false, refetch)}
          />
          <MenuItem
            icon='sort-desc'
            text='Sort Desc'
            onClick={() => store.setSort(field.path, true, refetch)}
          />
        </Menu>
      )
    }
    render() {
      const { field, sorteable = false } = this.props
      return (
        <div className='bp3-table-header bp3-table-cell-col-0 bp3-table-column-header-cell'>
          <div className='bp3-table-column-name' title={field.displayName}>
            <div
              className='bp3-table-th-menu-container'
              style={sorteable ? { top: '-6px' } : { display: 'none' }}
            >
              <div className='bp3-table-th-menu-container-background' />
              <span className='bp3-popover-wrapper bp3-table-th-menu'>
                <Popover
                  content={this.renderSortMenu(field)}
                  position={Position.BOTTOM}
                >
                  <span className='bp3-popover-target'>
                    <span
                      icon='chevron-down'
                      className='bp3-icon bp3-icon-chevron-down' >
                      <svg
                        data-icon='chevron-down'
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                      >
                        <desc>chevron-down</desc>
                        <path
                          d='M12 5c-.28 0-.53.11-.71.29L8 8.59l-3.29-3.3a1.003 1.003 0 0 0-1.42 1.42l4 4c.18.18.43.29.71.29s.53-.11.71-.29l4-4A1.003 1.003 0 0 0 12 5z'
                          fillRule='evenodd'
                        />
                      </svg>
                    </span>
                  </span>
                </Popover>
              </span>
            </div>
            <div className='bp3-table-column-name-text'>
              <div className='bp3-table-truncated-text'>
                {field.displayName}
              </div>
            </div>
          </div>
          <div className='bp3-table-header-content' />
        </div>
      )
    }
  }
)
