const Proyecto = require('../models/proyecto');

const renderStudentWelcome =  (req,res)=>{
    res.render('student/studentWelcome')
}

const renderStudentUpload =  (req,res)=>{
    res.render('student/studentUpload')
}

const subirProyecto = async (req,res)=>{
    const newProyecto  = req.body.proyecto;
    newProyecto.estado = "Por revisar"
    const proyecto = new Proyecto(newProyecto)
    await proyecto.save()
    res.redirect('/student')
  
}

module.exports = {
    renderStudentWelcome,renderStudentUpload,subirProyecto
}