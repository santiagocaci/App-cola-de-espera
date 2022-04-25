const lblEscritor = document.querySelector("#nombreEscritorio");
const btnAtenderTicket = document.querySelector("#btnAtenderTicket");
const lblTicker = document.querySelector('#lblTicket');
const divAlerta = document.querySelector('#divAlerta');
const lblPendientes = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
  window.location = 'index.html';
  throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritor.innerHTML = escritorio;

divAlerta.style.display = 'none';

const socket = io();

socket.on('connect', () => {
  btnAtenderTicket.disabled = false;
});

socket.on('tickets-pendientes', (pendientes) => {
  if (pendientes === 0) {
    lblPendientes.style.display = 'none';
  } else {
    lblPendientes.style.display = '';
    lblPendientes.innerHTML = pendientes;
  }
});

socket.on('disconnect', () => {
  btnAtenderTicket.disabled = true;
});

btnAtenderTicket.addEventListener('click', () => {

  socket.emit('atender-ticket', { escritorio }, ({ ok, ticket, msg }) => {

    if (!ok) {

      lblTicker.innerHTML = 'Nadie ';

      return divAlerta.style.display = '';
    }

    lblTicker.innerHTML = 'Ticket ' + ticket.numero;

  });
  // socket.emit('siguiente-ticket', null, ticket => {
  //   lblNuevoTicket.innerHTML = ticket;
  // });
});