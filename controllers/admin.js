const { type } = require('os');
const Anteproyecto = require('../models/proyecto')
const Profesores = require('../models/teachers')
const Estudiante = require('../models/user')
const { Types } = require('mongoose');
const { toDateString } = require('../utils/events')
const User = require('../models/user');
const fs = require('fs');
require('dotenv').config();
const nodemailer = require('nodemailer');
const { Console } = require('console');

const renderAnteproyectos = async (req, res) => {
    // const anteproyectos = await Anteproyecto.find({}).lean()
    const anteproyectos = await Anteproyecto.find({}).populate('estudiante').lean();
    res.render('admin/showAnteproyectos', { anteproyectos })

}

const renderProyectos = async (req, res) => {
    const proyectos = await Anteproyecto.find({ estado: 'Aprobado' })
        .populate('estudiante')
        .populate('profesor')
        .lean();
    res.render('admin/showProyectos', { proyectos });
}

const asignarProfesor = async (req, res) => {
    const idProyecto = req.body.idProyecto
    const idProfesor = req.body.selectProfesor
    const proyecto = await Anteproyecto.findById(idProyecto);
    const objectIdProfesor = new Types.ObjectId(idProfesor)
    proyecto.profesor = objectIdProfesor
    const proyectoNuevo = new Anteproyecto(proyecto)
    await proyectoNuevo.save();
    req.flash('success', '¡Profesor asignado exitosamente!');
    res.redirect('/user')
}

const renderAsignarProfesor = async (req, res) => {
    const proyecto = await Anteproyecto.findById(req.params.id).lean();
    const estudiante = await Estudiante.findById(proyecto.estudiante).lean();
    const profesorAsignado = await Profesores.findById(proyecto.profesor).lean();
    const profesores = await Profesores.find({}).populate().lean();
    res.render('admin/asignarProfesorView', { proyecto, estudiante, profesores, profesorAsignado })
}

const renderOne = async (req, res) => {
    console.log(req.body)
    const anteproyectos = await Anteproyecto.find({ nombreEstudiante: { $regex: req.body.nombreEstudiante, $options: 'i' } }).lean();
    res.render('admin/showAnteproyectos', { anteproyectos })
}

const showPdf = async (req, res) => {
    const anteproyecto = await Anteproyecto.findById(req.params.id);
    fs.writeFileSync('pdfs/someFile.pdf', anteproyecto.documento)
    const pdfFilename = 'pdfs/someFile.pdf';
    res.sendFile('pdfs/someFile.pdf', { root: './' })
    const anteproyectos = await Anteproyecto.find({}).populate('estudiante').lean();
    res.render('admin/showAnteproyectos', { anteproyectos })
}

const revisar = async (req, res) => {
    const anteproyecto = await Anteproyecto.findById(req.params.id).lean();
    const estudiante = await User.findById(anteproyecto.estudiante).lean();
    res.render('admin/revisarAnteproyecto', { anteproyecto, estudiante })
}

const renderMenuTeacher = async (req, res) => {
    const profesores = await Profesores.find({}).populate().lean();
    res.render('teachers/teacherMenu', { profesores })
}

const renderCrearTeacher = (req, res) => {
    res.render('teachers/crearTeacher')
}

const crearTeacher = async (req, res) => {
    const newTeacher = req.body.teacher;
    console.log(newTeacher)
    const teacher = new Profesores(newTeacher)
    await teacher.save()
    req.flash('success', '¡Profesor creado exitosamente!');
    res.redirect('/user')
}

const renderEditarTeacher = async (req, res) => {
    const idProfesor = req.body.selectProfesor
    const profesor = await Profesores.findById(idProfesor).lean();
    console.log(profesor)
    res.render('teachers/editarTeacher', { profesor })
}

const editarTeacher = async (req, res) => {
    const updatedTeacher = req.body.teacher;
    const idTeacher = req.body.idTeacher;
    const teacher = await Profesores.findByIdAndUpdate(idTeacher, updatedTeacher);
    console.log(updatedTeacher)
    console.log(idTeacher)
    await teacher.save();
    req.flash('success', '¡Profesor editado exitosamente!');
    res.redirect('/user');
}

const eliminarTeacher = async (req, res) => {
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

function estadoRevision(body) {
    try {
      
      // Convert the request body object to a JSON string
      const jsonString = JSON.stringify(body);
      const data = JSON.parse(jsonString);
      
      // Iterate through the key-value pairs
      for (const key in data) {
        if (data[key] === 'incompleto') {
          return false;  // Return false if 'incompleto' is found
        }
      }
      
      // If no 'incompleto' is found, return true
      return true;
    } catch (error) {
      return "parsing error";  // Return false if the JSON parsing fails
    }
  }

//Funciones 
//1) manda el mail
//2) actualiza estado de anteproyecto en DB (de ser aprobado)
const actualizarRevision = async (req, res) => {

    //console.log("\nInfo recibida:")
    //console.log(req.body)
    estadoProyecto = estadoRevision(req.body)

    //si fue aprobado
    if (estadoProyecto){
        //modificar estado en db
        //acordarnos que los aprobados no salgan en lista de anteproyectos
        console.log(req.body.id_proyecto)
        try {
            const updatedDocument = await Anteproyecto.findOneAndUpdate(
              { _id: req.body.id_proyecto }, // Filter for the document you want to update
              { estado: "Aprobado" }, // The field and value to update
              { new: true } // Return the updated document
            );
        
            if (updatedDocument) {
              console.log("updated doc... yay")
            } else {
              res.status(404).json({ error: 'Document not found' });
            }
          } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
          }
    }
    

    const emailData = {
        to: req.body.correoEstudiante,
        subject: 'Test Email',
        text: 'This is a test email sent from my Node.js server.',
    };
    enviarMail(emailData)
    res.redirect('/user');
}

function enviarMail(data, res) {

    console.log(data)
    const { to, subject, text } = data;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            //res.status(500).send('Error sending email');
        } else {
            console.log('Email sent:', info.response);
            //res.status(200).send('Email sent successfully');
        }
    });
}

//IMPORTANTE!! para produccion hay que hacerlo con "Use a CA-Signed Certificate"
//para cumplir con normas de seguridad
const transporter = nodemailer.createTransport({

    service: 'Gmail', // Use the email service you want to send emails through
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    secure: false,
    tls: { rejectUnauthorized: false }

});


module.exports = {
    renderAnteproyectos, renderOne, showPdf, renderProyectos, renderAsignarProfesor,
    crearTeacher, renderCrearTeacher, asignarProfesor, actualizarRevision, revisar, enviarMail,
    renderMenuTeacher, eliminarTeacher, renderEditarTeacher, editarTeacher
}