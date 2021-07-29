const TicketControl = require('../models/ticket-control');
const ticketControl = new TicketControl();


const socketController = (socket) => {

    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);

    socket.emit('tickets-pendientes', ticketControl.tickets.length);

    socket.emit('ticket-pendientes-2', ticketControl.ticketsTurno.length);

    socket.on('siguiente-ticket', (nombre, apellido, dni, matricula, callback) => {
        const siguiente = ticketControl.siguiente(nombre, apellido, dni, matricula);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
        callback(siguiente);
    });

    socket.on('siguiente-ticket-2', (nombre, apellido, dni, matricula, callback) => {
        const siguiente = ticketControl.siguiente2(nombre, apellido, dni, matricula);
        socket.broadcast.emit('ticket-pendientes-2', ticketControl.ticketsTurno.length);
        callback(siguiente);
    });

    socket.on('nuevo-dia', () => ticketControl.nuevoDia());

    socket.on('atender-ticket', ({ escritorio }, callback) => {
        if (!escritorio) return callback({ ok: false, msg: 'El escritorio es obligatorio' });
        const ticket = ticketControl.atenderTicket(escritorio);
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
        socket.emit('tickets-pendientes', ticketControl.tickets.length);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
        if (!ticket) return callback({ ok: false, msg: 'No hay tickets pendientes' });
        return callback({ ok: true, ticket });
    });

    socket.on('atender-ticket-2', ({ escritorio }, callback) => {
        if (!escritorio) return callback({ ok: false, msg: 'El escritorio es obligatorio' });
        const ticket = ticketControl.atenderTicketTurno(escritorio);
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
        socket.emit('ticket-pendientes-2', ticketControl.ticketsTurno.length);
        socket.broadcast.emit('ticket-pendientes-2', ticketControl.ticketsTurno.length);
        if (!ticket) return callback({ ok: false, msg: 'No hay tickets pendientes' });
        return callback({ ok: true, ticket });
    });



}



module.exports = {
    socketController
}