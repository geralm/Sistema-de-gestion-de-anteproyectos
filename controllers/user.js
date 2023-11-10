const User = require('../models/user');
const project = require('../models/proyecto');
const events = require('../models/events');
const semester = require('../models/semestre');
const { mapManyEvents, toDateString } = require('../utils/events');
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}
module.exports.renderUserHome = async (req, res) => {
    const semestre = await semester.findOne({ isActual: true }).lean();
    if (req.user.esAdmin === true) {
        //Get count anteproyectos in revision state
        const projectsCount = (await project.find({ estado: 'Revision' })).length;
        const eventos = await events.find({ finishDate: { $gte: new Date() } })
            .sort({ finishDate: 1 }) // Ordenar por finishDate en lugar de fecha
            .limit(3).lean();
        return res.render('admin/adminHome', { projectsCount, semestre, eventos: mapManyEvents(eventos, toDateString)});
    }
    
    res.render('student/studentHome', { user: req.user });
}
module.exports.login = (req, res) => {
    req.flash('success', '¡Bienvenido de nuevo!');
    var redirectUrl = req.session.returnTo || '/user';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    return new Promise((resolve, reject) => {
        req.logout((err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })
        .then(() => {
            req.flash('success', "¡Adiós, Esperamos verte pronto!");
            res.redirect('/');
        })
        .catch((err) => {
            // Maneja el error de req.logout() si es necesario
            console.error(err);
            // Redirige al usuario a una página de error o a donde sea necesario.
            res.redirect('/error');
        });
}

module.exports.createUsuario = async (req, res) => {
    const newUsuario = req.body.user;
    newUsuario.esAdmin = false; //Postman podría enviar un usuario con esAdmin true 
    const usuario = new User(newUsuario)
    //console.log(usuario);
    usuario.contrasenia = await usuario.encryptPassword(usuario.contrasenia);
    await usuario.save()
    req.flash('success', '¡Usuario creado exitosamente! Ahora puedes iniciar sesión');
    res.redirect('/signin')
}







