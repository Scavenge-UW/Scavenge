const db = require('../models/db.models.js');

exports.deleteAllDataAction = async (req, res) => {
  async function asyncDelete() {
    try {
      var data = await(db.deleteUserData(req, res));      
      var data = await(db.deletePantryData(req, res));
      var data = await(db.deleteFoodData(req, res));
      var data = await(db.deleteHoursData(req, res));
      var data = await(db.deleteInventoryData(req, res));
      var data = await(db.deleteMessageData(req, res));
      var data = await(db.deleteReservationData(req, res));
      var data = await(db.deleteResFoodData(req, res));
      var data = await(db.deleteUserToPantryData(req, res));
      var data = await(db.deleteWishlistData(req, res));
    } catch(error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed to delete data due to server error."
      });
    };
  }
  // Only use on TEST DB
  globalUseTestDB = 1;
  return asyncDelete();
}