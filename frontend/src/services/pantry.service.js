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

// approve
async function setApproved(pantry_id, reservation_id) {
  return request({
    //    /pantries/:pantry_id/reservations/:action/:reservation_id
    //    :action can be either "approve", "cancel", or "complete"
    url: "/pantries/" + pantry_id + "/reservations/approve/" + reservation_id,
    method: "PUT",
    withCredentials: true,
  });
}

// complete
async function setPickedUp(pantry_id, reservation_id) {
  return request({
    //    /pantries/:pantry_id/reservations/:action/:reservation_id
    //    :action can be either "approve", "cancel", or "complete"
    url: "/pantries/" + pantry_id + "/reservations/complete/" + reservation_id,
    method: "PUT",
    withCredentials: true,
  });
}

// cancel
async function setCancelled(pantry_id, reservation_id) {
  return request({
    //    /pantries/:pantry_id/reservations/:action/:reservation_id
    //    :action can be either "approve", "cancel", or "complete"
    url: "/pantries/" + pantry_id + "/reservations/cancel/" + reservation_id,
    method: "PUT",
    withCredentials: true,
  });
}

async function updatePantryInfo(pantry_id, updInfo) {
  return request({
    url: "pantries/" + pantry_id,
    method: "PUT",
    data: updInfo, // update
    withCredentials: true,
  });
}

async function updateOpenHours(pantry_id, updDay, updHours) {
  return request({
    //    /pantries/:pantry_id/hours/:day
    url: "pantries/" + pantry_id + "/hours/" + updDay,
    method: "PUT",
    data: updHours,
    withCredentials: true,
  });
}

async function updateEstPickupTime(pantry_id, reservation_id, updTime) {
  console.log("4-1. ", pantry_id);
  console.log("4-2. ", reservation_id);
  console.log("4-3. ", updTime);
  return request({
    // /pantries/:pantry_id/reservations/:reservation_id
    url: "/pantries/" + pantry_id + "/reservations/" + reservation_id,
    method: "PUT",
    data: updTime,
    withCredentials: true,
  });
}

const PantryService = {
  getPantries,
  getDetail,

  // actions for adding/updating food
  updateFoodItem,
  addFoodItemToInventory,

  // actions for a reservation
  setApproved,
  setPickedUp,
  setCancelled,

  // udpate pantry info
  updatePantryInfo,

  // update open hours
  updateOpenHours,

  // update est pickup time
  updateEstPickupTime,
};

export default PantryService;
