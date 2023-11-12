const ExcelJS = require('exceljs');
const { type } = require('os');
const Anteproyecto = require('../models/proyecto')
const Semestre = require('../models/semestre')
const Profesores = require('../models/teachers')
const Estudiante = require('../models/user')
const { Types } = require('mongoose');
const { toDateString } = require('../utils/events')
const User = require('../models/user');
const fs = require('fs');
require('dotenv').config();

const renderConsultas = async (req, res) => {
    res.render('queries/consultas')
}

const profesoresXempresa = async (req, res) => {
    const semestre = req.query.period;
    const anho = parseInt(req.query.year);
    const nombreEmpresa = req.query.nombreEmpresa;

    try {
        const datos = await obtenerInformacionEstudiantesPorEmpresa(nombreEmpresa, anho, semestre)
        //Busqueda profesores
        // Suponiendo que tu data es el arreglo con la estructura proporcionada

        // Crear un objeto para almacenar las apariciones de profesores y sus empresas
        const profesores = {};


        datos.forEach(item => {
            const nombreProfesor = item.info_profesor?.name;
            const nombreEmpresa = item.nombreEmpresa;

            if (nombreProfesor) {
                if (!profesores[nombreProfesor]) {
                    profesores[nombreProfesor] = { apariciones: 0, empresas: {} };
                }

                if (!profesores[nombreProfesor].empresas[nombreEmpresa]) {
                    profesores[nombreProfesor].empresas[nombreEmpresa] = 1;
                } else {
                    profesores[nombreProfesor].empresas[nombreEmpresa]++;
                }

                profesores[nombreProfesor].apariciones++;
            }
        });

        console.log("Resumen de profesores:");
        Object.entries(profesores).forEach(([nombreProfesor, info]) => {
            console.log(`Profesor: ${nombreProfesor}`);
            console.log(`Apariciones totales: ${info.apariciones}`);
            console.log("Empresas asociadas:");
            Object.entries(info.empresas).forEach(([empresa, apariciones]) => {
                console.log(`- ${empresa}: ${apariciones} apariciones`);
            });
            console.log("------------");
        });
        const datosOriginales = JSON.stringify(profesores, null, 2);

        console.log(datosOriginales);
        const data = [] // Inicializamos un array para guardar la información

        Object.entries(profesores).forEach(([nombreProfesor, info]) => {
            const empresas = [];

            Object.entries(info.empresas).forEach(([empresa, apariciones]) => {
                empresas.push({ empresa, apariciones });
            });

            const profesor = {
                profesor: nombreProfesor,
                apariciones: info.apariciones,
                empresas
            };

            data.push(profesor);
        });

        const jsonData = JSON.stringify(data, null, 2);
        console.log(jsonData)

        res.render('queries/profesoresxempresa', { datos: data, Semestre: semestre, Anho: anho, NombreEmpresa: nombreEmpresa })

    } catch (error) {
        console.log(error);
        req.flash('error', '¡Error al realizar la consulta!');
        res.redirect("/consultas/pag_consultas");
    }

}

const estudiantesXempresa_Excel = async (req, res) => {
    const semestre = req.body.semestre;
    const anho = parseInt(req.body.anho);
    const nombreEmpresa = req.body.nombreEmpresa;

    const data = await obtenerInformacionEstudiantesPorEmpresa(nombreEmpresa, anho, semestre)
    console.log(data)

    const workbook = await exportarResultadosAExcel(data)
    // res is a Stream object
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "EstudiantesXEmpresa.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
    });
}

const estudiantesXempresa = async (req, res) => {
    const semestre = req.query.period;
    const anho = parseInt(req.query.year);
    const nombreEmpresa = req.query.nombreEmpresa;

    try {
        const data = await obtenerInformacionEstudiantesPorEmpresa(nombreEmpresa, anho, semestre)
        res.render('queries/estudiantexempresa', { data: data, Semestre: semestre, Anho: anho, NombreEmpresa: nombreEmpresa })

    } catch (error) {
        console.log(error);
        req.flash('error', '¡Error al realizar la consulta!');
        res.redirect("/consultas/pag_consultas");
    }
}



const obtenerInformacionEstudiantesPorEmpresa = async (nombreEmpresa = '', year = 0, periodo = '') => {
    try {
        const matchSemestre = {};
        const matchStage = {};

        if (year) {
            matchSemestre.year = year;
        }

        if (periodo) {
            matchSemestre.period = periodo;
        }

        if (nombreEmpresa) {
            matchStage.nombreEmpresa = nombreEmpresa;
        }

        const semestresEncontrados = await Semestre.aggregate([
            { $match: matchSemestre }
        ]);

        const idsSemestresEncontrados = semestresEncontrados.map(semestre => semestre._id);

        const pipeline = [
            {
                $match: {
                    semestre: { $in: idsSemestresEncontrados }
                }
            },
            {
                $lookup: {
                    from: 'semestres',
                    localField: 'semestre',
                    foreignField: '_id',
                    as: 'info_semestre'
                }
            },
            {
                $project: {
                    documento: 0
                }
            }
        ];

        if (Object.keys(matchStage).length !== 0) {
            pipeline.unshift({ $match: matchStage });
        }

        const anteproyectos = await Anteproyecto.aggregate(pipeline);

        for (const anteproyecto of anteproyectos) {
            const semestreInfo = semestresEncontrados.find(sem => sem._id.toString() === anteproyecto.semestre.toString());
            anteproyecto.info_semestre = semestreInfo;

            const estudiante = await Estudiante.findOne({ _id: anteproyecto.estudiante }, { contrasenia: 0 }).lean();
            anteproyecto.info_estudiante = estudiante;

            if (anteproyecto.profesor) {
                const profesor = await Profesores.findOne({ _id: anteproyecto.profesor });
                anteproyecto.info_profesor = { name: profesor.name };
            }
            else {
                anteproyecto.info_profesor = { name: "Sin asignar" };
            }
        }

        return anteproyectos;
    } catch (error) {
        console.log("Error en la consulta:", error);
        throw error;
    }
};



