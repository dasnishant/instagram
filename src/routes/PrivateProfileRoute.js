import React from "react";
import { Redirect, Route } from "react-router-dom";

function PrivateProfileRoute({ component: Component, userReducer, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        return userReducer.userId ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    ></Route>
  );
}

export default PrivateProfileRoute;
