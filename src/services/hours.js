export function sumarUnaHora(hora) {
    // Parsear la hora que llega (formato 'HH:mm')
    const [horas, minutos] = hora.split(':').map(Number);
    const fecha = new Date();
    fecha.setHours(horas, minutos, 0, 0); // Establecer la hora en la fecha

    // Sumar una hora
    fecha.setHours(fecha.getHours() + 1);

    // Formatear la nueva hora al formato 'HH:mm'
    const horaFinal = fecha.toTimeString().split(' ')[0].substring(0, 5);
    return horaFinal;
}


export function getMessagesDate(hora, fecha) {
    let dateInit;
    let dateFinal;

    if (hora === "09:00") {
        dateInit = `${fecha}T09:00:00+02:00`;
        dateFinal = `${fecha}T11:00:00+02:00`;
    } else if (hora === "11:00") {
        dateInit = `${fecha}T11:00:00+02:00`;
        dateFinal = `${fecha}T13:00:00+02:00`;
    } else if (hora === "13:00") {
        dateInit = `${fecha}T13:00:00+02:00`;
        dateFinal = `${fecha}T15:00:00+02:00`;
    } else if (hora === "15:00") {
        dateInit = `${fecha}T15:00:00+02:00`;
        dateFinal = `${fecha}T17:00:00+02:00`;
    } else if (hora === "17:00") {
        dateInit = `${fecha}T17:00:00+02:00`;
        dateFinal = `${fecha}T19:00:00+02:00`;
    }

    return { dateFinal, dateInit };
}
