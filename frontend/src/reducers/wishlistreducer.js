import { FETCH_WishList } from '../actions/types';

const initalState = {
  wishlist: {}
}

export default (state = initalState, action) => {
  const { type, payload } = action;

  switch(type) {
    case FETCH_WishList:
      return {
        ...state,
        wishlist: payload
      };
    default:
      return state;
  }
}
