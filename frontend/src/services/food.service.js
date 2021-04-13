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

function searchFood(food_names) {
  return request({
    url: "/pantries/search/",
    method: "POST",
    data: { foods: food_names },
  });
}

const FoodService = {
  getFoods,
  addFood,
  searchFood,
};

export default FoodService;
