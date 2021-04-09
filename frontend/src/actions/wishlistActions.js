import { FETCH_WishList } from './types';

import WishListService from '../services/wishlist.service';

// Exports a function with a parameter called dispatch
export const fetchWishList = () => dispatch => {
  WishListService.getWishList()
    .then(wishlist => dispatch({
      type: FETCH_WishList,
      payload: wishlist
    }));
}
