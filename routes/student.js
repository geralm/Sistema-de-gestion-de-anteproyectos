const express = require('express')
const router = express.Router()
const student = require('../controllers/student')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateProyect } = require('../middleware/middlewares');
const multer = require('multer')
const path = require('path')
const storage = multer.memoryStorage()
const upload = multer({ storage });

router.route('/upload')
    .get(isLoggedIn,catchAsync(student.renderStudentUpload))
    .post(isLoggedIn,upload.single('pdfFile'),validateProyect,catchAsync(student.subirProyecto));


  
module.exports = router




