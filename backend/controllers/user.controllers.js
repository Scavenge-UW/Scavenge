const db = require('../models/user.models.js');

exports.reserveAction = async(req, res) => {
  var foods = req.body.food_ids;
  var quantities = req.body.quantities;
  var errorEncountered = 0;
  // Check quantities
  try {
    foods.forEach(async(food_id, index) => {
      var qty = await(db.checkQuantity(req, res, food_id));

        if (qty[0].quantity < quantities[index]) {
          errorEncountered = 1;
          console.log("Not enough quantity of food_id: " + food_id + ".");
          return res.status(500).json({
            message: "Quantity check failed. Not enough quantity of food_id: " + food_id + "."
          });
        }
    });
  } catch {
    errorEncountered = 1;
    return res.status(500).json({
      message: "Quantity check failed."
    });
  }
  
  // Stop processing if error encountered in last step
  if (errorEncountered) {
    return;
  }

  // Update reservations table
  async function asyncResTable() {
    reservationData = {};
    try {
      reservationData = await(db.reserve(req, res))
      return parseInt(reservationData.insertId);
    } catch(error) {
      errorEncountered = 1;
      console.log(error);
      return res.status(500).json({
        message: "Reservation failed due to server error."
      });
    }
  }
  var res_id = await(asyncResTable());

  // Stop processing if error encountered in last step
  if (errorEncountered) {
    return;
  }

  // Update res_food table
  try {
    foods.forEach(async(food_id, index) => {
      db.updateResFood(req, res, res_id, food_id, quantities[index]);
    })
  } catch (error) {
    errorEncountered = 1;
    console.log(error);
    return res.status(500).json({
      message: "Update to res_food table failed."
    });
  }
  
  // Stop processing if error encountered in last step
  if (errorEncountered) {
    return;
  }

  // Update inventory
  try {
    foods.forEach(async(food_id, index) => {
      db.updateResInventory(req, res, food_id, quantities[index]);
    })
  } catch (error) {
    errorEncountered = 1;
    console.log(error);
    return res.status(500).json({
      message: "Update to inventory table failed."
    });
  }

  // Stop processing if error encountered in last step
  if (errorEncountered) {
    return;
  }

  // Success
  return res.status(200).json({
    message: "Reservation Successful. All dependent tables updated."
  })
}

exports.addToWishlistAction = (req, res) => {
  db.addToWishlist(req, res).then(data => {
    return res.status(200).json(data);
  }).catch(error => {
    console.log(error);
    return res.status(500).json({
      message: "Failed to add to wishlist due to server error. Possible duplicate entry or invalid username/food_id"
    });
  });
}

exports.getWishlistAction = (req, res) => {
  let result = {};
  db.getWishlist(req, res).then(pantryDetail => {
    pantryDetail.forEach(element => {
      if (!(element['pantry_id'] in result)) {
        result[element['pantry_id']] = {};
        result[element['pantry_id']]['foods'] = {};
        result[element['pantry_id']]['hours'] = {};
      }
    }); 

    pantryDetail.forEach(element => {
      result[element['pantry_id']]['pantry_id']     = element['pantry_id'];
      result[element['pantry_id']]['name']          = element['name'];
      result[element['pantry_id']]['address']       = element['address'];
      result[element['pantry_id']]['zip']           = element['zip'];
      result[element['pantry_id']]['city']          = element['city'];
      result[element['pantry_id']]['state']         = element['state'];
      result[element['pantry_id']]['phone_number']  = element['phone_number'];
      result[element['pantry_id']]['email']         = element['email'];
      result[element['pantry_id']]['img_src']       = element['img_src'];
      result[element['pantry_id']]['website']       = element['website'];
      result[element['pantry_id']]['foods'][element['food_id']] = {};
      result[element['pantry_id']]['foods'][element['food_id']]['wishlist_id'] = element['wishlist_id'];
      result[element['pantry_id']]['foods'][element['food_id']]['food_id']     = element['food_id'];
      result[element['pantry_id']]['foods'][element['food_id']]['food_name']   = element['food_name'];
    
      result[element['pantry_id']]['hours'][element['day']] = {};
      result[element['pantry_id']]['hours'][element['day']]['day']   = element['day'];
      result[element['pantry_id']]['hours'][element['day']]['open']    = element['open'];
      result[element['pantry_id']]['hours'][element['day']]['close']   = element['close'];
      result[element['pantry_id']]['hours'][element['day']]['detail']  = element['detail'];
    });

    // Convert into array format without using ids as keys
    let resultsArr = [];
    for (let pantryId in result) {
      const pantry = result[pantryId];
      let pantryInfo = {};
      pantryInfo['pantry_id'] = pantry['pantry_id'];
      pantryInfo['name'] = pantry['name'];
      pantryInfo['address'] = pantry['address'];
      pantryInfo['zip'] = pantry['zip'];
      pantryInfo['city'] = pantry['city'];
      pantryInfo['state'] = pantry['state'];
      pantryInfo['phone_number'] = pantry['phone_number'];
      pantryInfo['email'] = pantry['email'];
      pantryInfo['details'] = pantry['details'];
      pantryInfo['img_src'] = pantry['img_src'];
      pantryInfo['website'] = pantry['website'];

      pantryInfo['foods'] = [];
      pantryInfo['hours'] = [];


      for (const [foodKey, foodData] of Object.entries(pantry['foods'])) {
        let food = {};
        food['food_id'] = foodData['food_id'];
        food['food_name'] = foodData['food_name'];
        food['wishlist_id'] = foodData['wishlist_id'];

        pantryInfo['foods'].push(food);
      }
      
      for (const [hourKey, hourData] of Object.entries(pantry['hours'])) {
        let hour = {};
        hour['day'] = hourData['day'];
        hour['open'] = hourData['open'];
        hour['close'] = hourData['close'];
        hour['detail'] = hourData['detail'];

        pantryInfo['hours'].push(hour);
      }
      resultsArr.push(pantryInfo);
    }
    result = resultsArr;
    return res.status(200).json(result);
  }).catch(error => {
    console.log(error);
    return res.status(500).json({
      message: "Failed to retreive wishlist due to server error."
    });
  });
}

