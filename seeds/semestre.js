const mongoose = require("mongoose");
const semestre = require('../models/semestre');
mongoose.connect('mongodb://127.0.0.1:27017/gestion-de-anteproyectos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedSemestre = async()=>{
    await semestre.deleteMany({});
    const newSemestre = new semestre({
        year: 2024,
        period: "I",
        startDate: new Date(),
        finishDate: new Date(),
        isAvailable: true
    })
    await newSemestre.save()
    console.log("Semestre creado");
}
seedSemestre().then(() => {
    mongoose.connection.close();
})
