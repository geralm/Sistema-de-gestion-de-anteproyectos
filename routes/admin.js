const express = require('express')
const router = express.Router()
const admin =require('../controllers/admin')
const { isLoggedIn, isAdmin, validateTeacher } = require('../middleware/middlewares')
const catchAsync = require('../utils/catchAsync');

router.route('/anteproyectos')
    .get(isLoggedIn, isAdmin,catchAsync(admin.renderAnteproyectos));
router.route('/proyectos')
    .get(isLoggedIn, isAdmin,catchAsync(admin.renderProyectos));
router.route('/proyectos/:id/asignarProfesor')
    .get(isLoggedIn, isAdmin, catchAsync(admin.renderAsignarProfesor));
router.route('/proyectos/asignarProfesor')
    .post(isLoggedIn, isAdmin, catchAsync(admin.asignarProfesor));
router.route('/proyectos/find')
    .post(isLoggedIn, isAdmin, admin.renderOneProyecto);
router.route('/administrarProfesores')
    .get(isLoggedIn, isAdmin, admin.renderAsignarProfesor);
router.route('/anteproyectos/find')
    .post(isLoggedIn, isAdmin, admin.renderOne);
router.route('/anteproyectos/:id/download')
    .get(isLoggedIn, isAdmin, admin.showPdf);
router.route('/anteproyectos/open-pdf')
    .get(isLoggedIn,isAdmin,admin.showPdf)
router.route('/anteproyectos/:id/revisar')
    .get(isLoggedIn, isAdmin, admin.revisar);
router.route('/anteproyectos/enviarRevisado')
    .post(isLoggedIn, isAdmin, admin.actualizarRevision);
    
// router.route('anteproyectos/send-email')
//     .post(isLoggedIn,isAdmin,admin.sendMail)

   

module.exports = router