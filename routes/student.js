const express = require('express')
const router = express.Router()
const student = require('../controllers/student')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware/middlewares');


//Se quitó porque ahora usamos un template dinamico para el welcome de admin y usuario
// router.route('/') 
//     .get(isLoggedIn, events.renderStudentWelcome)
//El template dinamico se renderiza en routes/user.js 
router.route('/upload')
    .get(isLoggedIn,student.renderStudentUpload)
    .post(isLoggedIn,catchAsync(student.subirProyecto));
module.exports = router

