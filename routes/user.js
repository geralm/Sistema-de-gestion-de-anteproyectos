const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const { validateUser, isLoggedIn, registeredCarnet} = require('../middleware/middlewares');
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
router.get('/forgot-password', user.renderForgotPassword);
router.post('/forgot-password',registeredCarnet, user.sendRestorationCode);
router.get('/restore-password', user.renderRestorePassword);
router.post('/restore-password',registeredCarnet, user.restorePassword);

//MI CUENTA
router.get('/account', isLoggedIn, user.renderAccount);


module.exports = router