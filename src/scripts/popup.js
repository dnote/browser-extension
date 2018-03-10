import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";

import rootReducer from "./reducers";
import App from "./components/App";

const port = chrome.runtime.connect();

chrome.storage.sync.get("state", items => {
  let initialState;

  const prevState = items.state;
  if (prevState) {
    // rehydrate
    initialState = prevState;
  }

  const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(thunkMiddleware, createLogger))
  );

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("app")
  );

  // persist state on popup close
  window.addEventListener(
    "unload",
    function(event) {
      const state = store.getState();

      port.postMessage({ type: "closed", state });
    },
    true
  );
});
