import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "antd/dist/antd.css";
import { store, persistor } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.render(
  // <React.StrictMode>
  <PersistGate persistor={persistor} >
  <Provider store={store}>
    <App />
  </Provider>
  </PersistGate>,
  // </React.StrictMode>
  document.getElementById("root")
);
