const express = require('express'); 
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Página web principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Cuando llega un mensaje desde la app
io.on('connection', (socket) => {
  console.log('Cliente conectado');
  
  socket.on('mensaje', (data) => {
    console.log('Mensaje recibido:', data);
    io.emit('mensaje', data); // manda a todos
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Servidor corriendo en puerto ' + PORT);
});
