const User = require('../models/user');


module.exports.renderLogin = (req, res) => {
    res.render('/');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    var redirectUrl = req.session.returnTo || '/student';
    delete req.session.returnTo;
    if (req.user.esAdmin) redirectUrl = '/admin'
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
}

module.exports.createUsuario = async (req,res)=>{
    const newUsuario  = req.body.user;   
    const usuario = new User(newUsuario)
    usuario.contrasenia = await usuario.encryptPassword(usuario.contrasenia);
    await usuario.save()
    res.redirect('/student')
  }
