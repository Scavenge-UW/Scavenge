const express = require('express');
const router = express.Router();

const { 
  getAllPantriesAction,
  getPantryDetailAction,
  pantryUpdateInventoryAction,
  updateReservationAction,
  pantryUpdateHoursAction,
//getPantryHoursAction,
  pantryUpdateDetailAction,
  foodSearchAction,
  pantryAddEmployeeAction,
  pantryRemoveEmployeeAction,
  updateEstimatedPickUpAction
} = require("../controllers/pantry.controllers.js");

const authMiddleware = require("../middleware/auth.middleware");

// Get all pantry info
router.get('/pantries', getAllPantriesAction);

// Get pantry details
router.get('/pantries/:pantry_id', authMiddleware.verifyAndGetUserInfo, getPantryDetailAction);

// Update pantry details
router.put('/pantries/:pantry_id/', authMiddleware.verifyAndGetUserInfo, authMiddleware.requireLogin, pantryUpdateDetailAction);

// Get pantry hours - not needed because it is included in the pantryDetailAction
//router.get('/pantries/:pantry_id/hours', getPantryHoursAction);

// Update pantry hours
router.put('/pantries/:pantry_id/hours/:day', authMiddleware.verifyAndGetUserInfo, authMiddleware.requireLogin, pantryUpdateHoursAction);

// Update food inventory
router.put('/pantries/:pantry_id/:food_id', authMiddleware.verifyAndGetUserInfo, authMiddleware.requireLogin, pantryUpdateInventoryAction);

// Add a food to inventory
router.post('/pantries/:pantry_id/:food_id', authMiddleware.verifyAndGetUserInfo, authMiddleware.requireLogin, pantryUpdateInventoryAction);

// Mark a reservation as picked up, approved, or cancelled
router.put('/pantries/:pantry_id/reservations/:action/:reservation_id', authMiddleware.verifyAndGetUserInfo, authMiddleware.requireLogin, updateReservationAction);

// Change estimated pick up
router.put('/pantries/:pantry_id/reservations/:reservation_id', authMiddleware.verifyAndGetUserInfo, authMiddleware.requireLogin, updateEstimatedPickUpAction);

// Search pantries by foods
router.post('/pantries/search/', foodSearchAction);

// Add user to pantry
router.post('/pantries/:pantry_id/user/:username', authMiddleware.verifyAndGetUserInfo, authMiddleware.requireLogin, pantryAddEmployeeAction);

// Remove user from pantry
router.delete('/pantries/:pantry_id/user/:username', authMiddleware.verifyAndGetUserInfo, authMiddleware.requireLogin, pantryRemoveEmployeeAction);

module.exports = router; // We need this at the end of every route file