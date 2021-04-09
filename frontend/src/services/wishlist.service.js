import request from './request';

function getWishList(user) {
  return request({
    url: '/user/' + user.username + '/' + 'wishlist'
    method: 'GET',
    withCredentials: true
  });
}




const WishListService = {
  getWishList
}

export default WishListService;
