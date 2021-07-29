const path = require('path');
const fs = require('fs');

class Ticket {
    constructor(numero, horario, horario2, nombre, apellido, dni, matricula, escritorio) {
        this.numero = numero;
        this.horario = horario;
        this.horarioFinal = horario2;
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.matricula = matricula;
        this.escritorio = escritorio;
    }
}


class TicketControl {

    constructor() {

        this.ultimo = 0;
        this.hoy = new Date().toLocaleDateString();
        this.tickets = [];
        this.ticketsTurno = [];
        this.ultimos4 = [];
        this.totalHistorico = [];
        this.init();
    }

    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ticketsTurno: this.ticketsTurno,
            ultimos4: this.ultimos4,
            totalHistorico: this.totalHistorico
        }
    }

    init() {
        const { hoy, tickets, ticketsTurno, ultimo, ultimos4, totalHistorico } = require('../db/data.json');
        if (hoy === this.hoy) {
            this.tickets = tickets;
            this.ticketsTurno = ticketsTurno;
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

    siguiente(nombre, apellido, dni, matricula) {
        this.ultimo += 1;
        const horarioNuevo = new Date().toLocaleTimeString('es-ES');
        this.horario = horarioNuevo;
        const ticket = new Ticket(this.ultimo, this.horario, this.horarioFinal, nombre, apellido, dni, matricula);
        this.tickets.push(ticket);
        this.guardarDB();
        return `Ticket ${ticket.numero}`;
    }

    siguiente2(nombre, apellido, dni, matricula) { //Función para los que tengan turno
        this.ultimo += 1;
        const horarioNuevo = new Date().toLocaleTimeString('es-ES');
        this.horario = horarioNuevo;
        const ticket = new Ticket(this.ultimo, this.horario, this.horarioFinal, nombre, apellido, dni, matricula);
        this.ticketsTurno.push(ticket);
        this.guardarDB();
        return `Ticket ${ticket.numero}`;
    }

    atenderTicket(escritorio) {
        if (this.tickets.length === 0) return null;
        const ticket = this.tickets.shift();
        ticket.escritorio = escritorio;
        const horarioFinal = new Date().toLocaleTimeString('es-ES');
        ticket.horario2 = horarioFinal;
        this.ultimos4.unshift(ticket);
        this.totalHistorico.push(ticket);
        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1);
        }
        this.guardarDB();
        return ticket;
    }

    atenderTicketTurno(escritorio) { //Función atender ticket que tienen turno
        if (this.ticketsTurno.length === 0) return null;
        const ticket = this.ticketsTurno.shift();
        ticket.escritorio = escritorio;
        const horarioFinal = new Date().toLocaleTimeString('es-ES');
        ticket.horario2 = horarioFinal;
        this.ultimos4.unshift(ticket);
        this.totalHistorico.push(ticket);
        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1);
        }
        this.guardarDB();
        return ticket;
    }


    backupDB() {
        const data = {
            hoy: this.hoy,
            totalAtendidos: this.totalHistorico.length,
            totalHistorico: this.totalHistorico
        };

        let jsonData = JSON.stringify(data);
        //Backup en TXT
        fs.writeFile(`./db/logs/log-${Date.now()}.txt`, jsonData, function(err) {
            if (err) {
                console.log(err);
            }
        });
        //Backup en Json
        fs.writeFile(`./db/backups/log-${Date.now()}.json`, jsonData, function(err) {
            if (err) {
                console.log(err);
            }
        });
    };

    //borrado y reemplazo para empezar de 0
    nuevoDia() {
        this.backupDB();
        this.ultimo = 0;
        this.tickets = [];
        this.ticketsTurno = [];
        this.ultimos4 = [];
        this.totalHistorico = [];
        this.guardarDB();
    };
}

module.exports = TicketControl;