
const Anteproyecto = require('../models/proyecto');
let pdfUploaded = false
const User = require('../models/user');
const semester = require('../models/semestre');



const renderStudentUpload =  async(req,res)=>{
    const semestre = await semester.findOne({ isActual: true }).lean();
    res.render('student/studentUpload', {semestre});
}

const subirProyecto = async (req,res)=>{

    const proyecto = await Anteproyecto.find({ estudiante: req.user._id }).populate('estudiante').lean();
    //Si anteproyecto ya exite, lo sobreescribimos
    if(proyecto){
        //Si es un anteproyecto aprobado, ya no puede sobreescribirse
        if(proyecto[0].estado == "Aprobado"){
            res.redirect('/user')
            return
        }
        const newProyecto  = req.body.proyecto;
        const fileBuffer = req.file.buffer;
        newProyecto.estado = "Revision"
        newProyecto.documento = fileBuffer
        //newProyecto.estudiante.observaciones = 'Sin Observaciones'
        const update = newProyecto;
        await User.findByIdAndUpdate(proyecto[0].estudiante._id , {observaciones:'Sin Observaciones'})
        //let updated = await Anteproyecto.findByIdAndUpdate(proyecto[0]._id , update)
        await Anteproyecto.findByIdAndUpdate(proyecto[0]._id , update)
        // `updated` is the document _before_ `update` was applied
    }
    //Si anteproyecto no existe, subimos uno nuevo
    else{
        const newProyecto  = req.body.proyecto;
        const fileBuffer = req.file.buffer;
        newProyecto.estado = "Revision"
        newProyecto.documento = fileBuffer
        newProyecto.estudiante = req.user._id
        const proyecto = new Proyecto(newProyecto)
        await proyecto.save()
    }
    //const newProyecto  = req.body.proyecto;
    //console.log(newProyecto)
    
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