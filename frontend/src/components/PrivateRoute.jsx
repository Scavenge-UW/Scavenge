// The react private route component renders a route component if the
// user is logged in, otherwise it redirects the user to the /login page.
import React from "react";
import { Route, Redirect } from "react-router-dom";

// The way it checks if the user is logged in is by checking that there
// is a user object in local storage. While it's possible to bypass this
// check by manually adding an object to local storage using browser dev
// tools, this would only give access to the client side component, it
// wouldn't give access to any real secure data from the server api because
// a valid authentication token (JWT) is required for this.
export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      localStorage.getItem("user") ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: "/login", state: { from: props.location } }}
        />
      )
    }
  />
);
