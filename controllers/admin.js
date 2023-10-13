const { type } = require('os');
const Anteproyecto = require('../models/proyecto')
const User = require('../models/user');
const fs = require('fs');
require('dotenv').config();
const nodemailer = require('nodemailer');

const renderAnteproyectos = async (req, res) => {
    // const anteproyectos = await Anteproyecto.find({}).lean()
    const anteproyectos = await Anteproyecto.find({}).populate('estudiante').lean();
    res.render('admin/showAnteproyectos',{anteproyectos})

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
    res.sendFile('pdfs/someFile.pdf',{root: './'})
    const anteproyectos = await Anteproyecto.find({}).populate('estudiante').lean();
    res.render('admin/showAnteproyectos', { anteproyectos })
}

const revisar = async (req, res) => {
    const anteproyecto = await Anteproyecto.findById(req.params.id).lean();
    const estudiante = await User.findById(anteproyecto.estudiante).lean();
    res.render('admin/revisarAnteproyecto', { anteproyecto,estudiante })
}

//hace varias cosas...
//1) manda el mail
//2) actualiza estado de proyecto en DB (si es necesario)
const actualizarRevision = async (req, res) => {
    console.log("\nInfo recibida:")
    console.log(req.body)
    const emailData = {
        to: 'mauarrieta24@gmail.com',
        subject: 'Test Email',
        text: 'This is a test email sent from my Node.js server.',
      };
    enviarMail(emailData)
    res.redirect('/user');
}

function enviarMail (data,res) {
    
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
    renderAnteproyectos, renderOne, showPdf,revisar,actualizarRevision,enviarMail
}