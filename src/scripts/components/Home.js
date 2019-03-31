import React from "react";
import { connect } from "react-redux";
import { findDOMNode } from "react-dom";

import { loginHelper, aes256GcmDecrypt } from '../utils/crypto'
import { utf8ToBuf, b64ToBuf, bufToB64 } from '../utils/encoding'
import { get, post } from "../utils/fetch";
import config from "../utils/config";
import { updateSettings } from "../actions/settings";

import Link from "./Link";

class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      errorMessage: ''
    }
  }

  onLogin = (e) => {
    e.preventDefault();

    const { doUpdateSettings } = this.props;
    const { email, password,  } = this.state;

    this.setState({ errorMessage: '', loggingIn: true }, async () => {
      try {
        const { iteration } = await get(`${config.apiEndpoint}/v1/presignin?email=${email}`)
        if (iteration === 0) {
          throw new Error('You have a legacy account. Please login from https://dnote.io/legacy/login')
        }
        if (email == '' || password == '') {
          throw new Error('Please enter the credential.')
        }

        const { masterKey, authKey } = await loginHelper({ email, password, iteration })
        const signinResp = await post(`${config.apiEndpoint}/v1/signin`, { email, auth_key: authKey })

        const cipherKey = await aes256GcmDecrypt(
          b64ToBuf(masterKey),
          b64ToBuf(signinResp.cipher_key_enc)
        );

        doUpdateSettings({
          sessionKey: signinResp.key,
          sessionKeyExpiry: signinResp.expires_at,
          cipherKey: bufToB64(cipherKey)
        })
      } catch (e) {
        console.log('error while logging in', e);
        this.setState({
          errorMessage: e.message,
          loggingIn: false
        })
      }
    })
  }

  render() {
    const { email, password, errorMessage, loggingIn } = this.state;

    return (
      <div className="home">
        <h1 className="greet">Welcome to Dnote</h1>

        <p className="lead">A simple and encrypted notebook</p>

        {errorMessage && (
          <div className="alert error">
            {errorMessage}
          </div>
        )}

        <form id="login-form" onSubmit={this.onLogin}>
          <label htmlFor="email-input">
            Email
          </label>

          <input
            type="email"
            placeholder="your@email.com"
            className="input login-input"
            id="email-input"
            value={email}
            onChange={e => {
              this.setState({
                email: e.target.value
              })
            }}
          />

          <label htmlFor="password-input">
            Password
          </label>
          <input
            type="password"
            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
            className="input login-input"
            id="password-input"
            value={password}
            onChange={e => {
              this.setState({
                password: e.target.value
              })
            }}
          />

          <button type="submit" className="button button-first button-small login-btn" disabled={loggingIn}>
            {loggingIn ? 'Signing in...' : 'Signin'}
          </button>
        </form>

        <div className="actions">
          Don't have an account? <a href="https://dnote.io/join" target="_blank" className="signup">Sign Up</a>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  doUpdateSettings: updateSettings
}

export default connect(null, mapDispatchToProps)(Home);
