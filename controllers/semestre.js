const Semestre = require('../models/semestre');
const User = require('../models/user');

module.exports.createSemester = async (req, res) => {
    const newSemester = req.body.semester;
    const semester = new Semestre(newSemester);
    await semester.save();
    req.flash('success', '¡Semestre creado exitosamente!');
    res.redirect('/user');
}
module.exports.renderCreateSemester = (req, res) => {
    res.render('admin/crearSemestre');
}
