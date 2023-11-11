const express = require('express')
const Router = express.Router()
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAdmin, validateTeacher } = require('../middleware/middlewares')

Router.route('/')
    .get()
    .post()
Router.route('/:id')
    .get()
    .put()
    .delete()
module.exports = Router;