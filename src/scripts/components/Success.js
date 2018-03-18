import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import BookIcon from "./BookIcon";

import { navigate } from "../actions/location";

class Success extends React.Component {
  componentDidMount() {
    window.addEventListener("keydown", this.handleKeydown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeydown);
  }

  handleKeydown = e => {
    e.preventDefault();

    const { doNavigate } = this.props;

    if (e.keyCode === 13) {
      // Enter key
      doNavigate("/");
    } else if (e.keyCode === 27) {
      // ESC key
      window.close();
    }
  };

  render() {
    const { locationState } = this.props;
    const { bookName } = locationState;

    return (
      <div className="success-page">
        <BookIcon width={20} height={20} className="book-icon" />

        <h1 className="heading">
          Saved to {bookName}
        </h1>
        <ul className="key-list">
          <li className="key-item">
            <kbd className="key">Enter</kbd>{" "}
            <div className="key-desc">Go back</div>
          </li>
          <li className="key-item">
            <kbd className="key">ESC</kbd> <div className="key-desc">Close</div>
          </li>
        </ul>
      </div>
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
