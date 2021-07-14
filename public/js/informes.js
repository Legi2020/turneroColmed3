document.addEventListener('DOMContentLoaded', obtenerArray);
const table = document.getElementById('myTable');
  
  function obtenerArray(){
      const urlJSONArray = '/data.json';
      fetch(urlJSONArray)
          .then(respuesta => {
              return respuesta.json();
          })
          .then(resultado => {
              console.log(resultado); //Hasta aca llega
              crearTabla(resultado);
          })
          .catch(error => {
              return error;
          })
  }
  

  function crearTabla(data){
      for (var i = 0; i < data.length; i++){
          var row = `<tr>
                          <td>${data[i].ultimo}</td>
                          <td>${data.hoy}</td>
                    </tr>`
          table.innerHTML += row

          console.log(resultado);


      }
  }
  