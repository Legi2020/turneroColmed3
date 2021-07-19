// Referencias del HTML
const lblEscritorio = document.querySelector('h1');
const btnSiguiente = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');
const labelNoTickets = document.querySelector('.alert-info');

const searchParams = new URLSearchParams(window.location.search);
if (!searchParams.has('escritorio')) {
    throw new Error('El BOX es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = `Utilizando el BOX: ${escritorio}`;

divAlerta.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    btnSiguiente.disabled = false;


});

socket.on('disconnect', () => {
    btnSiguiente.disabled = true;
});


socket.on('tickets-pendientes', (pendientes) => {
    const audio = new Audio('./audio/alert2.mp3');
    if (pendientes === 0) {
        labelNoTickets.style.display = '';
        lblPendientes.style.display = 'none';
    } else {
        audio.play();
        window.alert('Hay una persona en espera');
        setTimeout(function(){
            audio.play();
        },2000);
        labelNoTickets.style.display = 'none';
        lblPendientes.style.display = '';
        lblPendientes.innerText = pendientes;
        audio.play();
    }
    lblPendientes.innerText = pendientes;
})

btnSiguiente.addEventListener('click', () => {
    socket.emit('atender-ticket', { escritorio }, ({ ok, ticket }) => {
        if (!ok) {
            lblTicket.innerText = 'Nadie';
            return divAlerta.style.display = '';
        }
        lblTicket.innerText = `Turno: ${ticket.numero} con DNI-Matricula: ${ticket.matricula}` ;
    });

});