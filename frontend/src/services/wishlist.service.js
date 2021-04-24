import request from "./request";

function getUserWishlist(username) {
  return request({
    url: "/user/" + username + "/wishlist",
    method: "GET",
    withCredentials: true,
  });
}

function addToWishlist(username, data) {
  return request({
    url: "/user/" + username + "/wishlist",
    method: "POST",
    data: data,
    withCredentials: true,
  });
}

const WishlistService = { getUserWishlist, addToWishlist };

export default WishlistService;