exports.removeFromWishlistAction = (req, res) => {
  db.removeFromWishlist(req, res).then(data => {
    return res.status(200).json(data);
  }).catch(error => {
    console.log(error);
    return res.status(500).json({
      message: "Failed to delete from wishlist due to server error."
    });
  });
}

exports.getUserResAction = (req, res) => {
  let result = {};
 
  db.getUserRes(req, res).then(userRes => {
    userRes.forEach(element => {
      if (!(element['reservation_id'] in result)) {
        result[element['reservation_id']] = {};
        result[element['reservation_id']]['res_foods'] = {};
      }
    }); 

    userRes.forEach(element => {
      result[element['reservation_id']]['reservation_id']    = element['reservation_id'];
      result[element['reservation_id']]['pantry_id']         = element['pantry_id'];
      result[element['reservation_id']]['name']              = element['name'];
      result[element['reservation_id']]['username']          = element['username'];
      result[element['reservation_id']]['order_time']        = element['order_time'];
      result[element['reservation_id']]['estimated_pick_up'] = element['estimated_pick_up'];
      result[element['reservation_id']]['picked_up_time']    = element['picked_up_time'];
      result[element['reservation_id']]['approved']          = element['approved'];
      result[element['reservation_id']]['cancelled']         = element['cancelled'];
      result[element['reservation_id']]['res_foods'][element['res_food_id']] = {};
      result[element['reservation_id']]['res_foods'][element['res_food_id']]['res_food_id']       = element['res_food_id'];
      result[element['reservation_id']]['res_foods'][element['res_food_id']]['res_food_name']     = element['res_food_name'];
      result[element['reservation_id']]['res_foods'][element['res_food_id']]['res_food_quantity'] = element['res_food_quantity'];
    });

    // Convert into array format without using ids as keys
    let resultsArr = [];
    for (let resID in result) {
      const reservation = result[resID];
      let resInfo = {};
      resInfo['reservation_id']     = reservation['reservation_id'];
      resInfo['pantry_id']          = reservation['pantry_id'];
      resInfo['name']               = reservation['name'];
      resInfo['username']           = reservation['username'];
      resInfo['order_time']         = reservation['order_time'];
      resInfo['estimated_pick_up']  = reservation['estimated_pick_up'];
      resInfo['picked_up_time']     = reservation['picked_up_time'];
      resInfo['approved']           = reservation['approved'];
      resInfo['cancelled']          = reservation['cancelled'];

      resInfo['res_foods'] = [];

      for (const [foodKey, resFoodData] of Object.entries(reservation['res_foods'])) {
        let resFood = {};
        resFood['res_food_id']       = resFoodData['res_food_id'];
        resFood['res_food_name']     = resFoodData['res_food_name'];
        resFood['res_food_quantity'] = resFoodData['res_food_quantity'];

        resInfo['res_foods'].push(resFood);
      }

      resultsArr.push(resInfo);
    }
    result = { reservations: resultsArr };
    return res.status(200).json(result);
  }).catch(error => {
    console.log(error);
    return res.status(500).json({
      message: "Failed to retreive user reservations due to server error."
    });
  });
}