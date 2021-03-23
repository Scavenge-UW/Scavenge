const express = require('express');
const router = express.Router();

const { loginAction, logoutAction, signupAction, updateUserAction, deleteUserAction } = require("../controllers/auth.controllers.js");

router.route('/login')
  .post(loginAction);

router.route('/logout')
  .post(logoutAction);

router.route('/signup')
  .post(signupAction);

router.route('/:username')
  .put(updateUserAction)
  .delete(deleteUserAction);

module.exports = router; // We need this at the end of every route file