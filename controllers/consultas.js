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
    const semestreActivo = await Semestre.findOne({ isActual: true }).lean();
    res.render('queries/consultas', { semestreActivo })
}

const formatoProfes = async (datos) => {
    //ORDENAR FORMATO PARA PROFES
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

    return data
}

const formatoEstudiantes = async (datos) => {
    const empresas = {};

    datos.forEach(item => {
        const nombreEmpresa = item.nombreEmpresa;

        if (!empresas[nombreEmpresa]) {
            empresas[nombreEmpresa] = 1;
        } else {
            empresas[nombreEmpresa]++;
        }
    });

    const resultado = [];

    Object.entries(empresas).forEach(([empresa, cantidadEstudiantes]) => {
        resultado.push({ empresa: empresa, cantEstudiantes: cantidadEstudiantes });
    });

    return resultado;
};

async function sumarApariciones(datos) {
    let sumaApariciones = 0;

    datos.forEach((item) => {
        sumaApariciones += item.apariciones;
    });

    return sumaApariciones;
};

const profesoresXempresa = async (req, res) => {
    const semestre = req.query.period;
    const anho = parseInt(req.query.year);
    const nombreEmpresa = req.query.nombreEmpresa;

    try {
        //CONSULTA GENERAL
        const datos = await obtenerInformacionEstudiantesPorEmpresa(nombreEmpresa, anho, semestre)
        //FORMATO PROFES
        const data = await formatoProfes(datos)
        const aparicionesTotales = await sumarApariciones(data);
        console.log("aparicionesTotales " + aparicionesTotales)
        res.render('queries/profesoresxempresa', { datos: data, AparicionesTotales: aparicionesTotales, Semestre: semestre, Anho: anho, NombreEmpresa: nombreEmpresa })

    } catch (error) {
        console.log(error);
        req.flash('error', '¡Error al realizar la consulta!');
        res.redirect("/consultas/pag_consultas");
    }
}

const estudiantesXnota = async (req, res) => {
    const semestre = req.query.period;
    const anho = parseInt(req.query.year);
    const nombreEmpresa = req.query.nombreEmpresa;
    const filtroNotas = req.query.filtroNotas;

    try {
        //CONSULTA GENERAL
        const datos = await obtenerInformacionEstudiantesPorEmpresa(nombreEmpresa, anho, semestre);
        const data = await filtrarNotas(datos, filtroNotas);

        //SELECIONAR SEGUN FILTRO
        res.render('queries/estudiantesxnota', { data: data, Semestre: semestre, Anho: anho, NombreEmpresa: nombreEmpresa, filtroNotas:filtroNotas })

    } catch (error) {
        console.log(error);
        req.flash('error', '¡Error al realizar la consulta!');
        res.redirect("/consultas/pag_consultas");
    }
}

async function filtrarNotas(datos, filtro) {
    return datos.filter(elemento => {
        if (filtro === "Aprobados") {
            return elemento.actas ? elemento.actas >= 70 : false;
        } else if (filtro === "Reprobados") {
            return typeof elemento.actas !== 'undefined' ? elemento.actas < 70 : false;
        } else {
            return true; // Si el filtro es vacío, se devuelve el elemento sin filtrar
        }
    });
}

async function exportarResultadosAExcel_notas(resultados) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Notas');

    // Definir las cabeceras de las columnas en el archivo Excel
    worksheet.columns = [
        { header: 'Semestre', key: 'semestre' },
        { header: 'Carnet', key: 'carnet' },
        { header: 'Estudiante', key: 'estudiante' },
        { header: 'Correo', key: 'correo' },
        { header: 'Numero', key: 'numero' },
        { header: 'Empresa', key: 'empresa' },

        { header: 'empresa1', key: 'empresa1' },
        { header: 'informe1', key: 'informe1' },
        { header: 'empresa2', key: 'empresa2' },
        { header: 'informe2', key: 'informe2' },
        { header: 'empresa3', key: 'empresa3' },
        { header: 'informe3', key: 'informe3' },
        { header: 'presentacion', key: 'presentacion' },
        { header: 'coordinacion', key: 'coordinacion' },
        { header: 'final', key: 'final' },
        { header: 'actas', key: 'actas' },
    ];

    // Agregar fila de datos
    resultados.forEach((resultado) => {
        const semestreName = resultado.info_semestre.period + "-" + resultado.info_semestre.year

        worksheet.addRow({
            semestre: semestreName,
            carnet: resultado.info_estudiante.carnet,
            estudiante: resultado.info_estudiante.nombre,
            correo: resultado.info_estudiante.correo,
            numero: resultado.info_estudiante.telefono,
            empresa: resultado.nombreEmpresa,

            empresa1: resultado.empresa1,
            informe1: resultado.informe1,
            empresa2: resultado.empresa2,
            informe2: resultado.informe2,
            empresa3: resultado.empresa3,
            informe3: resultado.informe3,
            presentacion: resultado.presentacion,
            coordinacion: resultado.coordinacion,
            final: resultado.final,
            actas: resultado.actas,

        });
    });
    const largo = resultados.length;
    worksheet.addRow({
        semestre: 'Cantidad Total',
        carnet: largo,
    })

    return workbook
}

