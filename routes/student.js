const express = require('express')
const router = express.Router()
const events = require('../controllers/student')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware/middlewares');


router.route('/')
    .get(isLoggedIn, events.renderStudentWelcome)
router.route('/upload')
    .get(isLoggedIn,events.renderStudentUpload)
    .post(isLoggedIn,catchAsync(events.subirProyecto));
module.exports = router

