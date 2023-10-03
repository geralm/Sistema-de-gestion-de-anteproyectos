module.exports.mapManyEvents = (events,dateFunc) => {
    return events.map(e => ({
        id: e._id,
        title: e.title,
        startDate: dateFunc(e.startDate),
        finishDate: dateFunc(e.finishDate),
        duration: calcDuration(Date.now(), e.finishDate),
        description: e.description || 'Sin descripción'
      }));
}
module.exports.mapOneEvent = (e, dateFunc) =>{
    return {
        id: e._id,
        title: e.title,
        startDate: dateFunc(e.startDate),
        finishDate: dateFunc(e.finishDate),
        duration : calcDuration(Date.now(), e.finishDate),
        description: e.description || 'Sin descripción'
    }
}
module.exports.toInputString = (date) =>{
    const [year, month, day, hours, minutes] = [
        date.getFullYear(),
        date.getMonth()+1,
        date.getDate(),
        date.getHours(),
        date.getMinutes()
    ]
    console.log(month)
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}T${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:00`;
}
module.exports.toDateString = date => (date.toDateString());

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
