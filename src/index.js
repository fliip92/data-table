import React, { Component } from 'react'
import Pagination from './modules/pagination'
import Body from './modules/body'
import { getHeight, toPercent } from './utils'
import { tableStore } from './store'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import './styles.scss'
import './styles/index.scss'

export default observer(
  class Table extends Component {
    static propTypes = {
      totalResults: PropTypes.number,
      tableName: PropTypes.string,
      children: PropTypes.element,
      subHeader: PropTypes.element,
      withPagination: PropTypes.bool
    }
    constructor(props) {
      super(props)
      this.state = {
        store: tableStore.create({ totalRows: props.totalResults })
      }
    }

    render() {
      const {
        tableName,
        children,
        subHeader,
        withPagination = true
      } = this.props
      const { className } = this.state.store
      const heights = getHeight(this.props)
      return (
        <div className={classNames('data-table-container', className)}>
          <div>
            <div className='data-table-header'>
              <div className='data-table-title-and-buttons'>
                <span className='data-table-title'>{tableName || ''}</span>
                {children}
              </div>
            </div>
            <div className='data-table-sub-header'>{subHeader}</div>
          </div>
          <div className=''>
            <Body {...this.props} store={this.state.store} />
          </div>
          <div style={{ height: toPercent(heights.footer) }}>
            {withPagination && (
              <Pagination {...this.props} store={this.state.store} />
            )}
          </div>
        </div>
      )
    }
  }
)
