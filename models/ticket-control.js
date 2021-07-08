const path = require('path');
const fs = require('fs');

class Ticket {
    constructor(numero, horario, matricula, escritorio) {
        this.numero = numero;
        this.horario = horario;
        this.matricula = matricula; //esto sería DNI o Matricula
        this.escritorio = escritorio;
    }
}


class TicketControl {

    constructor() {

        this.ultimo = 0;
        this.hoy = new Date().toLocaleDateString();
        this.tickets = [];
        this.ultimos4 = [];
        this.totalHistorico = [];
        this.init();
    }

    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4,
            totalHistorico: this.totalHistorico
        }
    }

    init() {
        const { hoy, tickets, ultimo, ultimos4, totalHistorico } = require('../db/data.json');
        if (hoy === this.hoy) {
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos4 = ultimos4;
            this.totalHistorico = totalHistorico;
        } else {
            this.guardarDB();
        }
    }

    guardarDB() {
        const dbPath = path.join(
            __dirname, '../db/data.json'
        );

        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }

    siguiente(matricula) {
        this.ultimo += 1;
        const horarioNuevo = new Date().toLocaleTimeString('es-ES');
        this.horario = horarioNuevo;
        const ticket = new Ticket(this.ultimo, this.horario, matricula);
        this.tickets.push(ticket);
        this.guardarDB();
        return `Ticket ${ticket.numero} - DNI/MATRICULA: ${ticket.matricula}`;
    }

    atenderTicket(escritorio) {
        if (this.tickets.length === 0) return null;
        const ticket = this.tickets.shift();
        ticket.escritorio = escritorio;
        ticket.horario = new Date().toLocaleTimeString('es-ES');
        this.ultimos4.unshift(ticket);
        this.totalHistorico.push(ticket);
        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1);
        }
        this.guardarDB();
        return ticket;
    }

    //nueva funcion al txt
    backupDB() {
        const data = {
            hoy: this.hoy,
            totalAtendidos: this.totalHistorico.length,
            totalHistorico: this.totalHistorico
        };

        let jsonData = JSON.stringify(data);
        fs.writeFile(`./db/log-${Date.now()}.txt`, jsonData, function(err) {
            if (err) {
                console.log(err);
            }
        });
    }

    //borrado y reemplazo para empezar de 0
    nuevoDia() {
        this.backupDB();
        this.ultimo = 0;
        this.tickets = [];
        this.ultimos4 = [];
        this.totalHistorico = [];
        this.guardarDB();
    };
}

module.exports = TicketControl;