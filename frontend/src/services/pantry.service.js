import request from './request';
import FoodService from './food.service';

function getPantries() {
  return request({
    url: '/pantries',
    method: 'GET',
    withCredentials: true
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

async function addFoodItemToInventory(pantry_id, food) {
  // create a new item and get its id
  const foodToAdd = {
    food_name: food.food_name,
    qr_code: Math.round(Math.random()*10000), // TODO: use actual qrcode data
  }
  const addedFood = await FoodService.addFood(foodToAdd);
  const newFoodId = addedFood.insertId;

  return request({
    url: '/pantries/' + pantry_id + '/' + newFoodId,
    method: 'POST',
    data: food,
    withCredentials: true,
  })
}

function updateDetail(pantry, pantryId, token){
  return request({
    url: '/pantries/' + pantryId,
    method: 'PUT',
    data: {
      "username": pantry.username,
      "password": pantry.password,
      "phoneNumber": pantry.phoneNumber,
      "address": pantry.address,
      "city": pantry.city,
      "state": pantry.state,
      "zip": pantry.zip,
      "carDescription": pantry.carDescription,
      "type": pantry.type,
      "email": pantry.email
    },
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const PantryService = {
  getPantries, getDetail, updateFoodItem, addFoodItemToInventory, updateDetail,
}

export default PantryService;