const notas_Excel = async (req, res) => {
    const semestre = req.body.semestre;
    const anho = parseInt(req.body.anho);
    const nombreEmpresa = req.body.nombreEmpresa;
    const filtroNotas = req.query.filtroNotas;

    const datos = await obtenerInformacionEstudiantesPorEmpresa(nombreEmpresa, anho, semestre)
    const data = await filtrarNotas(datos, filtroNotas);


    const workbook = await exportarResultadosAExcel_notas(data)
    // res is a Stream object
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "Notas.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
    });
}

//CONSULTA GENERAL-----------------------------------------------------
const consultaGeneral = async (req, res) => {
    const semestre = req.query.period;
    const anho = parseInt(req.query.year);
    const nombreEmpresa = req.query.nombreEmpresa;

    try {
        const dataPrevia = await obtenerInformacionEstudiantesPorEmpresa(nombreEmpresa, anho, semestre)
        const data = await ordenarPorEmpresaYSemestre(dataPrevia)
        console.log(data)
        res.render('queries/consulta_general', { data: data, Semestre: semestre, Anho: anho, NombreEmpresa: nombreEmpresa })

    } catch (error) {
        console.log(error);
        req.flash('error', '¡Error al realizar la consulta!');
        res.redirect("/consultas/pag_consultas");
    }
}

async function exportarResultadosAExcel_general(resultados) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Información General');

    // Definir las cabeceras de las columnas en el archivo Excel
    worksheet.columns = [
        { header: 'Semestre', key: 'semestre' },

        { header: 'Estudiante', key: 'estudiante' },
        { header: 'Carnet', key: 'carnet' },
        { header: 'Correo', key: 'correo' },
        { header: 'Telefono', key: 'telefono' },

        { header: 'Cursos', key: 'cursos' },

        { header: 'Titulo', key: 'titulo' },
        { header: 'Fecha Inicio', key: 'fechaInicio' },
        { header: 'Fecha Fin', key: 'fechaFinal' },
        { header: 'Tipo', key: 'tipo' },
        { header: 'Teletrabajo', key: 'teletrabajo' },

        { header: 'Empresa', key: 'nombreEmpresa' },
        { header: 'Dirección', key: 'direccionEmpresa' },
        { header: 'Telefono Empresa', key: 'telefonoEmpresa' },

        { header: 'Supervisor', key: 'nombreSupervisor' },
        { header: 'Puesto', key: 'puestoSupervisor' },
        { header: 'Correo Supervisor', key: 'correoSupervisor' },

        { header: 'Profesor', key: 'profesor' }
    ];

    // Agregar fila de datos
    resultados.forEach((resultado) => {
        const cursos = resultado.cursos.join(', ') || 'N/A';
        const semestreName = resultado.info_semestre.period + "-" + resultado.info_semestre.year

        worksheet.addRow({
            semestre: semestreName,

            estudiante: resultado.info_estudiante.nombre,
            carnet: resultado.info_estudiante.carnet,
            correo: resultado.info_estudiante.correo,
            telefono: resultado.info_estudiante.telefono,

            cursos: cursos,

            titulo: resultado.titulo,
            fechaInicio: resultado.fechaInicio,
            fechaFinal: resultado.fechaFinal,
            tipo: resultado.tipo,
            teletrabajo: resultado.teletrabajo,

            nombreEmpresa: resultado.nombreEmpresa,
            direccionEmpresa: resultado.direccionEmpresa,
            telefonoEmpresa: resultado.telefonoEmpresa,

            nombreSupervisor: resultado.nombreSupervisor,
            puestoSupervisor: resultado.puestoSupervisor,
            correoSupervisor: resultado.correoSupervisor,

            profesor: resultado.info_profesor.name,
        });
    });
    const largo = resultados.length;
    worksheet.addRow({
        semestre: 'Cantidad Total',
        estudiante: largo,
    })

    return workbook
}

