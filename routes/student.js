const express = require('express')
const router = express.Router()
const student = require('../controllers/student')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware/middlewares');
const multer = require('multer')
const path = require('path')

//Se quitó porque ahora usamos un template dinamico para el welcome de admin y usuario
// router.route('/') 
//     .get(isLoggedIn, events.renderStudentWelcome)
//El template dinamico se renderiza en routes/user.js 


//File uploads
 /*
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'uploads/'); // Store uploaded files in the 'uploads' directory
    },
    filename: (req, file, callback) => {
      const ext = path.extname(file.originalname);
      callback(null, Date.now() + ext); // Rename the uploaded file with a timestamp
    },
  });
*/
const storage = multer.memoryStorage()
const upload = multer({ storage });

router.route('/upload')
    .get(isLoggedIn,student.renderStudentUpload)
    .post(isLoggedIn,upload.single('pdfFile'),catchAsync(student.subirProyecto));

    /*
router.route('/upload/pdf')
    .post(isLoggedIn,upload.single('pdfFile'),catchAsync(student.subirPdf));
*/

module.exports = router




