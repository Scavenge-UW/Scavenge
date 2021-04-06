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
  db.getWishlist(req, res).then(wishlist => {
    return res.status(200).json(wishlist);
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