const consultaGeneral_Excel = async (req, res) => {
    const semestre = req.body.semestre;
    const anho = parseInt(req.body.anho);
    const nombreEmpresa = req.body.nombreEmpresa;

    const data = await obtenerInformacionEstudiantesPorEmpresa(nombreEmpresa, anho, semestre)
    //ORDENAR AQUI
    console.log(data)


    const workbook = await exportarResultadosAExcel_general(data)
    // res is a Stream object
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "ConsultaGeneral.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
    });
}


async function exportarResultadosAExcel_profesor(resultados, cantTotal, semestreConsultado) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Información de Profesores');

    // Definir las cabeceras de las columnas en el archivo Excel
    worksheet.columns = [
        { header: 'Profesor Asesor', key: 'profesor' },
        { header: 'Empresa', key: 'empresa' },
        { header: 'Cuenta de Estudiantes', key: 'cantEstudiantes' },
    ];
    // Agregar la información
    resultados.forEach((resultado) => {
        const empresas = resultado.empresas;
        worksheet.addRow({
            profesor: resultado.profesor,
            cantEstudiantes: " ",
        }).eachCell({ includeEmpty: true }, (cell, colNumber) => {
            if (colNumber <= 3) { // Aplica solo a las primeras tres columnas
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '4BB3F3' } // Color azulado
                };
            }
        });

        if (empresas.length > 0) {
            empresas.forEach((empresa) => {
                worksheet.addRow({
                    empresa: empresa.empresa,
                    cantEstudiantes: empresa.apariciones,
                });
            });
        } else {
            worksheet.addRow({
                empresa: 'Sin empresas',
                cantEstudiantes: 0,
            });
        }
        worksheet.addRow({
            profesor: "Total de " + resultado.profesor,
            cantEstudiantes: resultado.apariciones
        }).eachCell({ includeEmpty: true }, (cell, colNumber) => {
            if (colNumber <= 3) { // Aplica solo a las primeras tres columnas
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'AAD9F5' } // Color azulado
                };
            }
        });

    });
    worksheet.addRow({
        profesor: "Suma Total ",
        cantEstudiantes: cantTotal
    });
    worksheet.addRow({
        profesor: "Semestre consultado ",
        cantEstudiantes: semestreConsultado
    });
    return workbook
}

const profesoresXempresa_Excel = async (req, res) => {
    const semestre = req.body.semestre;
    const anho = parseInt(req.body.anho);
    const nombreEmpresa = req.body.nombreEmpresa;
    const cantTotal = req.body.cantTotal;
    let semestreConsultado = semestre + "-" + anho
    if (isNaN(anho)) {
        semestreConsultado = semestre + "-"
    }

    try {
        //CONSULTA GENERAL
        const datos = await obtenerInformacionEstudiantesPorEmpresa(nombreEmpresa, anho, semestre)
        //FORMATO PROFES
        const data = await formatoProfes(datos)
        console.log(data)

        const workbook = await exportarResultadosAExcel_profesor(data, cantTotal, semestreConsultado)
        // res is a Stream object
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "ProfesoresXEmpresa.xlsx"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });

    } catch (error) {
        console.log(error);
        req.flash('error', '¡Error al descargar el Excel!');
        res.redirect("/consultas/pag_consultas");
    }
}

const estudiantesXempresa_Excel = async (req, res) => {
    const semestre = req.body.semestre;
    const anho = parseInt(req.body.anho);
    const nombreEmpresa = req.body.nombreEmpresa;

    let semestreConsultado = semestre + "-" + anho
    if (isNaN(anho)) {
        semestreConsultado = semestre + "-"
    }

    const data = await obtenerInformacionEstudiantesPorEmpresa(nombreEmpresa, anho, semestre)
    console.log(data)

    const informacionExtra = await formatoEstudiantes(data)
    console.log(informacionExtra)

    const workbook = await exportarResultadosAExcel_estudiantes(data, informacionExtra, semestreConsultado)
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
        //const data = await ordenarPorEmpresaYSemestre(dataPrevia)
        console.log(data)
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
            matchStage.nombreEmpresa = { $regex: new RegExp(nombreEmpresa, 'i') };
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
        const data = await ordenarPorEmpresaYSemestre(anteproyectos)
        return data;
    } catch (error) {
        console.log("Error en la consulta:", error);
        throw error;
    }
};



