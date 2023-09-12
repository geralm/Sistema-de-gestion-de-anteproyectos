module.exports.eventsNames = [
    "Reunión de Planificación Semanal",
"Revisión de Documentación Técnica",
"Entrevista con el Cliente",
"Evaluación de Riesgos",
"Capacitación del Equipo",
"Presentación del Anteproyecto",
"Pruebas de Validación",
"Revisión de Presupuesto",
"Actualización del Cronograma",
"Sesión de Brainstorming",
"Reunión de Retroalimentación",
"Sesión de Priorización",
"Revisión de Requisitos",
"Sesión de Diseño Conceptual",
"Preparación de Informes de Progreso",
"Sesión de Pruebas de Concepto",
"Reunión de Evaluación de Recursos",
"Planificación de Comunicaciones",
"Revisión de Hitos",
"Sesión de Resolución de Problemas"
]
module.exports.eventsDescriptions = [
    
"Simula una reunión donde se planifican las tareas de la semana, como la asignación de recursos y la actualización de la base de datos de proyectos",
"Representa la revisión de documentación técnica relacionada con un proyecto y la actualización de registros en la base de datos con la información revisada",
"Este evento refleja una interacción con el cliente para recopilar información actualizada o nuevos requisitos que se deben registrar en la base de datos",
"Simula la identificación y evaluación de riesgos en un proyecto, con la posterior documentación de estos riesgos en la base de datos",
"Indica una sesión de capacitación para el equipo de proyecto, donde se pueden registrar los participantes y los detalles relacionados en la base de datos de capacitación",
"Representa la presentación de un anteproyecto a partes interesadas, y se puede utilizar para registrar comentarios y decisiones en la base de datos",
"Indica la fase de pruebas de validación de un proyecto, donde se registran los resultados de las pruebas en la base de datos",
"Simula la revisión y actualización del presupuesto de un proyecto, con el registro de cambios en la base de datos financiera",
"Este evento refleja la actualización del cronograma del proyecto y la modificación correspondiente de las fechas en la base de datos",
"Indica una sesión creativa de lluvia de ideas, donde se pueden registrar ideas y conceptos relevantes en la base de datos"
]
module.exports.getRandomDate = () =>{
    const year = 2023;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 31) + 1;
    const hour = Math.floor(Math.random() * 24); // Ajustado para 0-23
    const minute = Math.floor(Math.random() * 60); // Ajustado para 0-59
    const date = new Date(year, month - 1, day, hour, minute);
    return date; 
    
}