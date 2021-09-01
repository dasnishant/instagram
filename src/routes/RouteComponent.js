import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Authentication from "../components/Authentication/Authentication";
import Home from "../components/Home/Home";
import Profile from "../components/Profile/Profile";
import PrivateHomeRoute from "./PrivateHomeRoute";
import PrivateProfileRoute from "./PrivateProfileRoute";

function RouteComponent() {
  const userReducer = useSelector((state) => state.userReducer);

  return (
    <Router>
      <Switch>
        <PrivateHomeRoute
          component={Home}
          userReducer={userReducer}
          exact
          path="/"
        />
        <Route path="/login">
          <Authentication />
        </Route>
        <Route path="/signup">
          <Authentication isSignUp={true} />
        </Route>
        <PrivateProfileRoute
          component={Profile}
          userReducer={userReducer}
          path="/profile/:userId"
          exact
        />
        <Route>
          <p>Error</p>
        </Route>
      </Switch>
    </Router>
  );
}

export default RouteComponent;
