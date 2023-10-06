const Proyecto = require('../models/proyecto');
let pdfUploaded = false




const renderStudentUpload =  (req,res)=>{
    res.render('student/studentUpload')
}

const subirProyecto = async (req,res)=>{
    const newProyecto  = req.body.proyecto;
    console.log(newProyecto)
    /*
    const fileBuffer = req.file.buffer;
    //console.log(fileBuffer)
    newProyecto.estado = "Por revisar"
    newProyecto.documento = fileBuffer
    const proyecto = new Proyecto(newProyecto)
    await proyecto.save()*/
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