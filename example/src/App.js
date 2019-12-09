import React from "react";
import useDarkMode from './useDarkMode'
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


export default () => {
  const [theme, toggleTheme] = useDarkMode()
  return (
    <div
      style={{
        background: theme === 'dark' ? '#000' : '#fff',
        color: theme === 'dark' ? '#fff' : '#000',
        width: "100%",
        height: "100vh",
      }}
    >
      <div className="">
        <i onClick={toggleTheme} className={`far fa-${theme === 'dark' ? 'sun' : 'moon'}`}></i>
      </div>
      <div className="table-container">
        <Table
          minimal={false}
          dark={theme === "dark"}
          schema={schema}
          entities={data}
          totalResults={data.length}
          withRowHeaders={true}
          withSelection={true}
        />
      </div>
    </div>
  )
}
