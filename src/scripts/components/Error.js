import React from "react";

export default ({ message, type }) => {
  return (
    <div className="alert error">
      Error: {message}
    </div>
  );
};
