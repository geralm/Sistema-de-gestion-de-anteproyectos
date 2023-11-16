const User = require('../models/user');
const project = require('../models/proyecto');
const events = require('../models/events');
const semester = require('../models/semestre');
const { mapManyEvents, toDateString } = require('../utils/events');
const mail = require('../service/mail');
const passwordRestoration = require('../utils/passwordRestoration');
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}
module.exports.renderUserHome = async (req, res) => {
    const semestre = await semester.findOne({ isActual: true }).lean();
    const eventos = await events.find({ finishDate: { $gte: new Date() } })
        .sort({ finishDate: 1 }) // Ordenar por finishDate en lugar de fecha
        .limit(3).lean();
    if (req.user.esAdmin === true) {
        //Get count anteproyectos in revision state
        let projectsCount = 0
        if(semestre){
            projectsCount = (await project.find({ estado: 'Revision' }).find({ semestre: semestre._id })).length;
        }
        return res.render('admin/adminHome', { projectsCount, semestre, eventos: mapManyEvents(eventos, toDateString) });
    }
    const anteproyecto = await project.findOne({ estudiante: req.user._id }).lean();
    res.render('student/studentHome', { anteproyecto, eventos: mapManyEvents(eventos, toDateString), user: req.user });
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
module.exports.renderForgotPassword = (req, res) => {
    res.render('users/forgotPassword');
}
module.exports.sendRestorationCode = async (req, res) => {
    const carnet = req.body.user.carnet;
    const user = await User.findOne({ carnet: carnet });
    const email = user.correo;
    // Crear un nuevo documento TempCode en la base de datos
    try {
        await passwordRestoration.sendCodeMail(email);
        console.log('Correo enviado con éxito');
        req.flash('success', 'Se ha enviado un correo con el código de restauración de contraseña');
        res.redirect('/restore-password');
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        req.flash('error', error.message);
        res.redirect('/signin');
    }
}
module.exports.renderRestorePassword = async (req, res) => {
    res.render('users/restorePassword');
}

module.exports.restorePassword = async (req, res) => {
    const carnet = req.body.user.carnet;
    const user = await User.findOne({ carnet: carnet });
    const email = user.correo;
    const isCodeValid = await passwordRestoration.isValidCode(email, req.body.user.code);
    if (isCodeValid) {
        user.contrasenia = await user.encryptPassword(req.body.user.contrasenia);
        await user.save();
        req.flash('success', 'La contraseña se ha restaurado exitosamente');
        return res.redirect('/signin');
    } else {
        req.flash('error', 'El código es inválido o ha expirado');
        return res.redirect('/restore-password');
    }
}

//MI CUENTA
module.exports.renderAccount = async (req, res) => {
    try {
        res.render('users/miCuenta')

    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/');
    }
}




