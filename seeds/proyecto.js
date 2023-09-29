const mongoose = require("mongoose");
const Proyect = require('../models/proyecto');
const Semestre = require('../models/semestre');
const User = require('../models/user');
const { nombreProyecto,
    nombreEmpresa,
    direccion,
    studentNames, getRandomDate } = require('./seedHelpers');
mongoose.connect('mongodb://127.0.0.1:27017/gestion-de-anteproyectos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
const sample = array => array[Math.floor(Math.random() * array.length)]; //choose a random data from the array in parameter
const seedProyecto = async () => {
    const semestre = await Semestre.findOne({});
    await Proyect.deleteMany({});
    const estudiantes = await User.aggregate([
        { $match: { esAdmin: false } }, // Corrección: Filtrar usuarios que no son administradores
        { $sample: { size: 1 } }
    ]);

    console.log(semestre._id);
    for (let i = 0; i < 5; i++) {
        const idEstudiante = sample(estudiantes)._id;
        const empresa = `${sample(nombreEmpresa)}`;
        const newProyect = new Proyect({
            estudiante: idEstudiante,
            semestre: semestre._id,
            titulo: `${sample(nombreProyecto)}`,
            nombreEmpresa: empresa,
            direccionEmpresa: `${sample(direccion)}`,
            telefonoEmpresa: 88888888,
            nombreSupervisor: `${sample(studentNames)}`,
            fechaInicio: getRandomDate(),
            fechaFinal: getRandomDate(),
        })
        await newProyect.save()
        console.log(`Proyecto ${newProyect.titulo} creado`);

    }
}

seedProyecto().then(() => {
    mongoose.connection.close();
});