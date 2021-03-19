// The user constants object contains the redux user action types
// that can be dispatched in the react application, async actions
// that perform http requests involve a request followed by a success
// or error response, so each of these three steps is represented by a
// redux action.
export const userConstants = {
  // on login
  LOGIN_REQUEST = "USERS_LOGIN_REQUEST",
  LOGIN_SUCCESS = "USERS_LOGIN_SUCCESS",
  LOGIN_FAILUE = "USERS_LOGIN_FAILURE",

  // on logout
  LOGOUT = "USERS_LOGOUT",

  // on getAll
  GETALL_REQUEST = "USERS_GETALL_REQUEST",
  GETALL_SUCCESS = "USERS_GETALL_SUCCESS",
  GETALL_FAILURE = "USERS_GETALL_FAILURE",

}