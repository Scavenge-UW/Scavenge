const express = require('express');
const router = express.Router();

const { reserveAction } = require("../controllers/user.controllers.js");

// Make a reservation
router.route('/reserve/:pantry_id')
  .post(reserveAction);

module.exports = router; // We need this at the end of every route file