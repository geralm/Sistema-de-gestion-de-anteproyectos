const Anteproyecto = require('../models/proyecto')

const renderAdmin =  (req,res)=>{
    res.render('admin/adminWelcome')
}


const renderAnteproyectos = async (req,res) => {
    const anteproyectos = await Anteproyecto.find({}).lean()
    res.render('admin/showAnteproyectos',{anteproyectos})
    
}



module.exports = {
    renderAdmin,renderAnteproyectos
}