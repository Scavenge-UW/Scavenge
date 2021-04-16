const express = require('express');
const router = express.Router();

const { getAllFoodsAction } = require("../controllers/food.controllers.js");
const { addFoodAction } = require("../controllers/food.controllers.js");

const authMiddleware = require("../middleware/auth.middleware");

router.route('/foods')
  .get(getAllFoodsAction)
  .post(authMiddleware.verifyAndGetUserInfo, authMiddleware.requireLogin, addFoodAction)

module.exports = router; // We need this at the end of every route file