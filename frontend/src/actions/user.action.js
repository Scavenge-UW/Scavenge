// This file contains Redux action creators for actions related to users.
import { userConstants } from "../constants";
import { userService } from "../services";
// import { alerActions } from "./alert.actions";
import { alerActions } from "./"; // ? from index file?
import { history } from "../helpers";

export const userActions = {
  login,
  logout,
  getAll,
};

/**
 * 1. dispatches a LOGIN_REQUEST action with dispatch(request({ username }));
 * 2. calls the async task userService.login(username, password)
 * 3. dispatches a LOGIN_SUCCESS with dispatch(success(user)); if login was successful
 *    dispatches a LOGIN_FAILURE action with dispatch(failure(error)); if login failed
 */
//
function login(username, password) {
  return (dispatch) => {
    dispatch(request({ username }));

    userService.login(username, password).then(
      (user) => {
        dispatch(success(user));
        history.push("/");
      },
      (error) => {
        dispatch(failure(error));
        dispatch(alertActions.error(error));
      }
    );
  };

  // nested action creator functions
  // only exist within the scope of the parent (login) function
  function request(user) {
    return { type: userConstants.LOGIN_REQUEST, user };
  }
  function success(user) {
    return { type: userConstants.LOGIN_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.LOGIN_FAILUE, error };
  }
}

function logout() {
  userService.logout();
  return { type: userConstants.LOGOUT };
}

function getAll() {
  return (dispatch) => {
    dispatch(request());

    userService.getAll().then(
      (users) => dispatch(success(users)),
      (error) => {
        dispatch(failure(error));
        dispatch(alertActions.error(error));
      }
    );
  };

  // nested action creator functions
  function request() {
    return { type: userConstants.GETALL_REQUEST };
  }
  function success(user) {
    return { type: userConstants.GETALL_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.GETALL_FAILURE, error };
  }
}
