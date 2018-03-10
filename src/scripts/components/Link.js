import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { navigate } from "../actions/location";

class Link extends React.Component {
  render() {
    const { to, doNavigate, children, onClick, ...restProps } = this.props;

    return (
      <a
        href={`${to}`}
        onClick={e => {
          e.preventDefault();

          doNavigate(to);

          if (onClick) {
            onClick();
          }
        }}
        {...restProps}
      >
        {children}
      </a>
    );
  }
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

export default connect(null, mapDispatchToProps)(Link);
