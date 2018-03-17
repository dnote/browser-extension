import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";

import rootReducer from "./reducers";
import App from "./components/App";

const port = chrome.runtime.connect();

const appContainer = document.getElementById("app");

chrome.storage.sync.get("state", items => {
  if (chrome.runtime.lastError) {
    appContainer.innerText = `Failed to retrieve previous app state ${chrome
      .runtime.lastError.message}`;
    return;
  }

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
    appContainer,
    () => {
      // On Chrome, popup window size is kept at minimum if app render is delayed
      // Therefore add minimum dimension to body until app is rendered
      document.getElementsByTagName("body")[0].className = "";
    }
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
