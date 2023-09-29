const mongoose = require("mongoose");
const User = require('../models/user');
const { studentNames } = require('./seedHelpers');
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
const getRandBetween = (a, b) => { return Math.floor((Math.random() * (b - a)) + a) }; //choose a random data from the array in parameter

const seedEstudiantes = async () => {
    await User.deleteMany({ esAdmin: false });
    const names = [...studentNames];
    for (let i = 0; i < 10; i++) {
        const nombre = `${sample(names)}`;
        const newUser = new User({
            nombre: nombre,
            carnet: getRandBetween(2020000000, 2020999999),
            telefono: getRandBetween(80000000, 89999999),
            correo: `${nombre}@estudiantec.cr`,
        })
        newUser.contrasenia = await newUser.encryptPassword(`${nombre}12345`);
        await newUser.save()
        console.log(`Estudiante ${nombre} en la base de datos`);
        names.splice(names.indexOf(nombre), 1);
    }
}

seedEstudiantes().then(() => {
    mongoose.connection.close();
});