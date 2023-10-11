const { type } = require('os');
const Anteproyecto = require('../models/proyecto')
const {toDateString} = require('../utils/events')
const fs = require('fs');
//Se quitó porque ahora usamos un template dinamico para el welcome de admin y usuario
// const renderAdmin =  (req,res)=>{
//     res.render('admin/adminWelcome')
// }
//El template dinamico se renderiza en routes/user.js 


const renderAnteproyectos = async (req, res) => {
    // const anteproyectos = await Anteproyecto.find({}).lean()
    const anteproyectos = await Anteproyecto.find({}).populate('estudiante').lean();
    res.render('admin/showAnteproyectos',{anteproyectos})

}

const renderOne = async (req, res) => {
    const anteproyectos = await Anteproyecto.find({ nombreEstudiante: { $regex: req.body.nombreEstudiante, $options: 'i' } }).lean();
    //console.log(anteproyectos)
    res.render('admin/showAnteproyectos', { anteproyectos })
}



const showPdf = async (req, res) => {
    const anteproyecto = await Anteproyecto.findById(req.params.id);
    fs.writeFileSync('pdfs/someFile.pdf', anteproyecto.documento)
    const pdfFilename = 'pdfs/someFile.pdf';
    res.sendFile('pdfs/someFile.pdf',{root: './'})
    const anteproyectos = await Anteproyecto.find({}).populate('estudiante').lean();
    res.render('admin/showAnteproyectos', { anteproyectos })
}

const revisar = async (req, res) => {
    const anteproyecto = await Anteproyecto.findById(req.params.id);
    res.render('admin/revisarAnteproyecto', { anteproyecto })
}

module.exports = {
    renderAnteproyectos, renderOne, showPdf,revisar
}