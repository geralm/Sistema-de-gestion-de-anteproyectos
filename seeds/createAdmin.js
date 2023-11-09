const mongoose = require("mongoose");

const methodOverride = require('method-override');
const user = require("../models/user");
mongoose.connect('mongodb://127.0.0.1:27017/gestion-de-anteproyectos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedAdmin = async()=>{
    await user.deleteMany({});
    const newAdmin = new user({
        nombre: "admin",
        carnet: 2020426227,
        telefono: 88888888,
        correo: "admin@estudiantec.cr",
        esAdmin: true
    })
    newAdmin.contrasenia = await newAdmin.encryptPassword("admin");
    
    await newAdmin.save()
    
    console.log("Admin created");
}
seedAdmin().then(() => {
    mongoose.connection.close();
})