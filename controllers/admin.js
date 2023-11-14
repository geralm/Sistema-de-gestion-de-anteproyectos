const Anteproyecto = require('../models/proyecto')
const Profesores = require('../models/teachers')
const Estudiante = require('../models/user')
const { Types } = require('mongoose');
const User = require('../models/user');
const fs = require('fs');
const mail = require('../service/mail')


const renderAnteproyectos = async (req, res) => {
  const anteproyectos = await Anteproyecto.find({}).populate('estudiante').lean();
  res.render('admin/showAnteproyectos', { anteproyectos })
}

const renderRechazados = async (req, res) => {
  const anteproyectos = await Anteproyecto.find({}).populate('estudiante').lean();
  res.render('admin/showRechazados', { anteproyectos })
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

const renderCalificarProyecto = async (req, res) => {
  const proyecto = await Anteproyecto.findById(req.params.id).lean();
  const estudiante = await Estudiante.findById(proyecto.estudiante).lean();
  const profesorAsignado = await Profesores.findById(proyecto.profesor).lean();
  res.render('admin/calificarProyectoView', { proyecto, estudiante, profesorAsignado })
}

const calificarProyecto = async (req, res) => {
  const proyectoActualizado = req.body.proyecto
  const idProyecto = req.body.idProyecto
  const valores = Object.values(proyectoActualizado).map(valor => parseFloat(valor));
  const suma = valores.reduce((acumulador, valor) => acumulador + valor, 0);
  const promedio = (suma / valores.length).toFixed(2);
  const multiploDe5Inferior = Math.floor(promedio / 5) * 5;
  const multiploDe5Superior = Math.ceil(promedio / 5) * 5;
  var acta = 0;
  if (promedio - multiploDe5Inferior < multiploDe5Superior - promedio) {
    acta = multiploDe5Inferior;
  } else {
    acta = multiploDe5Superior;
  }
  proyectoActualizado.actas = acta
  proyectoActualizado.final = promedio
  const proyecto = await Anteproyecto.findByIdAndUpdate(idProyecto, proyectoActualizado);
  await proyecto.save();
  req.flash('success', '¡Notas actualizadas correctamente!');
  res.redirect('/admin/proyectos')
}

const renderOne = async (req, res) => {
  const id_estudiantes = await User.find({ nombre: { $regex: req.body.nombreEstudiante, $options: 'i' } }).lean()
  console.log(id_estudiantes)
  if (id_estudiantes.length !== 0) {
    const anteproyectos = await Anteproyecto.find({ estudiante: id_estudiantes[0]._id }).populate('estudiante').lean();
    res.render('admin/showAnteproyectos', { anteproyectos })
    // Resto del código con la consulta ya validada
  } else {
    // Manejar la situación en la que id_estudiantes[0]._id es undefined
    const anteproyectos = [];
    res.render('admin/showAnteproyectos', { anteproyectos })
  }


}

const renderOneProyecto = async (req, res) => {
  const id_estudiantes = await User.find({ nombre: { $regex: req.body.nombreEstudiante, $options: 'i' } }).lean()
  if (id_estudiantes.length !== 0) {
    const proyectos = await Anteproyecto
      .find({ estado: 'Aprobado' })
      .find({ estudiante: id_estudiantes[0]._id })
      .populate('estudiante')
      .lean();
    res.render('admin/showProyectos', { proyectos });
  }
  else {
    const proyectos = []
    res.render('admin/showProyectos', { proyectos });
  }

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
  if (estadoProyecto) {
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
  } else {
    //modificar estado en db
    //acordarnos que los aprobados no salgan en lista de anteproyectos
    console.log(req.body.id_proyecto)
    try {
      const updatedDocument = await Anteproyecto.findOneAndUpdate(
        { _id: req.body.id_proyecto }, // Filter for the document you want to update
        { estado: "Rechazado" }, // The field and value to update
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
  mail.sendMail(req.body.correoEstudiante, "test", "test")
  res.redirect('/user');
}




module.exports = {
  renderAnteproyectos, renderOne, showPdf, renderProyectos, renderAsignarProfesor,
  asignarProfesor, actualizarRevision, revisar, renderOneProyecto, renderCalificarProyecto, calificarProyecto,
  renderRechazados
}