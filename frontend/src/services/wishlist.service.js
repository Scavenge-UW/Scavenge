import request from "./request";

function getUserWishlist(username) {
  return request({
    url: "/user/" + username + "/wishlist",
    method: "GET",
    withCredentials: true,
  });
}

function addToWishlist(username, updData) {
  return request({
    url: "/user/" + username + "/wishlist/add",
    method: "POST",
    data: updData,
    withCredentials: true,
  });
}

function removeFromWishlist(username, wishlist_id) {
  return request({
    url: "/user/" + username + "/wishlist/remove/" + wishlist_id,
    method: "DELETE",
    withCredentials: true,
  });
}

const WishlistService = { getUserWishlist, addToWishlist, removeFromWishlist };

export default WishlistService;
