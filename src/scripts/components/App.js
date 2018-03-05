import React from "react";

import Header from "./Header";
import Settings from "./Settings";

export default class App extends React.Component {
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

        <Settings appState={appState} />
      </div>
    );
  }
}
