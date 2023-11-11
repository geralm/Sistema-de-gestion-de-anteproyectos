const Profesores = require('../models/teachers')

module.exports.renderMenuTeacher = async (req, res) => {
    const profesores = await Profesores.find({}).populate().lean();
    res.render('teachers/teacherMenu', { profesores })
}

module.exports.renderCrearTeacher = (req, res) => {
    res.render('teachers/crearTeacher')
}

module.exports.crearTeacher = async (req, res) => {
    const newTeacher = req.body.teacher;
    console.log(newTeacher)
    const teacher = new Profesores(newTeacher)
    await teacher.save()
    req.flash('success', '¡Profesor creado exitosamente!');
    res.redirect('/user')
}

module.exports.renderEditarTeacher = async (req, res) => {
    const idProfesor = req.body.selectProfesor
    const profesor = await Profesores.findById(idProfesor).lean();
    console.log(profesor)
    res.render('teachers/editarTeacher', { profesor })
}

module.exports.editarTeacher = async (req, res) => {
    const updatedTeacher = req.body.teacher;
    const idTeacher = req.body.idTeacher;
    const teacher = await Profesores.findByIdAndUpdate(idTeacher, updatedTeacher);
    console.log(updatedTeacher)
    console.log(idTeacher)
    await teacher.save();
    req.flash('success', '¡Profesor editado exitosamente!');
    res.redirect('/user');
}

module.exports.eliminarTeacher = async (req, res) => {
    const idProfesor = req.body.selectProfesor
    try {
        // Encuentra el profesor por su ID
        const teacher = await Profesores.findById(idProfesor);

        if (!teacher) {
            req.flash('error', 'El profesor no fue encontrado.');
            return res.redirect('/user');
        }

        // Realiza la eliminación
        await Profesores.findByIdAndDelete(idProfesor);
        req.flash('success', '¡Profesor eliminado exitosamente!');
        res.redirect('/user');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Ocurrió un error al eliminar el profesor.');
        res.redirect('/user');
    }
}