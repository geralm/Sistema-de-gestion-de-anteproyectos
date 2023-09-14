const Proyecto = require('../models/proyecto');

const renderStudentWelcome =  (req,res)=>{
    res.render('student/studentWelcome')
}

const renderStudentUpload =  (req,res)=>{
    res.render('student/studentUpload')
}

const subirProyecto = async (req,res)=>{
    const newProyecto  = req.body.proyecto;
    console.log(newProyecto)
    const proyecto = new Proyecto(newProyecto)
    await proyecto.save()
    res.redirect('/student')
  
}

module.exports = {
    renderStudentWelcome,renderStudentUpload,subirProyecto
}