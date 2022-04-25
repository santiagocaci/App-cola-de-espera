const { TicketControl } = require("../models/ticket");

const ticketControl = new TicketControl();

const socketController = (socket) => {

  // Cuando un cliente se conecta
  socket.emit('ultimo-ticket', ticketControl.ultimo);
  socket.emit('estado-actual', ticketControl.ultimos4);
  socket.emit('tickets-pendientes', ticketControl.tickets.length);

  socket.on('siguiente-ticket', (payload, callback) => {

    const next = ticketControl.nextTicket();
    callback(next);
    socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
  });

  socket.on('atender-ticket', ({ escritorio }, callback) => {


    if (!escritorio) {

      return callback({
        ok: false,
        msg: 'El escritorio es obligatorio'
      });
    }

    const ticket = ticketControl.atenderTicket(escritorio);

    // TODO: notificar cambios en los ultimos 4
    socket.broadcast.emit('estado-actual', ticketControl.ultimos4);

    
    socket.emit('tickets-pendientes', ticketControl.tickets.length);
    socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);



    if (!ticket) {
      callback({
        ok: false,
        msg: 'Ya no hay tickets pendientes'
      });
    } else {
      callback({
        ok: true,
        ticket
      });
    }

  });

}



module.exports = {
  socketController
}

