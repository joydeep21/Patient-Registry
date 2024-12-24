import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { persistor, store } from "./app/store"
import App from "./App"
import "./index.css"
import { PersistGate } from "redux-persist/integration/react"
import { StyleProvider } from "@ant-design/cssinjs"
import { ConfigProvider } from "antd"
import en_US from "antd/locale/en_US"
import "dayjs/locale/en-gb"
import { themeConfig } from "./utils/themeConfig"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ConfigProvider locale={en_US} theme={themeConfig}>
        <StyleProvider hashPriority="high">
          <App />
        </StyleProvider>
      </ConfigProvider>
    </PersistGate>
  </Provider>,
)
