const botonNuevoDia = document.querySelector('#btn-nuevoDia');
const socket = io();


botonNuevoDia.addEventListener('click', () => {
    socket.emit('nuevo-dia');
    setTimeout(function(){
        window.location.reload();
    },800);

});