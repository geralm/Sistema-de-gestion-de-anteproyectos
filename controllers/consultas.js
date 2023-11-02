const ExcelJS = require('exceljs');
const { type } = require('os');
const Anteproyecto = require('../models/proyecto')
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
    const semestre = req.query.semestre;
    const nombreEmpresa = req.query.nombreEmpresa;
    
    //realizar consulta
    obtenerInformacionEstudiantesPorEmpresa(nombreEmpresa, semestre)
    .then((data) => {
        console.log(data);
        //exportarResultadosAExcel(resultado)
        res.render('queries/estudiantexempresa',{data})
    })
    .catch((error) => {
        req.flash('error', '¡Error al realizar la consulta!');
        res.redirect('queries/consultas')
    });

    
}

const obtenerInformacionEstudiantesPorEmpresa = async (nombreEmpresa = '', semestre = '') => {
    try {
        // Crea un filtro inicial vacío
        const filtro = {};

        // Si se proporciona una empresa, agrégala al filtro
        if (nombreEmpresa) {
            filtro.nombreEmpresa = nombreEmpresa;
        }

        // Si se proporciona un semestre, agrégalo al filtro
        if (semestre) {
            filtro.semestre = semestre;
        }

        const resultado = await Anteproyecto.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'estudiante',
                    foreignField: '_id',
                    as: 'estudiante_info'
                }
            },
            {
                $lookup: {
                    from: 'teachers',
                    localField: 'profesor',
                    foreignField: '_id',
                    as: 'profesor_info'
                }
            },
            {
                $match: filtro
            },
            {
                $unwind: '$estudiante_info'
            },
            {
                $lookup: {
                    from: 'cursos',
                    localField: 'estudiante_info._id',
                    foreignField: 'estudiante',
                    as: 'cursos_info'
                }
            },
            {
                $project: {
                    _id: 1,
                    titulo: 1,
                    'profesor_info._id': 1,
                    'profesor_info.name': 1,
                    'estudiante_info._id': 1,
                    'estudiante_info.nombre': 1,
                    'estudiante_info.carnet': 1,
                    'estudiante_info.correo': 1,
                    'estudiante_info.telefono': 1,
                    nombreEmpresa: 1,
                    direccionEmpresa: 1,
                    telefonoEmpresa: 1,
                    nombreSupervisor: 1,
                    puestoSupervisor: 1,
                    correoSupervisor: 1,
                    tipo: 1,
                    teletrabajo: 1,
                    semestre: 1,
                    estado: 1,
                    cursos: {
                        $cond: {
                            if: { $eq: ['$cursos_info', []] },
                            then: ['N/A'],
                            else: { $ifNull: ['$cursos_info.nombre', 'N/A'] }
                        }
                    }
                }
            }
        ]);

        return resultado;
    } catch (error) {
        throw error;
    }
};

const obtenerInformacionEstudiantesAgrupados = async (nombreEmpresa = '') => {
    try {
        // Filtro inicial
        const filtro = {};

        // Si se proporciona una empresa, agrégala al filtro
        if (nombreEmpresa) {
            filtro.nombreEmpresa = nombreEmpresa;
        }

        const resultado = await Anteproyecto.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'estudiante',
                    foreignField: '_id',
                    as: 'estudiante_info'
                }
            },
            {
                $lookup: {
                    from: 'teachers',
                    localField: 'profesor',
                    foreignField: '_id',
                    as: 'profesor_info'
                }
            },
            {
                $match: filtro
            },
            {
                $unwind: '$estudiante_info'
            },
            {
                $lookup: {
                    from: 'cursos',
                    localField: 'estudiante_info._id',
                    foreignField: 'estudiante',
                    as: 'cursos_info'
                }
            },
            {
                $project: {
                    _id: 1,
                    titulo: 1,
                    'profesor_info._id': 1,
                    'profesor_info.name': 1,
                    'estudiante_info._id': 1,
                    'estudiante_info.nombre': 1,
                    'estudiante_info.carnet': 1,
                    'estudiante_info.correo': 1,
                    'estudiante_info.telefono': 1,
                    nombreEmpresa: 1,
                    direccionEmpresa: 1,
                    telefonoEmpresa: 1,
                    nombreSupervisor: 1,
                    puestoSupervisor: 1,
                    correoSupervisor: 1,
                    tipo: 1,
                    teletrabajo: 1,
                    semestre: 1,
                    estado: 1,
                    cursos: {
                        $cond: {
                            if: { $eq: ['$cursos_info', []] },
                            then: ['N/A'],
                            else: { $ifNull: ['$cursos_info.nombre', 'N/A'] }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: { semestre: '$semestre', nombreEmpresa: '$nombreEmpresa' },
                    estudiantes: { $push: '$$ROOT' }
                }
            },
            {
                $group: {
                    _id: '$_id.semestre',
                    empresas: { $push: { nombreEmpresa: '$_id.nombreEmpresa', estudiantes: '$estudiantes' } }
                }
            }
        ]);

        // Desenrolla los datos anidados para una estructura más legible
        const datosLegibles = resultado.map((semestre) => {
            const empresas = semestre.empresas.map((empresa) => {
                const estudiantes = empresa.estudiantes.map((estudiante) => ({
                    nombreEmpresa: empresa.nombreEmpresa,
                    ...estudiante
                }));
                return estudiantes;
            });
            return empresas.flat();
        });

        return datosLegibles;
    } catch (error) {
        throw error;
    }
};




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

/*
// Uso de la función para obtener información de estudiantes por nombre de empresa
const nombreEmpresa = '';
obtenerInformacionEstudiantesPorEmpresa2(nombreEmpresa, "1")
    .then((resultado) => {
        console.log(resultado);
        exportarResultadosAExcel(resultado)
    })
    .catch((error) => {
        console.error('Error: ', error);
    });
*/
module.exports = {
    renderConsultas, estudiantesXempresa
}