const express = require('express')
const router = express.Router()
const{renderAdmin}=require('../controllers/admin')


router.route('/admin').get(renderAdmin)

module.exports = router