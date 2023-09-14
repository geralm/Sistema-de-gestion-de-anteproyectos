const express = require('express')
const router = express.Router()
const events =require('../controllers/admin')


router.route('/').get(events.renderAdmin)
router.route('/anteproyectos').get(events.renderAnteproyectos)
router.route('/anteproyectos/find').post(events.renderOne)

module.exports = router