async function exportarResultadosAExcel(resultados) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Información de Estudiantes');

    // Definir las cabeceras de las columnas en el archivo Excel
    worksheet.columns = [
        { header: 'Carnet', key: 'carnet' },
        { header: 'Estudiante', key: 'estudiante' },
        { header: 'Correo', key: 'correo' },
        { header: 'Cursos', key: 'cursos' },
        { header: 'Numero', key: 'numero' },
        { header: 'Empresa', key: 'empresa' },
        { header: 'Direccion', key: 'direccion' },
        { header: 'NumeroEmpresa', key: 'numeroEmpresa' },
        { header: 'Supervisor', key: 'supervisor' },
        { header: 'PuestoSupervisor', key: 'puestoSupervisor' },
        { header: 'CorreoSupervisor', key: 'correoSupervisor' },
        { header: 'TipoProyecto', key: 'tipo' },
        { header: 'Profesor', key: 'profesor' },
        { header: 'Teletrabajo', key: 'teletrabajo' },
        { header: 'Estado', key: 'estado' },
    ];

    // Agregar fila de datos
    resultados.forEach((resultado) => {
        const cursos = resultado.cursos.join(', ') || 'N/A';

        worksheet.addRow({
            carnet: resultado.info_estudiante.carnet,
            estudiante: resultado.info_estudiante.nombre,
            correo: resultado.info_estudiante.correo,
            cursos: cursos,
            numero: resultado.info_estudiante.telefono,
            empresa: resultado.nombreEmpresa,
            direccion: resultado.direccionEmpresa,
            numeroEmpresa: resultado.telefonoEmpresa,
            supervisor: resultado.nombreSupervisor,
            puestoSupervisor: resultado.puestoSupervisor,
            correoSupervisor: resultado.correoSupervisor,
            tipo: resultado.tipo,
            profesor: resultado.info_profesor.name,
            teletrabajo: resultado.teletrabajo,
            estado: resultado.estado,
        });
    });
    const largo = resultados.length;
    worksheet.addRow({
        carnet: 'Cantidad Total',
        estudiante: largo,
    })

    // Obtener el buffer del archivo Excel

    return workbook


    /*
    // Guardar el archivo Excel
    const nombreArchivo = 'informacion_estudiantes.xlsx';
    await workbook.xlsx.writeFile(nombreArchivo);
    console.log(`Archivo Excel "${nombreArchivo}" creado con éxito.`);
    */
}



function ordenarYFormatearDatos(datos) {
    // Primero, ordena los datos por semestre y luego por empresa
    datos.sort((a, b) => {
        if (a.semestre < b.semestre) return -1;
        if (a.semestre > b.semestre) return 1;
        if (a.nombreEmpresa < b.nombreEmpresa) return -1;
        if (a.nombreEmpresa > b.nombreEmpresa) return 1;
        return 0;
    });

    // Luego, crea un nuevo array con el formato de llaves deseado
    const datosFormateados = datos.map((dato) => ({
        _id: dato._id,
        titulo: dato.titulo,
        nombreEmpresa: dato.nombreEmpresa,
        direccionEmpresa: dato.direccionEmpresa,
        nombreSupervisor: dato.nombreSupervisor,
        puestoSupervisor: dato.puestoSupervisor,
        correoSupervisor: dato.correoSupervisor,
        telefonoEmpresa: dato.telefonoEmpresa,
        estado: dato.estado,
        semestre: dato.semestre,
        tipo: dato.tipo,
        teletrabajo: dato.teletrabajo,
        estudiante_info: {
            _id: dato.estudiante_info._id,
            nombre: dato.estudiante_info.nombre,
            carnet: dato.estudiante_info.carnet,
            telefono: dato.estudiante_info.telefono,
            correo: dato.estudiante_info.correo,
        },
        profesor_info: dato.profesor_info,
        cursos: dato.cursos,
    }));

    return datosFormateados;
}

// Para usar la función:
async function testFunction() {
    try {
        const resultado = await obtenerInformacionEstudiantesPorEmpresa('', '', '');
        console.log(resultado);
        exportarResultadosAExcel(resultado)
        return resultado
        // Luego, si necesitas exportar a Excel, podrías llamar a la función de exportación
        //await exportarResultadosAExcel(resultado);
    } catch (error) {
        console.error("Error:", error);
    }
}
// Llamando a la función para probarla
//testFunction();


module.exports = {
    renderConsultas, estudiantesXempresa, estudiantesXempresa_Excel, profesoresXempresa
}