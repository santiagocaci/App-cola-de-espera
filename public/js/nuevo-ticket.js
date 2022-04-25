const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnGenerarNuevoTicket = document.querySelector('#btnGenerarNuevoTicket');

const socket = io();

socket.on('connect', () => {
  btnGenerarNuevoTicket.disabled = false;
});

socket.on('ultimo-ticket', (ultimoTicket) => {
  lblNuevoTicket.innerHTML = 'Ticket ' + ultimoTicket;
});

socket.on('disconnect', () => {
  btnGenerarNuevoTicket.disabled = true;
});

btnGenerarNuevoTicket.addEventListener('click', () => {

  socket.emit('siguiente-ticket', null, ticket => {
    lblNuevoTicket.innerHTML = ticket;
  });
});