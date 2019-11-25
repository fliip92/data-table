/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */
import React, { Component } from 'react'
import { Button, Classes } from '@blueprintjs/core'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { noop } from '../utils'

export default observer(
  class pagination extends Component {
    static propTypes = {
      totalResults: PropTypes.number,
      store: PropTypes.any,
      refetch: PropTypes.func,
      loading: PropTypes.bool
    }
    componentWillReceiveProps(nextProps) {
      if (nextProps.totalResults !== this.props.store.totalRows) {
        nextProps.store.init(nextProps.totalResults)
      }
    }

    render() {
      const {
        store,
        refetch = noop,
        loading,
        totalResults
      } = this.props
      return (
        <div className='paging-toolbar-container'>
          <Button
            minimal
            icon='fullscreen'
            onClick={() => store.handleFullScreen()}
          />
          <Button
            minimal
            icon='refresh'
            disabled={!refetch || loading}
            onClick={() => {
              refetch()
              store.init(totalResults)
              store.setRowsPerPage(10)
            }}
          />
          <div
            title='Set Page Size'
            className={classNames(Classes.SELECT, Classes.MINIMAL)}
          >
            <select
              className='paging-page-size'
              onChange={e => {}}
              disabled={loading}
              value={store.pageSize}
            >
              {[
                <option key='page-size-placeholder' hidden>
                  {store.pageSize}
                </option>,
                [5, 10, 15, 20, 50, 100, 400].map(size => {
                  return (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  )
                })
              ]}
            </select>
          </div>
          <Button
            onClick={() => store.prevPage(refetch)}
            disabled={store.allowPrev || loading}
            minimal
            className='paging-arrow-left'
            icon='chevron-left'
          />
          <div>
            <div>
              <input
                style={{ marginLeft: 5, width: 35, marginRight: 8 }}
                value={store.pageNumber}
                disabled={loading}
                onChange={e => store.setPage(e.target.value)}
                className={Classes.INPUT}
              />
              of {store.totalPages}{' '}
            </div>
          </div>
          <Button
            style={{ marginLeft: 5 }}
            disabled={store.allowNext || loading}
            icon='chevron-right'
            minimal
            className='paging-arrow-right'
            onClick={() => store.nextPage(refetch)}
          />
        </div>
      )
    }
  }
)
