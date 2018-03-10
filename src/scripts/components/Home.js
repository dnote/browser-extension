import React from "react";

import Link from "./Link";

export default () => {
  return (
    <div className="home">
      <h1 className="greet">Welcome to Dnote</h1>

      <p className="lead">A home for your engineering microlesson</p>

      <Link to="/login" className="button button-first button-small login-btn">
        Login
      </Link>

      <div className="actions">
        <a href="https://dnote.io/cloud" target="_blank" className="signup">
          Sign Up
        </a>
      </div>
    </div>
  );
};
