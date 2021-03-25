import request from './request';

/**
 * get pantry detail which contains
 * `foods`, `reservations`, and various info
 * 
 * @param {int} pantry_id 
 * @returns Promise a response object
 */
function getDetail(pantry_id) {
  return request({
    url: '/pantries/' + pantry_id,
    method: 'GET',
    withCredentials: true,
  });
}

function updateFoodItem(pantry_id, food_id, updatedData) {
  return request({
    url: '/pantries/' + pantry_id + '/' + food_id,
    method: 'PUT',
    data: updatedData,
    withCredentials: true,
  });
}


const PantryService = {
  getDetail, updateFoodItem
}

export default PantryService;
