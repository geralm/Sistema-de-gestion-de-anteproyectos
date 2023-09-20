const Anteproyecto = require('../models/proyecto')

//Se quitó porque ahora usamos un template dinamico para el welcome de admin y usuario
// const renderAdmin =  (req,res)=>{
//     res.render('admin/adminWelcome')
// }
//El template dinamico se renderiza en routes/user.js 


const renderAnteproyectos = async (req,res) => {
    const anteproyectos = await Anteproyecto.find({}).lean()
    res.render('admin/showAnteproyectos',{anteproyectos})
    
}

const renderOne = async (req,res)=>{       
    //const anteproyecto = await Anteproyecto.find({ 'nombreEstudiante': req.body.nombreEstudiante })
    const anteproyectos = await Anteproyecto.find({nombreEstudiante: {$regex: req.body.nombreEstudiante, $options: 'i'}}).lean();
    //console.log(anteproyectos)
    res.render('admin/showAnteproyectos',{anteproyectos})
}


module.exports = {
    renderAnteproyectos,renderOne
}