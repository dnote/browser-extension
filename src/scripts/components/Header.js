import React from "react";

import Link from "./Link";
import MenuToggleIcon from "./MenuToggleIcon";
import CloseIcon from "./CloseIcon";

export default ({ currentPath, toggleMenu, isShowingMenu }) => {
  return (
    <header className="header">
      <Link to="/" className="logo-link">
        <img src="images/dnote-black.png" alt="dnote" className="logo" />
      </Link>

      <a
        href="#toggle"
        className="menu-toggle"
        onClick={e => {
          e.preventDefault();

          toggleMenu();
        }}
      >
        {isShowingMenu ? <CloseIcon /> : <MenuToggleIcon />}
      </a>
    </header>
  );
};
