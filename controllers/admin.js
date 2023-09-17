const Anteproyecto = require('../models/proyecto')

const renderAdmin =  (req,res)=>{
    res.render('admin/adminWelcome')
}


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
    renderAdmin,renderAnteproyectos,renderOne
}