// Referencias del HTML
const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnCrear = document.querySelector('button');
const nuevoDato = document.getElementById('lblNuevoDato');

const socket = io();

socket.on('connect', () => {
    btnCrear.disabled = false;


});

socket.on('disconnect', () => {
    btnCrear.disabled = true;
});

socket.on('ultimo-ticket', ultimo => {
    lblNuevoTicket.innerText = `Turno actual: ${ultimo}`;
});

btnCrear.addEventListener('click', () => {
    console.log(nuevoDato.value);
    socket.emit('siguiente-ticket', null, (ticket) => {
        lblNuevoTicket.innerText = ticket;
        nuevoDato.value = ticket;
    });

});