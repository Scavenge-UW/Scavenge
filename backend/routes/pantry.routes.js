const express = require('express');
const router = express.Router();

const { getPantryDetailAction } = require("../controllers/pantry.controllers.js");

// Get pantry details
router.get('/pantries/:pantry_id', getPantryDetailAction);

module.exports = router; // We need this at the end of every route file