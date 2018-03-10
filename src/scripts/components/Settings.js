import React from "react";

class Settings extends React.Component {
  constructor(props) {
    // super(props);
    // const state = props.appState.get();
    //
    // this.state = {
    //   apiKey: state.apiKey
    // };
    super(props);
    this.state = { apiKey: "" };
  }

  handleSave = e => {
    e.preventDefault();

    const { appState } = this.props;
    const { apiKey } = this.state;

    appState.set({ apiKey });
  };

  render() {
    const { apiKey } = this.state;

    return (
      <div>
        <form onSubmit={this.handleSave}>
          <label>
            Your API Key
            <input
              type="password"
              value={apiKey}
              onChange={e => {
                const val = e.target.value;

                this.setState({ apiKey: val });
              }}
            />
            <input type="submit" value="submit" />
          </label>
        </form>
      </div>
    );
  }
}

export default Settings;
