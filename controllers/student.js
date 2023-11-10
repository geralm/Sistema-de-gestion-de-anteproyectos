
const Proyecto = require('../models/proyecto');
let pdfUploaded = false
const User = require('../models/user');
const semester = require('../models/semestre');



const renderStudentUpload =  async(req,res)=>{
    const semestre = await semester.findOne({ isActual: true }).lean();
    res.render('student/studentUpload', {semestre});
}

const subirProyecto = async (req,res)=>{

    /*
    usar esto solo para el rendering de los anteproyectos tipo
    proyecto.estudiante.nombreEstudiante

    nombreEstudiante = req.user.nombre
    mailEstudiante = req.user.correo
    telefonoEstudiante = req.user.telefono
    */
    const newProyecto  = req.body.proyecto;
    const fileBuffer = req.file.buffer;
    newProyecto.estado = "Revision"
    newProyecto.documento = fileBuffer
    newProyecto.estudiante = req.user._id
    const proyecto = new Proyecto(newProyecto)
    await proyecto.save()
    console.log(proyecto)
    res.redirect('/user')
  
}


const subirPdf = async (req,res)=>{
    pdfUploaded = true
    console.log("\nPDF subido con éxito!")
    res.redirect('/user')
    
}

module.exports = {
    renderStudentUpload,subirProyecto,subirPdf
}