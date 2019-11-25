import React, { Component } from 'react'

import Table from 'data-table'

const data = [
  { test1: "testing here", test2: "and here" },
  { test1: "lets see", test2: "and here too" }
]

const schema = {
  fields: [
    {
      displayName: "test 1",
      path: "test1"
    },
    {
      displayName: "test 2",
      path: "test2"
    }
  ],
  model: ""
}
export default class App extends Component {
  render() {
    return (
      <div style={{ height: "100%", padding: "10px" }}>
        <Table
          schema={schema}
          entities={data}
          totalResults={data.length}
          withRowHeaders={true}
          withSelection={true}
        />
      </div>
    )
  }
}
