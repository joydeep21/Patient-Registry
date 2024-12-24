import React from "react"
import { HashRouter } from "react-router-dom"
import Router from "./routers"
import { App as AntdApp } from "antd"
const App: React.FC = () => {
  return (
    <HashRouter basename="/">
      <AntdApp>
        <Router />
      </AntdApp>
    </HashRouter>
  )
}
export default App
