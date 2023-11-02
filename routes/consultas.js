const express = require('express')
const router = express.Router()
const consulta = require('../controllers/consultas')
const { isLoggedIn, isAdmin, validateTeacher } = require('../middleware/middlewares')
const catchAsync = require('../utils/catchAsync');

router.route('/pag_consultas')
    .get(isLoggedIn, isAdmin,catchAsync(consulta.renderConsultas));

router.route('/estudianteXempresa')
    .get(isLoggedIn, isAdmin,catchAsync(consulta.estudiantesXempresa));
  

module.exports = router