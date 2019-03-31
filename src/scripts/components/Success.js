import React, { Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Error from "./Error";
import ext from "../utils/ext";
import config from "../utils/config";

import BookIcon from "./BookIcon";

import { navigate } from "../actions/location";

class Success extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMsg: ''
    };
  }
  componentDidMount() {
    window.addEventListener("keydown", this.handleKeydown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeydown);
  }

  handleKeydown = e => {
    e.preventDefault();

    const { doNavigate, locationState } = this.props;

    if (e.keyCode === 13) {
      // Enter key
      doNavigate("/");
    } else if (e.keyCode === 27) {
      // ESC key
      window.close();
    } else if (e.keyCode === 66) {
      // b key
      const { noteUUID } = locationState;
      const url = `${config.webUrl}/app/notes/${noteUUID}`;

      ext.tabs.create({ url }).then(() => {
        window.close();
      }).catch(err => {
        this.setState({ errorMsg: err.message });
      });
    }
  };

  render() {
    const { locationState } = this.props;
    const { errorMsg } = this.state;
    const { bookName } = locationState;

    return (
      <Fragment>
        {errorMsg && <Error message={errorMsg} />}

        <div className="success-page">
          <div>
            <BookIcon width={20} height={20} className="book-icon" />

            <h1 className="heading">
              Saved to {bookName}
            </h1>
          </div>

          <ul className="key-list">
            <li className="key-item">
              <kbd className="key">Enter</kbd>{" "}
              <div className="key-desc">Go back</div>
            </li>
            <li className="key-item">
              <kbd className="key">b</kbd>{" "}
              <div className="key-desc">Open in browser</div>
            </li>
            <li className="key-item">
              <kbd className="key">ESC</kbd> <div className="key-desc">Close</div>
            </li>
          </ul>
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    locationState: state.location.state
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        doNavigate: navigate
      },
      dispatch
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Success);
