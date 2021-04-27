import { FETCH_WISHLIST } from "./types";

import WishlistService from "../services/wishlist.service";

// Exports a function with a parameter called dispatch
export const fetchWishlist = () => (dispatch) => {
  WishlistService.getUserWishlist().then((wishlist) =>
    dispatch({
      type: FETCH_WISHLIST,
      payload: wishlist,
    })
  );
};
