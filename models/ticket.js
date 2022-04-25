const path = require('path');
const fs = require('fs');

class Ticket {

  constructor(numero, escritorio) {
    this.numero = numero;
    this.escritorio = escritorio;
  }
}

class TicketControl {

  constructor() {
    this.ultimo = 0;
    this.day = new Date().getDate();
    this.tickets = [];
    this.ultimos4 = [];

    this.init();
  }

  get toJson() {
    return {
      ultimo: this.ultimo,
      day: this.day,
      tickets: this.tickets,
      ultimos4: this.ultimos4,
    }
  }

  init() {
    const { day, tickets, ultimo, ultimos4 } = require('../database/data.json');
    if (day === this.day) {
      this.tickets = tickets;
      this.ultimo = ultimo;
      this.ultimos4 = ultimos4;
    } else {
      this.saveDataBase();
    }
  }

  saveDataBase() {
    const dbPath = path.join(__dirname, '../database/data.json');

    // Transformar el toJson en un JSON por que recibe un String
    fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
  }

  nextTicket() {
    this.ultimo += 1;
    const ticket = new Ticket(this.ultimo, null);
    this.tickets.push(ticket);

    this.saveDataBase();
    return 'Ticket ' + ticket.numero;
  }

  atenderTicket(escritorio) {

    // no hay tickets
    if (this.tickets.length === 0) {
      return null;
    }

    const ticket = this.tickets.shift();
    ticket.escritorio = escritorio;

    this.ultimos4.unshift(ticket);

    if (this.ultimos4.length > 4) {
      // Corta el arreglo en el ultimo lugar y solo saca un elemento
      this.ultimos4.splice(-1, 1);
    }

    this.saveDataBase();
    return ticket;
  }

}

module.exports = {
  TicketControl
}