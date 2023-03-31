import React from "react";
import ReactDOM from "react-dom/client";
import App from "./js/App";
import "./css/index.scss";
import { Provider } from "react-redux";
import { store } from "./js/redux/store";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
