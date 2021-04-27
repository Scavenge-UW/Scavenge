import request from './request';

/**
  @param {string} username
*/

function getWishList(username) {
  return request({
    url: '/user/' + username + '/' + 'wishlist',
    method: 'GET',
    withCredentials: true
  });
}




const WishListService = {
  getWishList
}

export default WishListService;
