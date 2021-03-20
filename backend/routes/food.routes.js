const express = require('express');
const router = express.Router();

const { getAllFoodsAction } = require("../controllers/food.controllers.js");

// Get all foods
router.get('/foods', getAllFoodsAction);

module.exports = router; // We need this at the end of every route file