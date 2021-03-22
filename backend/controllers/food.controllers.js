const db = require('../models/food.models.js');

exports.getAllFoodsAction = (req, res) => {
  db.getAllFoods(req, res).then(allFoods => {
    return res.json(allFoods);
  }).catch(error => {
    console.log(error);
  });
}

exports.addFoodAction = (req, res) => {
  db.addFood(req, res).then(data => {
    return res.json(data);
  }).catch(error => {
    console.log(error);
  });
}