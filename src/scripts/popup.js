import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";
import { Store, StateProvider } from "./utils/store";

const app = document.getElementById("app");
const appState = new Store();

chrome.storage.sync.get("state", items => {
  const prevState = items.state;

  if (prevState) {
    // rehydrate
    appState.set(prevState);
  }

  ReactDOM.render(
    <StateProvider appState={appState}>
      <App />
    </StateProvider>,
    app
  );
});

// communicate with the background script
const port = chrome.runtime.connect();

window.addEventListener(
  "unload",
  function(event) {
    console.log("reached");
    const state = appState.get();
    console.log("state", state);

    port.postMessage({ type: "closed", state });
  },
  true
);
