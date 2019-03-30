import React from "react";
import { findDOMNode } from "react-dom";

import Link from "./Link";

export default () => {
  return (
    <div className="home">
      <h1 className="greet">Welcome to Dnote</h1>

      <p className="lead">A simple and encrypted notebook</p>

      <form action="">
        <input type="email" placeholder="your@email.com" />
        <input type="password" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" />

        <input type="submit" value="Login" className="button button-first button-small login-btn" />
      </form>

      <div className="actions">
        <a href="https://dnote.io/join" target="_blank" className="signup">
          Sign Up
        </a>
      </div>
    </div>
  );
};
