// Referencias del HTML
const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnCrear = document.querySelector('button'); 
const datoNombre = document.getElementById('lblNombre');
const datoApellido = document.getElementById('lblApellido');
const datoDNI = document.getElementById('lblDNI');
const datoMatricula = document.getElementById('lblMatricula');

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
    if(datoNombre.value == "" || datoApellido.value == "" || datoDNI.value == "") { //Consultar en futuro por un minimo de caracteres.
        alert('No puede estar el campo vacio');
    }else {
        socket.emit('siguiente-ticket-2', (datoNombre.value), (datoApellido.value), (datoDNI.value), (datoMatricula.value), (ticket) => {
            lblNuevoTicket.innerText = ticket;
            datoNombre.value = ticket;
            datoApellido.value = ticket;
            datoDNI.value = ticket;
            datoMatricula.value = ticket;
        }); 
    };
    window.setTimeout(function () {
        Swal.fire({
            title: '¡Turno logrado con Éxito!',
            text: `Por favor recuerde su ${lblNuevoTicket.innerText}`,
            icon: 'success',
            confirmButtonText: 'Cerrar'
          }).then( () => {
            window.location.assign("/seleccion.html");
          });
        }, 300);

});