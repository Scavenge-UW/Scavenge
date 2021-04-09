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
      result[element['pantry_id']]['foods'][element['food_id']]['food_id']    = element['food_id'];
      result[element['pantry_id']]['foods'][element['food_id']]['food_name']  = element['food_name'];
    
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