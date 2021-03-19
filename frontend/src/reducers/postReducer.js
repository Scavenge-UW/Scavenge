// this is going to evaluate any actions that are committed
// such as fetching our posts and creating a new post

import { FETCH_POSTS, NEW_POSTS } from "../actions/types";

// for our actions we create what are called types
// ../actions/types.js

const initialState = {
  items: [], // posts that come in from actions and is where we put the fetch requests
  item: {}, // represents the single post that we add when we get the response back
};

export default function (state = initialState, action) {
  switch (action.type) {
    default:
      return state;
    // case FETCH_POST:
  }
}
