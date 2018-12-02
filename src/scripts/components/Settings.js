import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { updateSettings } from "../actions/settings";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { apiKey: props.settings.apiKey, successMessage: "" };
  }

  handleSave = e => {
    e.preventDefault();

    const { doUpdateSettings } = this.props;
    const { apiKey } = this.state;

    this.setState({ successMessage: "" }, () => {
      doUpdateSettings({ apiKey });

      this.setState({
        successMessage: "Saved"
      });
    });
  };

  render() {
    const { apiKey, successMessage } = this.state;

    return (
      <div className="settings">
        {successMessage &&
          <div className="message">
            {successMessage}
          </div>}

        <form onSubmit={this.handleSave}>
          <label className="label" htmlFor="api-key">
            Your API Key
          </label>
          <input
            autoFocus
            id="api-key"
            className="input"
            type="password"
            value={apiKey}
            onChange={e => {
              const val = e.target.value;

              this.setState({ apiKey: val });
            }}
          />

          <p className="hint">
            Sign up <a href="https://dnote.io/pricing">here</a> or get it from
            your profile page.
          </p>

          <div className="actions">
            <input
              type="submit"
              value="Confirm"
              className="button button-small button-first"
            />
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        doUpdateSettings: updateSettings
      },
      dispatch
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
