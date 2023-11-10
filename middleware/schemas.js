const Joi = require('joi');
/*This modules are for validating data in middlewares to put
then into a schemas, but befere we need to "simulate" them*/
//Docs: https://joi.dev/api/?v=17.9.1#date
module.exports.eventSchema = Joi.object({
    event: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        startDate: Joi.date().required(), 
        finishDate: Joi.date().min('now').greater(Joi.ref('startDate')).required()
        //have not sense to add a new event already expired
    }).required()
}); //Create a schema for validate users

module.exports.userSchema = Joi.object({
    user: Joi.object({
        nombre: Joi.string().required(),
        carnet: Joi.number().required(),
        telefono: Joi.number().max(99999998).min(20000000).required(), 
        correo: Joi.string().required(), 
        contrasenia: Joi.string().min(6).required()
    }).required()
}); 

module.exports.teacherSchema = Joi.object({
    teacher: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required()
        }).required()
});
module.exports.semesterSchema = Joi.object({
    semestre: Joi.object({
        year: Joi.number().required(),
        period: Joi.string().required()
    }).required()
});
module.exports.proyectSchema = Joi.object({
    proyecto: Joi.object({

        titulo: Joi.string(),
        estudiante:Joi.object(),
        cursos:Joi.any(),
        telefonoEmpresa: Joi.number(),
        estado:Joi.string() ,
        fechaInicio:Joi.date(),
        fechaFinal:Joi.date(),
        isConfidencial:Joi.bool(),
        semestre:Joi.string(),
        documento:Joi.object(),
        tipo:Joi.string(),
        teletrabajo:Joi.bool(),
        profesor:Joi.object(),
        nombreEmpresa:Joi.string().required(),
        direccionEmpresa:Joi.string().max(200).required(),
        telefonoEmpresa:Joi.number().max(89999999).min(20000000).required(),
        nombreSupervisor:Joi.string().max(70).required(),
        puestoSupervisor:Joi.string().max(150).required(),
        correoSupervisor:Joi.string().max(70).required()
    }).required()
})
