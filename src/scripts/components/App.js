import React from "react";

import Header from "./Header";
import Settings from "./Settings";

import { withState } from "../utils/store";

class App extends React.Component {
  componentDidMount() {
    const { appState } = this.props;

    console.log("initial appState", appState.get());

    appState.set({ what: 1234 });
  }

  render() {
    const { appState } = this.props;

    return (
      <div>
        <Header />

        <Settings />
      </div>
    );
  }
}

export default withState(App);
