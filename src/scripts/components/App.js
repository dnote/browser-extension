import React from "react";
import { connect } from "react-redux";
import classnames from "classnames";

import Header from "./Header";
import Home from "./Home";
import Success from "./Success";
import Composer from "./Composer";
import Menu from "./Menu";
import { resetSettings } from "../actions/settings";
import { post } from "../utils/fetch";
import config from "../utils/config";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingMenu: false,
      errorMessage: ''
    };
  }

  componentDidUpdate() {
    const { settings, doResetSettings } = this.props;

    // if session is expired, clear it
    const now = Math.round(new Date().getTime()/1000)
    if (settings.sessionKey && settings.sessionKeyExpiry < now) {
      doResetSettings()
    }
  }

  handleLogout = async (done = () => null) => {
    const { settings, doResetSettings } = this.props;

    try {
      console.log(1);
      const res = await post(`${config.apiEndpoint}/v1/signout`, {}, {
        headers: {
          Authorization: `Bearer ${settings.sessionKey}`
        }
      })
      console.log(2);
      doResetSettings()
      done()
    } catch (e) {
      this.setState({
        errorMessage: `Could not log out: ${e.message}`
      }, done)
    }
  }

  toggleMenu = () => {
    this.setState(prevState => {
      return {
        isShowingMenu: !prevState.isShowingMenu
      };
    });
  };

  renderRoutes = (path, loggedIn) => {
    switch (path) {
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
    const { isShowingMenu, errorMessage } = this.state;

    const { path } = location;
    const isLoggedIn = Boolean(settings.sessionKey);

    return (
      <div className="container">
        <Header toggleMenu={this.toggleMenu} isShowingMenu={isShowingMenu} />

        {isShowingMenu && (
          <Menu
            toggleMenu={this.toggleMenu}
            loggedIn={isLoggedIn}
            onLogout={this.handleLogout}
          />
        )}

        <main>
          {errorMessage && (
            <div className="alert error">
              {errorMessage}
            </div>
          )}

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

const mapDispatchToProps = {
  doResetSettings: resetSettings
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
