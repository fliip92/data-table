/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */
import { types, getParent, flow } from 'mobx-state-tree'
import { resizableGrid } from '../utils'
import { cloneDeep } from 'lodash-es'

const generateId = () => {
  let randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
  return randLetter + Date.now()
}

export const tableStore = types
  .model('tableStore', {
    page: types.optional(types.number, 0),
    pageSize: types.optional(types.number, 10),
    pageNumber: types.optional(types.number, 1),
    totalPages: types.optional(types.number, 0),
    totalRows: types.optional(types.number, 0),
    fullScreen: types.optional(types.boolean, false),
    sort: types.optional(types.array(types.string), ['']),
    onRemoveDialog: types.optional(types.boolean, false),
    indexSelected: types.optional(types.map(types.frozen()), {}),
    allSelected: types.optional(types.boolean, false),
    rowSelected: types.optional(types.frozen(), {}),
    id: types.optional(types.string, generateId),
    targetContextMenu: types.optional(types.frozen(), {})
  })
  .views(self => ({
    get contextMenuData() {
      if (self.indexSelected.size > 1) {
        return self.indexSelected._keys.map(key => self.indexSelected.get(key))
      } else {
        return [self.targetContextMenu]
      }
    },
    get rowSelection() {
      return self.indexSelected.forEach((value, key, map) => self.indexSelected.get(key))
    },
    get allSelectedChecked() {
      if (self.indexSelected.size === self.totalRows && self.allSelected) {
        return true
      } else {
        return false
      }
    },
    checked(index) {
      if (self.indexSelected.get(index.toString()) !== undefined) {
        return true
      } else {
        return false
      }
    },
    get className() {
      if (self.fullScreen) {
        return 'table-fullscreen'
      } else {
        return ''
      }
    },
    get tableParams() {
      return {
        pageNumber: self.pageNumber,
        pageSize: self.pageSize
      }
    },
    get allowNext() {
      if (self.totalPages <= self.pageNumber) {
        return true
      }
      return false
    },
    get allowPrev() {
      if (self.pageNumber <= 1) {
        return true
      }
      return false
    }
  }))
  .actions(self => {
    // const remove = flow(function * (model, refetch) {
    //   try {
    //     yield function name(params) {
    //       console.log('deleting')
    //     }
    //     yield refetch()
    //   } catch (error) {
    //     console.log(error)
    //   }
    // })

    return {
      // remove,
      setSort(selection, order, refetch) {
        if (order) {
          self.sort = ['-' + selection]
        } else {
          self.sort = [selection]
        }
        refetch({
          pageNumber: self.pageNumber,
          pageSize: self.pageSize,
          sort: self.sort
        })
      },
      setPage(newPage, results) {
        const parent = getParent(self)
        if (newPage > 1 && newPage <= self.totalPages) {
          self.pageNumber = newPage
          results ? parent.fetchResults() : parent.fetchNewPage()
        }
      },
      init(totalResults = 1) {
        self.page = 1
        self.pageNumber = 1
        self.totalRows = totalResults
        self.totalPages = Math.ceil(totalResults / self.pageSize)
        let table = document.getElementById(self.id)
        resizableGrid(table)
      },
      setRowsPerPage(value, refetch, filterAsPaginator) {
        if (filterAsPaginator) {
          self.page = 1
          self.pageNumber = 1
          self.pageSize = parseInt(value)
          self.totalPages = Math.ceil(self.totalRows / parseInt(value))
          refetch &&
            refetch({ pageNumber: self.pageNumber, pageSize: self.pageSize })
        } else {
          self.page = 1
          self.pageNumber = 1
          self.pageSize = parseInt(value)
          self.totalPages = Math.ceil(self.totalRows / parseInt(value))
          refetch &&
            refetch({ pageNumber: self.pageNumber, pageSize: self.pageSize })
        }
      },
      nextPage(refetch, filterAsPaginator) {
        if (filterAsPaginator) {
          self.pageNumber++
          self.page = self.page + self.pageSize
          refetch({ pageNumber: self.page, pageSize: self.pageSize })
        } else if (self.totalPages > self.pageNumber && !filterAsPaginator) {
          self.pageNumber++
          self.page = self.page + self.pageSize
          refetch &&
            refetch({ pageNumber: self.pageNumber, pageSize: self.pageSize })
        }
      },
      handleFullScreen() {
        self.fullScreen = !self.fullScreen
      },
      prevPage(refetch, filterAsPaginator) {
        if (filterAsPaginator && self.page > 1) {
          self.pageNumber--
          self.page = self.page - self.pageSize
          refetch({ pageNumber: self.page, pageSize: self.pageSize })
        } else if (self.pageNumber > 1 && !filterAsPaginator) {
          self.pageNumber--
          self.page = self.page - self.pageSize
          refetch &&
            refetch({ pageNumber: self.pageNumber, pageSize: self.pageSize })
        }
      },
      handleRemove() {
        self.onRemoveDialog = !self.onRemoveDialog
      },
      selectIndex(index, row) {
        if (self.indexSelected.get(index.toString()) === undefined) {
          self.indexSelected.set(index, cloneDeep(row))
        } else {
          self.indexSelected.delete(index)
        }
      },
      handleSelectAll(entities) {
        self.allSelected = !self.allSelected
        if (self.allSelected) {
          entities.map((row, index) =>
            self.indexSelected.set(index, cloneDeep(row))
          )
        } else {
          self.indexSelected.clear()
        }
      },
      afterCreate() {
        self.page = 1
        self.pageNumber = 1
        self.totalPages = Math.ceil(self.totalRows / self.pageSize)
      },
      handleContextMenu(target) {
        self.targetContextMenu = cloneDeep(target)
      }
    }
  })
