import React, { Fragment } from "react";

import Link from "./Link";

export default ({ toggleMenu }) => {
  return (
    <Fragment>
      <ul className="menu">
        <li>
          <Link to="/" onClick={toggleMenu} className="menu-link">
            Home
          </Link>
        </li>
        <li>
          <Link to="/settings" onClick={toggleMenu} className="menu-link">
            Settings
          </Link>
        </li>
      </ul>

      <div className="menu-overlay" onClick={toggleMenu} />
    </Fragment>
  );
};
