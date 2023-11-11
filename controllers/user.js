const User = require('../models/user');
const project = require('../models/proyecto');
const events = require('../models/events');
const semester = require('../models/semestre');
const { mapManyEvents, toDateString } = require('../utils/events');
const mail = require('../service/mail');
const { getRandomCode } = require('../utils/passwordRestoration');

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
        const projectsCount = (await project.find({ estado: 'Revision' })).length;
        return res.render('admin/adminHome', { projectsCount, semestre, eventos: mapManyEvents(eventos, toDateString)});
    }
    const anteproyecto  = await project.findOne({ estudiante: req.user._id }).lean();
    res.render('student/studentHome', { anteproyecto ,eventos: mapManyEvents(eventos, toDateString) ,user: req.user });
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

module.exports.passwordRestoration = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({ correo: email }).lean();
    if (!user) {
        req.flash('error', 'El correo no está registrado');
        return res.redirect('/signin');
    }
    const code = getRandomCode();
    // Crear un nuevo documento TempCode en la base de datos
    const tempCode = new TempCode({
        email: email,
        code: code,
    });
    await tempCode.save();
    const subject = "Restauración de contraseña";
    const text = `Hola, para restaurar tu contraseña ingresa el siguiente código: ${code}. No compartas este código con nadie.`;
    try {
        await mail.sendMail(email, subject, text);
        console.log('Correo enviado con éxito');
        req.flash('success', 'Se ha enviado un correo con el código de restauración');
        res.redirect('/signin');
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        req.flash('error', 'Ocurrió un error al enviar el correo');
        res.redirect('/signin');
    }
}






