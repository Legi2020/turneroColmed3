// Referencias del HTML
const lblEscritorio = document.querySelector('h1');
const btnSiguiente = document.getElementById('atender');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');
const labelNoTickets = document.querySelector('.alert-info');
//escritorioPendientes
const btnSiguiente2 = document.getElementById('atender2');
const lblTicket2 = document.querySelector('h5');
const divAlerta2 = document.querySelector('.alert'); //este
const lblPendientes2 = document.querySelector('#lblPendientes2'); //Este
const labelNoTickets2 = document.querySelector('.alert-warning'); //Este

const searchParams = new URLSearchParams(window.location.search);
if (!searchParams.has('escritorio')) {
    throw new Error('El BOX es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = `Utilizando el BOX: ${escritorio}`;

divAlerta.style.display = 'none';
divAlerta2.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    btnSiguiente.disabled = false;
    btnSiguiente2.disabled = false;


});

socket.on('disconnect', () => {
    btnSiguiente.disabled = true;
    btnSiguiente2.disabled = true;
});


socket.on('tickets-pendientes', (pendientes) => {
    const audio = new Audio('./audio/alert2.mp3');
    if (pendientes === 0) {
        labelNoTickets.style.display = '';
        lblPendientes.style.display = 'none';
    } else {
        audio.play();
        //window.alert('Hay una persona en espera');
        labelNoTickets.style.display = 'none';
        lblPendientes.style.display = '';
        lblPendientes.innerText = pendientes;
    }
    lblPendientes.innerText = pendientes;
})

btnSiguiente.addEventListener('click', () => {
    socket.emit('atender-ticket', { escritorio }, ({ ok, ticket }) => {
        if (!ok) {
            lblTicket.innerText = 'Nadie';
            return divAlerta.style.display = '';
        }
        lblTicket.innerText = `Turno: ${ticket.numero}, Apellido: ${ticket.apellido}, Nombre: ${ticket.nombre}, DNI: ${ticket.dni}, Matricula: ${ticket.matricula}` ;
    });

});

socket.on('ticket-pendientes-2', (pendientes) => {
    const audio = new Audio('./audio/alert2.mp3');
    if (pendientes === 0) {
        labelNoTickets2.style.display = '';
        lblPendientes2.style.display = 'none';
    } else {
        audio.play();
        //window.alert('Hay una persona en espera');
        labelNoTickets2.style.display = 'none';
        lblPendientes2.style.display = '';
        lblPendientes2.innerText = pendientes;
    }
    lblPendientes2.innerText = pendientes;
})

btnSiguiente2.addEventListener('click', () => {
    socket.emit('atender-ticket-2', { escritorio }, ({ ok, ticket }) => {
        if (!ok) {
            lblTicket2.innerText = 'Nadie';
            return divAlerta2.style.display = '';
        }
        lblTicket2.innerText = `Turno: ${ticket.numero}, Apellido: ${ticket.apellido}, Nombre: ${ticket.nombre}, DNI: ${ticket.dni}, Matricula: ${ticket.matricula}` ;
    });

});


/*finalizarTurno.addEventListener('click', () => {
    socket.emit('finalizar-Box');
    console.log('ok logrado')
})*/

