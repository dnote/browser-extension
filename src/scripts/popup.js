import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";

import rootReducer from "./reducers";
import { debounce } from "./utils/perf";
import { loadState, saveState } from "./utils/storage";
import App from "./components/App";
import ext from "./utils/ext";

const port = ext.runtime.connect();

const appContainer = document.getElementById("app");

loadState(items => {
  if (ext.runtime.lastError) {
    appContainer.innerText = `Failed to retrieve previous app state ${
      ext.runtime.lastError.message
    }`;
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

  store.subscribe(
    debounce(() => {
      const state = store.getState();

      saveState(state);
    }, 100)
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
});
