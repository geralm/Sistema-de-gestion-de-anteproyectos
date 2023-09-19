const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const { validateUser } = require('../middleware/middlewares');
const catchAsync = require('../utils/catchAsync');
const passport = require("passport")

router.route('/signin')
    .get(user.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/' }), user.login)
router.route('/register')
    .get(user.renderRegister)
    .post(validateUser, catchAsync(user.createUsuario))
router.get('/logout', user.logout)

module.exports = router