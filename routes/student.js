const express = require('express')
const router = express.Router()
const events =require('../controllers/student')


router.route('/').get(events.renderStudentWelcome)
router.route('/upload').get(events.renderStudentUpload)
module.exports = router