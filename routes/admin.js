const express = require('express')
const router = express.Router()
const events =require('../controllers/admin')


router.route('/').get(events.renderAdmin)

module.exports = router