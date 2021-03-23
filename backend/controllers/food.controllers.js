const db = require('../models/food.models.js');

exports.getAllFoodsAction = (req, res) => {
  db.getAllFoods(req, res).then(allFoods => {
    return res.status(200).json(allFoods);
  }).catch(error => {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get all foods."
    });
  });
}