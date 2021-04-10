const express = require('express');
const router = express.Router();

const { loginAction, logoutAction, signupAction, updateUserAction, deleteUserAction } = require("../controllers/auth.controllers.js");

const authMiddleware = require("../middleware/auth.middleware");

router.route('/login')
  .post(loginAction);

router.route('/logout')
  .post(authMiddleware.requireLogin, logoutAction);

router.route('/signup')
  .post(signupAction);

router.route('/:username')
  .put(authMiddleware.requireLogin, updateUserAction)
  .delete(authMiddleware.requireLogin, deleteUserAction);

module.exports = router; // We need this at the end of every route file