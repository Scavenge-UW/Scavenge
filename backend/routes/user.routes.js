const express = require('express');
const router = express.Router();

const { 
  reserveAction, 
  addToWishlistAction, 
  getWishlistAction, 
  removeFromWishlistAction } = require("../controllers/user.controllers.js");

const authMiddleware = require("../middleware/auth.middleware");

// Make a reservation
router.route('/reserve/:pantry_id')
  .post(authMiddleware.verifyAndGetUserInfo, authMiddleware.requireLogin, reserveAction);

// Add item to wishlist
router.route('/user/:username/wishlist/add')
  .post(authMiddleware.verifyAndGetUserInfo, authMiddleware.requireLogin, addToWishlistAction);

// Get user's wishlist
router.route('/user/:username/wishlist')
  .get(authMiddleware.verifyAndGetUserInfo, authMiddleware.requireLogin, getWishlistAction);

// Remove from user's wishlist
router.route('/user/:username/wishlist/remove/:wishlist_id')
  .delete(authMiddleware.verifyAndGetUserInfo, authMiddleware.requireLogin, removeFromWishlistAction);

module.exports = router; // We need this at the end of every route file