const express = require('express');
const router = express.Router();

const { getPantryDetailAction } = require("../controllers/pantry.controllers.js");
const { pantryUpdateInventoryAction } = require("../controllers/pantry.controllers.js");
const { pantryUpdateDetailAction } = require("../controllers/pantry.controllers.js");
const { updateReservationAction } = require("../controllers/pantry.controllers.js");
const { pantryUpdateHoursAction } = require("../controllers/pantry.controllers.js");
const { getPantryHoursAction } = require("../controllers/pantry.controllers.js");


// Get pantry details
router.get('/pantries/:pantry_id', getPantryDetailAction);

// Update pantry details
router.put('/pantries/:pantry_id/', pantryUpdateDetailAction);

// Get pantry hours
router.get('/pantries/:pantry_id/hours', getPantryHoursAction);

// Update pantry hours
router.put('/pantries/:pantry_id/hours/:hours_id', pantryUpdateHoursAction);

// Update food inventory
router.put('/pantries/:pantry_id/:food_id', pantryUpdateInventoryAction);

// Add a food to inventory
router.post('/pantries/:pantry_id/:food_id', pantryUpdateInventoryAction);

// Mark a reservation as picked up, approved, or cancelled
router.put('/pantries/:pantry_id/reservations/:action/:reservation_id', updateReservationAction);

module.exports = router; // We need this at the end of every route file