const Semestre = require('../models/semestre');
const User = require('../models/user');

module.exports.createSemester = async (req, res) => {
    const newSemester = req.body.semestre;
    const semester = new Semestre(newSemester);
    await semester.save();
    req.flash('success', '¡Semestre creado exitosamente!');
    res.redirect('/user');
}
module.exports.deleteSemester = async (req, res) => {
    const {id} = req.params;
    const semester = await Semestre.findByIdAndDelete(id);
    const latestSemestre = await Semestre.findOne({}).sort({ year: -1, period: -1 });
    if (latestSemestre) {
        //This is to update the isActual field because we deleted the actual semester and we need to update the new one to isActual = true
        await Semestre.updateOne({ _id: latestSemestre._id }, { $set: { isActual: true } });
    }
    req.flash('success', '¡Semestre eliminado exitosamente!');
    res.redirect('/semestre');
}

module.exports.renderAdminSemester = async (req, res) => {
    //Create a funcction to get next 5 years in array
    const years = getnextYears(3);    
    const semestres = await Semestre.find({}).lean();
    res.render('admin/crearSemestre', { years , semestres});
}

const getnextYears = (yearsNumber) => { 
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < yearsNumber; i++) {
        years.push(currentYear + i);
    }
    return years;
}
