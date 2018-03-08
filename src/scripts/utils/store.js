import React from "react";
import PropTypes from "prop-types";

// Store holds the app state
export class Store {
  constructor() {
    this._state = {};
  }

  get = () => {
    return this._state;
  };

  set = obj => {
    this._state = {
      ...this._state,
      ...obj
    };
  };
}

export class StateProvider extends React.Component {
  static propTypes = {
    appState: PropTypes.object.isRequired
  };

  static childContextTypes = {
    appState: PropTypes.object.isRequired
  };

  getChildContext() {
    const { appState } = this.props;
    return { appState };
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

export const withState = WrappedComponent => {
  return class ConnectedComponent extends React.Component {
    // let’s define what’s needed from the `context`
    static contextTypes = {
      appState: PropTypes.object.isRequired
    };

    render() {
      const { appState } = this.context;

      return <WrappedComponent {...this.props} appState={appState} />;
    }
  };
};
