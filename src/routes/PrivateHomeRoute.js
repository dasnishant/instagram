import React from "react";
import { Redirect, Route } from "react-router-dom";

function PrivateHomeRoute({ component: Component, userReducer, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        return userReducer.userId ? (
          <Component {...props} userReducer={userReducer} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    ></Route>
  );
}

export default PrivateHomeRoute;
