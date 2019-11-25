const getHeight = props => {
  const { tableName, children, subHeader, paginator = true } = props
  const getHeader = () => {
    if (tableName && subHeader && children) {
      return 10
    } else if (tableName || subHeader || children) {
      return 5
    } else {
      return 0
    }
  }
  const getFooter = () => {
    if (paginator) {
      return 5
    } else return 0
  }
  let header = getHeader()
  let footer = getFooter()
  let body = 94 - header - footer
  return {
    header,
    footer,
    body
  }
}

const toPercent = value => {
  return value.toString() + '%'
}

const getChar = value => {
  return (value + 1 + 9).toString(36).toUpperCase()
}

function resizableGrid(table) {
  console.log('resize initialized')
  let row = table.getElementsByTagName('tr')[0]
  let cols = row ? row.children : undefined
  if (!cols) return
  table.style.overflow = 'hidden'
  let tableHeight = table.offsetHeight

  for (let i = 0; i < cols.length; i++) {
    let div = createDiv(tableHeight)
    cols[i].appendChild(div)
    cols[i].style.position = 'relative'
    setListeners(div)
  }

  function setListeners(div) {
    let pageX, curCol, nxtCol, curColWidth, nxtColWidth

    div.addEventListener('mousedown', function (e) {
      curCol = e.target.parentElement
      nxtCol = curCol.nextElementSibling
      pageX = e.pageX

      let padding = paddingDiff(curCol)

      curColWidth = curCol.offsetWidth - padding
      if (nxtCol) nxtColWidth = nxtCol.offsetWidth - padding
    })

    div.addEventListener('mouseover', function (e) {
      e.target.style.borderRight = '2px solid #137cbd'
    })

    div.addEventListener('mouseout', function (e) {
      e.target.style.borderRight = ''
    })

    document.addEventListener('mousemove', function (e) {
      if (curCol) {
        let diffX = e.pageX - pageX

        if (nxtCol) nxtCol.style.width = nxtColWidth - diffX + 'px'

        curCol.style.width = curColWidth + diffX + 'px'
      }
    })

    document.addEventListener('mouseup', function (e) {
      curCol = undefined
      nxtCol = undefined
      pageX = undefined
      nxtColWidth = undefined
      curColWidth = undefined
    })
  }

  function createDiv(height) {
    let div = document.createElement('div')
    div.style.top = 0
    div.style.right = 0
    div.style.width = '1px'
    div.style.position = 'absolute'
    div.style.cursor = 'col-resize'
    div.style.userSelect = 'none'
    div.style.height = '100%'
    return div
  }

  function paddingDiff(col) {
    if (getStyleVal(col, 'box-sizing') === 'border-box') {
      return 0
    }

    let padLeft = getStyleVal(col, 'padding-left')
    let padRight = getStyleVal(col, 'padding-right')
    return parseInt(padLeft) + parseInt(padRight)
  }

  function getStyleVal(elm, css) {
    return window.getComputedStyle(elm, null).getPropertyValue(css)
  }
}

function noop(params) {

}

export { getHeight, getChar, toPercent, resizableGrid, noop }
