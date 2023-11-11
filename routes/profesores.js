const express = require('express')
const Router = express.Router()
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAdmin, validateTeacher } = require('../middleware/middlewares')
const {renderMenuTeacher,crearTeacher,renderCrearTeacher,renderEditarTeacher,editarTeacher,eliminarTeacher} = require('../controllers/profesores')
Router.route('/')
    .get(isLoggedIn, isAdmin,renderMenuTeacher)
    .post(isLoggedIn, isAdmin,catchAsync(renderEditarTeacher))
Router.route('/new')
    .get(isLoggedIn, isAdmin,renderCrearTeacher)
    .post(isLoggedIn, isAdmin,validateTeacher,crearTeacher)    
Router.route('/:id')
    .put(isLoggedIn, isAdmin,catchAsync(editarTeacher))
    .delete(isLoggedIn, isAdmin,catchAsync(eliminarTeacher))
module.exports = Router;