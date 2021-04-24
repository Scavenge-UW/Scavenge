import request from "./request";

function getUserWishlist(username) {
  return request({
    url: "/user/" + username + "/wishlist",
    method: "GET",
    withCredentials: true,
  });
}

const WishlistService = { getUserWishlist };

export default WishlistService;
