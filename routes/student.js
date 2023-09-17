const express = require('express')
const router = express.Router()
const events =require('../controllers/student')
const catchAsync = require('../utils/catchAsync');


router.route('/').get(events.renderStudentWelcome)
router.route('/upload').get(events.renderStudentUpload).post(events.subirProyecto);
module.exports = router