async function exportarResultadosAExcel_estudiantes(resultados, informacionExtra, semestreConsultado) {
    const workbook = new ExcelJS.Workbook();

    const worksheetPrincipal = workbook.addWorksheet('Estudiantes x Empresa');
    worksheetPrincipal.columns = [
        { header: 'Empresa', key: 'empresa' },
        { header: 'Cantidad Estudiantes', key: 'cantidad' },
    ]
    informacionExtra.forEach((info) => {
        worksheetPrincipal.addRow({
            empresa: info.empresa,
            cantidad: info.cantEstudiantes,
        })
    })
    worksheetPrincipal.addRow({
        empresa: "Semestre consultado ",
        cantidad: semestreConsultado
    });

    const worksheet = workbook.addWorksheet('Información General');

    // Definir las cabeceras de las columnas en el archivo Excel
    worksheet.columns = [
        { header: 'Semestre', key: 'semestre' },
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
        const semestreName = resultado.info_semestre.period + "-" + resultado.info_semestre.year

        worksheet.addRow({
            semestre: semestreName,
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
        semestre: 'Cantidad Total',
        carnet: largo,
    })



    return workbook
    /*
    // Guardar el archivo Excel
    const nombreArchivo = 'informacion_estudiantes.xlsx';
    await workbook.xlsx.writeFile(nombreArchivo);
    console.log(`Archivo Excel "${nombreArchivo}" creado con éxito.`);
    */
}
async function ordenarPorEmpresaYSemestre(datos) {
    // Agrupar los datos por semestre
    const datosPorSemestre = datos.reduce((acumulador, dato) => {
        const semestreID = dato.semestre.toString(); // Convertir a string para comparar
        if (!acumulador[semestreID]) {
            acumulador[semestreID] = [];
        }
        acumulador[semestreID].push(dato);
        return acumulador;
    }, {});

    // Ordenar y agrupar por empresa dentro de cada semestre
    for (const semestreID in datosPorSemestre) {
        if (Object.prototype.hasOwnProperty.call(datosPorSemestre, semestreID)) {
            const datosSemestre = datosPorSemestre[semestreID];
            const datosOrdenados = {};

            // Agrupar por empresa
            datosSemestre.forEach((dato) => {
                const empresa = dato.nombreEmpresa;
                if (!datosOrdenados[empresa]) {
                    datosOrdenados[empresa] = [];
                }
                datosOrdenados[empresa].push(dato);
            });

            // Ordenar dentro de cada empresa
            for (const empresa in datosOrdenados) {
                if (Object.prototype.hasOwnProperty.call(datosOrdenados, empresa)) {
                    datosOrdenados[empresa].sort((a, b) => {
                        return a.fechaInicio - b.fechaInicio;
                    });
                }
            }

            // Reconstruir los datos del semestre
            const datosOrdenadosSemestre = [];
            for (const empresa in datosOrdenados) {
                if (Object.prototype.hasOwnProperty.call(datosOrdenados, empresa)) {
                    datosOrdenadosSemestre.push(...datosOrdenados[empresa]);
                }
            }

            datosPorSemestre[semestreID] = datosOrdenadosSemestre;
        }
    }

    // Reconstruir los datos ordenados
    const datosOrdenados = [];
    for (const semestreID in datosPorSemestre) {
        if (Object.prototype.hasOwnProperty.call(datosPorSemestre, semestreID)) {
            datosOrdenados.push(...datosPorSemestre[semestreID]);
        }
    }

    return datosOrdenados;
}




// Para usar la función:
async function testFunction() {
    try {
        const resultado = await obtenerInformacionEstudiantesPorEmpresa('', '', '');
        console.log(resultado);
        exportarResultadosAExcel_estudiantes(resultado)
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
    renderConsultas,
    estudiantesXempresa,
    estudiantesXempresa_Excel,
    profesoresXempresa,
    profesoresXempresa_Excel,
    consultaGeneral,
    consultaGeneral_Excel,
    estudiantesXnota,
    notas_Excel
}