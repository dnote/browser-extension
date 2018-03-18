import React from "react";
import { connect } from "react-redux";
import classnames from "classnames";

import Header from "./Header";
import Home from "./Home";
import Settings from "./Settings";
import Success from "./Success";
import Composer from "./Composer";
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

  renderRoutes = (path, loggedIn) => {
    console.log("rendering", path);
    switch (path) {
      case "/settings":
        return <Settings />;
      case "/success":
        return <Success />;
      case "/":
        if (loggedIn) {
          return <Composer />;
        }

        return <Home />;
      default:
        return <div>Not found</div>;
    }
  };

  render() {
    const { location, settings } = this.props;
    const { isShowingMenu } = this.state;

    const { path } = location;
    const isLoggedIn = Boolean(settings.apiKey);

    return (
      <div className="container">
        <Header toggleMenu={this.toggleMenu} isShowingMenu={isShowingMenu} />

        {isShowingMenu && <Menu toggleMenu={this.toggleMenu} />}

        <main>
          {this.renderRoutes(path, isLoggedIn)}
        </main>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    location: state.location,
    settings: state.settings
  };
}

export default connect(mapStateToProps)(App);
