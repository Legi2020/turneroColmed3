// Referencias del HTML - Se agregaron nuevas
const lblTicket1 = document.querySelector('#lblTicket1');
const lblDatos1 = document.querySelector('#lblDatos1');
const lblEscritorio1 = document.querySelector('#lblEscritorio1');
const lblTicket2 = document.querySelector('#lblTicket2');
const lblDatos2 = document.querySelector('#lblDatos2');
const lblEscritorio2 = document.querySelector('#lblEscritorio2');
const lblTicket3 = document.querySelector('#lblTicket3');
const lblDatos3 = document.querySelector('#lblDatos3');
const lblEscritorio3 = document.querySelector('#lblEscritorio3');
const lblTicket4 = document.querySelector('#lblTicket4');
const lblDatos4 = document.querySelector('#lblDatos4');
const lblEscritorio4 = document.querySelector('#lblEscritorio4');



const socket = io();



socket.on('estado-actual', payload => {
    const audio = new Audio('./audio/new-ticket.mp3');
    audio.play();

    const [ticket1, ticket2, ticket3, ticket4] = payload;

    if (ticket1) {
        lblTicket1.innerText = `Turno: ${ticket1.numero}`;
        lblDatos1.innerText = `Matricula/DNI: ${ticket1.datos}`;
        lblEscritorio1.innerText = `BOX: ${ticket1.escritorio}`;
    }

    if (ticket2) {
        lblTicket2.innerText = `Turno: ${ticket2.numero}`;
        lblEscritorio2.innerText = `BOX: ${ticket2.escritorio}`;

    }

    if (ticket3) {
        lblTicket3.innerText = `Turno: ${ticket3.numero}`;
        lblEscritorio3.innerText = `BOX: ${ticket3.escritorio}`;
    }

    if (ticket4) {
        lblTicket4.innerText = `Turno: ${ticket4.numero}`;
        lblEscritorio4.innerText = `BOX: ${ticket4.escritorio}`;

    }

});