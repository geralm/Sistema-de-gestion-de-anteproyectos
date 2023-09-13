module.exports.mapManyEvents = (events) => {
    return events.map(event => ({
        id: event._id,
        title: event.title,
        startDate: event.startDate.toDateString() ,
        finishDate: event.finishDate.toDateString(),
        description: event.description || 'Sin descripción'
      }));
}
module.exports.mapOneEvent = e =>{
    return {
        id: e._id,
        title: e.title,
        startDate: e.startDate.toDateString() ,
        finishDate: e.finishDate.toDateString(),
        duration : calcDuration(Date.now(), e.finishDate),
        description: e.description || 'Sin descripción'
    }
}
const calcDuration = function (startdate, finishdate){
    const diferenciaMs = Math.abs(finishdate - startdate);
    const days = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diferenciaMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minuts = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
    if (diferenciaMs < 0) {
        return "expirado";
      }
    let duration = ""; 
    if (days > 0) {
        duration += `${days} día(s), `;
    }
    if (hours > 0) {
        duration += `${hours} hora(s), `;
    }
    if (minuts > 0) {
        duration += `${minuts} minuto(s)`;
    }
    return duration;
}