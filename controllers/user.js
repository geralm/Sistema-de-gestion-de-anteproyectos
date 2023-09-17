const Usuario = require('../models/newUser');

const createUsuario = async (req,res)=>{
    const newUsuario  = req.body.user;   
    const usuario = new Usuario(newUsuario)
    usuario.contrasenia = await usuario.encryptPassword(usuario.contrasenia);
    await usuario.save()
    res.redirect('/student')
  }

module.exports = { createUsuario
    
}
