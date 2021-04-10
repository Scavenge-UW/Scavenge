import request from "./request";

function getFoods() {
  return request({
    url: "/foods",
    method: "GET",
    withCredentials: true,
  });
}

/**
 * get pantry detail which contains
 * `foods`, `reservations`, and various info
 *
 * @param {Object} food of keys food_name and qr_code
 * @returns Promise a response object
 */
function addFood(food) {
  return request({
    url: "/foods/",
    method: "POST",
    data: food,
    withCredentials: true,
  });
}

function searchFood(food_id) {
  return request({
    url: "/pantries/search/" + food_id,
    method: "GET",
  });
}

const FoodService = {
  getFoods,
  addFood,
  searchFood,
};

export default FoodService;
