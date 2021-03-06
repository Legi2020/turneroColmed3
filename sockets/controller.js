const TicketControl = require('../models/ticket-control');
const ticketControl = new TicketControl();


const socketController = (socket) => {

    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);

    socket.emit('tickets-pendientes', ticketControl.tickets.length);

    socket.on('siguiente-ticket', (payload, callback) => {
        const siguiente = ticketControl.siguiente(payload);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
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

    /*socket.on('finalizar-Box', function() {
        ticketControl.finalizarBox();
    })*/

}



module.exports = {
    socketController
}