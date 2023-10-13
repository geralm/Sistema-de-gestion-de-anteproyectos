const { type } = require('os');
const Anteproyecto = require('../models/proyecto')
const Profesores = require('../models/teachers')
const Estudiante = require('../models/user')
const { Types } = require('mongoose');
const { toDateString } = require('../utils/events')
const fs = require('fs');
//Se quitó porque ahora usamos un template dinamico para el welcome de admin y usuario
// const renderAdmin =  (req,res)=>{
//     res.render('admin/adminWelcome')
// }
//El template dinamico se renderiza en routes/user.js 


const renderAnteproyectos = async (req, res) => {
    // const anteproyectos = await Anteproyecto.find({}).lean()
    const anteproyectos = await Anteproyecto.find({}).populate('estudiante').lean();
    res.render('admin/showAnteproyectos', { anteproyectos })

}

const renderProyectos = async (req, res) => {
    const proyectos = await Anteproyecto.find({ estado: 'Aprobado' })
        .populate('estudiante')
        .populate('profesor')
        .lean();
    res.render('admin/showProyectos', { proyectos });
}

const asignarProfesor = async (req, res) => {
    const idProyecto = req.body.idProyecto
    const idProfesor = req.body.selectProfesor
    const proyecto = await Anteproyecto.findById(idProyecto);
    const objectIdProfesor = new Types.ObjectId(idProfesor)
    proyecto.profesor = objectIdProfesor
    const proyectoNuevo = new Anteproyecto(proyecto)
    await proyectoNuevo.save();
    req.flash('success', '¡Profesor asignado exitosamente!');
    res.redirect('/user')
}

const renderAsignarProfesor = async (req, res) => {
    const proyecto = await Anteproyecto.findById(req.params.id).lean();
    const estudiante = await Estudiante.findById(proyecto.estudiante).lean();
    const profesorAsignado = await Profesores.findById(proyecto.profesor).lean();
    const profesores = await Profesores.find({}).populate().lean();
    res.render('admin/asignarProfesorView', { proyecto, estudiante, profesores,profesorAsignado })
}

const renderOne = async (req, res) => {
    const anteproyectos = await Anteproyecto.find({ nombreEstudiante: { $regex: req.body.nombreEstudiante, $options: 'i' } }).lean();
    //console.log(anteproyectos)
    res.render('admin/showAnteproyectos', { anteproyectos })
}

const downloadOne = async (req, res) => {
    const anteproyecto = await Anteproyecto.findById(req.params.id);
    pdf = fs.writeFileSync('pdfs/someFile.pdf', anteproyecto.documento)
    //res.send(pdf);
    const anteproyectos = await Anteproyecto.find({}).populate('estudiante').lean();
    res.render('admin/showAnteproyectos', { anteproyectos })
}

const showPdf = async (req, res) => {
    const anteproyecto = await Anteproyecto.findById(req.params.id);
    fs.writeFileSync('pdfs/someFile.pdf', anteproyecto.documento)
    const pdfFilename = 'pdfs/someFile.pdf';
    res.sendFile('pdfs/someFile.pdf', { root: './' })
    const anteproyectos = await Anteproyecto.find({}).populate('estudiante').lean();
    res.render('admin/showAnteproyectos', { anteproyectos })
}

const crearTeacher = async (req, res) => {
    const newTeacher = req.body.teacher;
    console.log(newTeacher)
    const teacher = new Profesores(newTeacher)
    await teacher.save()
    req.flash('success', '¡Profesor creado exitosamente!');
    res.redirect('/user')
}

const renderCrearTeacher = (req, res) => {
    res.render('teachers/crearTeacher')
}


module.exports = {
    renderAnteproyectos, renderOne, downloadOne, showPdf, renderProyectos, renderAsignarProfesor, crearTeacher, renderCrearTeacher, asignarProfesor
}