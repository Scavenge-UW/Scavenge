// To install Redux, React-Redux, and Redux-Thunk, run the command:
//   - npm i redux react-redux redux-thunk
// [note]:
//  redux
//    - redux itself has nothing to do with react
//    - you can use redux on it own or with other frameworks
//    - but works really well with react
//  react-redux
//    - the react library that binds react and redux together
//  react-thunk
//    - a middleware for redux which allows us to directly access the Dispatch method
//    - so we can make asynchrnous calls to from our actions

import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const initialState = {};

const middleware = [thunk];

// for redux to work on both Safari and Chrome
// reference: https://stackoverflow.com/questions/46540617/redux-dev-tool-option-does-not-work-on-safari
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(applyMiddleware(...middleware));

const store = createStore(rootReducer, initialState, enhancer);

export default store;
