document.addEventListener('DOMContentLoaded', obtenerArray);
  
  function obtenerArray(){
      const urlJSONArray = '/data.json';
      fetch(urlJSONArray)
          .then(respuesta => {
              return respuesta.json();
          })
          .then(resultado => {
              console.log(resultado);
              pendientesHTML(resultado);
              mostrarHTML(resultado);
              pendientesConTurno(resultado);
          })
          .catch(error => {
              return error;
          })
  }

  function pendientesHTML({hoy, tickets }) {
    const contenido = document.getElementById('data0');
    let body = '';

    tickets.forEach(data => {
        const { numero, nombre, apellido, dni, matricula, horario } = data;
        

        body += `<tr><td>${hoy}</td><td>${numero}</td><td>${horario}</td><td>${nombre}</td><td>${apellido}</td><td>${dni}</td><td>${matricula}</td></tr>`

        contenido.innerHTML = body;
    });
  }

  function pendientesConTurno({hoy, ticketsTurno }) {
    const contenido = document.getElementById('dataA');
    let body = '';

    ticketsTurno.forEach(data => {
        const { numero, nombre, apellido, dni, matricula, horario } = data;
        

        body += `<tr><td>${hoy}</td><td>${numero}</td><td>${horario}</td><td>${nombre}</td><td>${apellido}</td><td>${dni}</td><td>${matricula}</td></tr>`

        contenido.innerHTML = body;
    });
  }

  function mostrarHTML({hoy, totalHistorico }) {
    const contenido = document.getElementById('data');
    let body = '';

    totalHistorico.forEach(data => {
        const { numero, nombre, apellido, dni, matricula, horario, escritorio, horario2 } = data;
        

        body += `<tr><td>${hoy}</td><td>${numero}</td><td>${nombre}</td><td>${apellido}</td><td>${dni}</td><td>${matricula}</td><td>${escritorio}</td><td>${horario}</td><td>${horario2}</td></tr>`

        contenido.innerHTML = body;
    });
  }

  //Clase Exportar
  class TableCSVExporter {
    constructor (table, includeHeaders = true) {
        this.table = table;
        this.rows = Array.from(table.querySelectorAll("tr"));
        if (!includeHeaders && this.rows[0].querySelectorAll("th").length) {
            this.rows.shift();
        }
    }

    convertirCSV () {
        const lines = [];
        const numCols = this._findLongestRowLength();

        for (const row of this.rows) {
            let line = "";
            for (let i = 0; i < numCols; i++) {
                if (row.children[i] !== undefined) {
                    line += TableCSVExporter.parseCell(row.children[i]);
                }
                line += (i !== (numCols - 1)) ? "," : "";
            }

            lines.push(line);
        }
        return lines.join("\n");
    }
    _findLongestRowLength () {
        return this.rows.reduce((l, row) => row.childElementCount > l ? row.childElementCount : l, 0);
    }

    static parseCell (tableCell) {
        let parsedValue = tableCell.textContent;
        //Reemplaza comillas dobles por simples
        parsedValue = parsedValue.replace(/"/g, `""`);
        //Si tiene algunos de los valores mencionados que los ponga con doble comilla
        parsedValue = /[",\n]/.test(parsedValue) ? `"${parsedValue}"` : parsedValue;

        return parsedValue;
    }
}