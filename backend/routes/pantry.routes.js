const express = require('express');
const router = express.Router();

const { getPantryDetailAction } = require("../controllers/pantry.controllers.js");
const { pantryUpdateInventoryAction } = require("../controllers/pantry.controllers.js");
const { pantryUpdateDetailAction } = require("../controllers/pantry.controllers.js");


// Get pantry details
router.get('/pantries/:pantry_id', getPantryDetailAction);

// Update pantry details
router.put('/pantries/:pantry_id/', pantryUpdateDetailAction);

// Update food inventory
router.put('/pantries/:pantry_id/:food_id', pantryUpdateInventoryAction);

// Add a food to inventory
router.post('/pantries/:pantry_id/:food_id', pantryUpdateInventoryAction);



module.exports = router; // We need this at the end of every route file