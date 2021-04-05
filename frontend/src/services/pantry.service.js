import request from "./request";
import FoodService from "./food.service";

function getPantries() {
  return request({
    url: "/pantries",
    method: "GET",
    withCredentials: true,
  });
}

/**
 * get pantry detail which contains
 * `foods`, `reservations`, and various info
 *
 * @param {int} pantry_id
 * @returns Promise a response object
 */
function getDetail(pantry_id) {
  return request({
    url: "/pantries/" + pantry_id,
    method: "GET",
    withCredentials: true,
  });
}

function updateFoodItem(pantry_id, food_id, updatedData) {
  return request({
    url: "/pantries/" + pantry_id + "/" + food_id,
    method: "PUT",
    data: updatedData,
    withCredentials: true,
  });
}

async function addFoodItemToInventory(pantry_id, food) {
  // create a new item and get its id
  const foodToAdd = {
    food_name: food.food_name,
    qr_code: Math.round(Math.random() * 10000), // TODO: use actual qrcode data
  };
  const addedFood = await FoodService.addFood(foodToAdd);
  const newFoodId = addedFood.insertId;

  return request({
    url: "/pantries/" + pantry_id + "/" + newFoodId,
    method: "POST",
    data: food,
    withCredentials: true,
  });
}

async function setApproved(pantry_id, reservation_id) {
  return request({
    //    /pantries/:pantry_id/reservations/:action/:reservation_id
    //    :action can be either "approve", "cancel", or "complete"
    url: "/pantries/" + pantry_id + "/reservations/approve/" + reservation_id,
    method: "PUT",
    data: 1,
    withCredentials: true,
  });
}

async function setPickedUp(pantry_id, reservation_id) {
  return request({
    //    /pantries/:pantry_id/reservations/:action/:reservation_id
    //    :action can be either "approve", "cancel", or "complete"
    url: "/pantries/" + pantry_id + "/reservations/complete/" + reservation_id,
    method: "PUT",
    data: 1,
    withCredentials: true,
  });
}

async function setCancelled(pantry_id, reservation_id) {
  return request({
    //    /pantries/:pantry_id/reservations/:action/:reservation_id
    //    :action can be either "approve", "cancel", or "complete"
    url: "/pantries/" + pantry_id + "/reservations/cancel/" + reservation_id,
    method: "PUT",
    data: 1,
    withCredentials: true,
  });
}

const PantryService = {
  getPantries,
  getDetail,
  updateFoodItem,
  addFoodItemToInventory,
  setApproved,
  setPickedUp,
  setCancelled,
};

export default PantryService;
