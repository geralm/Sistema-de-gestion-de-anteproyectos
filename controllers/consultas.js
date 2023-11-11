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

const estudiantesXempresa = async (req, res) => {
    const semestre = req.query.period;
    const anho = req.query.year;
    const nombreEmpresa = req.query.nombreEmpresa;

    //realizar consulta
    obtenerInformacionEstudiantesPorEmpresa(nombreEmpresa, anho, semestre)
        .then((data1) => {
            console.log(data1);
            console.log("BIEEEN");
            //const data = ordenarYFormatearDatos(data1);
            //exportarResultadosAExcel(resultado)
            res.render('queries/estudiantexempresa', { data1 })
        })
        .catch((error) => {
            req.flash('error', '¡Error al realizar la consulta!');
            res.redirect('queries/consultas')
        });


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

            const estudiante = await Estudiante.findOne({ _id: anteproyecto.estudiante }, { contrasenia: 0 });
            anteproyecto.info_estudiante = estudiante;

            if (anteproyecto.profesor) {
                const profesor = await Profesores.findOne({ _id: anteproyecto.profesor });
                anteproyecto.info_profesor = { name: profesor.name };
            }
        }

        return anteproyectos;
    } catch (error) {
        console.log("Error en la consulta:", error);
        throw error;
    }
};








async function testFunction() {
    try {
        const resultado = await obtenerInformacionEstudiantesPorEmpresa('', 2023, 'II');
        console.log(resultado);
        // Luego, si necesitas exportar a Excel, podrías llamar a la función de exportación
        //await exportarResultadosAExcel(resultado);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Llamando a la función para probarla
testFunction();




async function exportarResultadosAExcel(resultados) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Información de Estudiantes');

    // Definir las cabeceras de las columnas en el archivo Excel
    worksheet.columns = [
        { header: 'Nombre de Empresa', key: 'nombreEmpresa' },
        { header: 'Dirección Empresa', key: 'direccionEmpresa' },
        { header: 'Número Empresa', key: 'telefonoEmpresa' },
        { header: 'Nombre Supervisor', key: 'nombreSupervisor' },
        { header: 'Puesto Supervisor', key: 'puestoSupervisor' },
        { header: 'Correo Supervisor', key: 'correoSupervisor' },
        { header: 'Estado', key: 'estado' },
        { header: 'Tipo', key: 'tipo' },
        { header: 'Profesor Encargado', key: 'profesor_info' },
        { header: 'Teletrabajo', key: 'teletrabajo' },
        { header: 'Carnet', key: 'carnet' },
        { header: 'Nombre', key: 'nombre' },
        { header: 'Correo', key: 'correo' },
        { header: 'Cursos', key: 'cursos' },
        { header: 'Teléfono', key: 'telefono' },
    ];

    // Agregar fila de datos
    resultados.forEach((resultado) => {
        const cursos = resultado.cursos.join(', ') || 'N/A';

        worksheet.addRow({
            nombreEmpresa: resultado.nombreEmpresa,
            direccionEmpresa: resultado.direccionEmpresa,
            telefonoEmpresa: resultado.telefonoEmpresa,
            nombreSupervisor: resultado.nombreSupervisor,
            puestoSupervisor: resultado.puestoSupervisor,
            correoSupervisor: resultado.correoSupervisor,
            estado: resultado.estado,
            tipo: resultado.tipo,
            profesor_info: resultado.profesor_info,
            teletrabajo: resultado.teletrabajo,
            carnet: resultado.estudiante_info.carnet,
            nombre: resultado.estudiante_info.nombre,
            correo: resultado.estudiante_info.correo,
            cursos: cursos,
            telefono: resultado.estudiante_info.telefono,
        });
    });

    // Guardar el archivo Excel
    const nombreArchivo = 'informacion_estudiantes.xlsx';
    await workbook.xlsx.writeFile(nombreArchivo);

    console.log(`Archivo Excel "${nombreArchivo}" creado con éxito.`);
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



module.exports = {
    renderConsultas, estudiantesXempresa
}