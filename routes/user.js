const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const { validateUser, isLoggedIn } = require('../middleware/middlewares');
const catchAsync = require('../utils/catchAsync');
const passport = require("passport")

router.route('/signin')
    .get(user.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/signin' }), user.login)
router.route('/register')
    .get(user.renderRegister)
    .post(validateUser, catchAsync(user.createUsuario))
router.get('/logout', user.logout)

router.get('/user',isLoggedIn, user.renderUserHome);

module.exports = router