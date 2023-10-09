const express = require('express')
const router = express.Router()
const admin =require('../controllers/admin')
const { isLoggedIn, isAdmin } = require('../middleware/middlewares')
const catchAsync = require('../utils/catchAsync');

// router.route('/').get(events.renderAdmin)
router.route('/anteproyectos')
    .get(isLoggedIn, isAdmin,catchAsync(admin.renderAnteproyectos));

//Cambiar esto por un método get para mantenerse a los estándares de restful
router.route('/anteproyectos/find')
    .post(isLoggedIn, isAdmin, admin.renderOne);

router.route('/anteproyectos/:id/download')
    .get(isLoggedIn, isAdmin, admin.downloadOne);

module.exports = router