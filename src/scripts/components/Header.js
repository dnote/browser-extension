import React from "react";

import Link from "./Link";
import MenuToggleIcon from "./MenuToggleIcon";
import CloseIcon from "./CloseIcon";

export default ({ currentPath, toggleMenu, isShowingMenu }) => {
  return (
    <header className="header">
      <Link to="/" className="logo-link" tabIndex="-1">
        <img src="images/logo-circle.png" alt="dnote" className="logo" />
      </Link>

      <a
        href="#toggle"
        className="menu-toggle"
        onClick={e => {
          e.preventDefault();

          toggleMenu();
        }}
        tabIndex="-1"
      >
        {isShowingMenu ? <CloseIcon /> : <MenuToggleIcon />}
      </a>
    </header>
  );
};
