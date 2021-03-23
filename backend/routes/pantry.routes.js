const express = require('express');
const router = express.Router();

const { getPantryDetailAction } = require("../controllers/pantry.controllers.js");
const { pantryUpdateInventoryAction } = require("../controllers/pantry.controllers.js");
const { pantryUpdateDetailAction } = require("../controllers/pantry.controllers.js");
const { completeReservationAction } = require("../controllers/pantry.controllers.js");
const { approveReservationAction } = require("../controllers/pantry.controllers.js");
const { cancelReservationAction } = require("../controllers/pantry.controllers.js");


// Get pantry details
router.get('/pantries/:pantry_id', getPantryDetailAction);

// Update pantry details
router.put('/pantries/:pantry_id/', pantryUpdateDetailAction);

// Update food inventory
router.put('/pantries/:pantry_id/:food_id', pantryUpdateInventoryAction);

// Add a food to inventory
router.post('/pantries/:pantry_id/:food_id', pantryUpdateInventoryAction);

// Mark a reservation as picked up
router.post('/pantries/:pantry_id/reservations/:reservation_id', completeReservationAction);

// Mark a reservation as approved
router.post('/pantries/:pantry_id/reservations/approve/:reservation_id', approveReservationAction);

// Mark a reservation as cancelled
router.post('/pantries/:pantry_id/reservations/cancel/:reservation_id', cancelReservationAction);

module.exports = router; // We need this at the end of every route file