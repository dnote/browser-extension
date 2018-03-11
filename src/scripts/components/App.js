import React from "react";
import { connect } from "react-redux";
import classnames from "classnames";

import Header from "./Header";
import Home from "./Home";
import Settings from "./Settings";
import Menu from "./Menu";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingMenu: false
    };
  }

  toggleMenu = () => {
    this.setState(prevState => {
      return {
        isShowingMenu: !prevState.isShowingMenu
      };
    });
  };

  renderRoutes = path => {
    console.log("rendering", path);
    switch (path) {
      case "/settings":
        return <Settings />;
      default:
        return <Home />;
    }
  };

  render() {
    const { appState, location } = this.props;
    const { isShowingMenu } = this.state;

    const { path } = location;

    return (
      <div className="container">
        <Header toggleMenu={this.toggleMenu} isShowingMenu={isShowingMenu} />

        {isShowingMenu && <Menu toggleMenu={this.toggleMenu} />}

        <main>
          {this.renderRoutes(path)}
        </main>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    location: state.location
  };
}

export default connect(mapStateToProps)(App);
