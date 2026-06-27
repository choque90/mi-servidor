const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());

// Página web principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Ruta para verificar estado
app.get('/estado', (req, res) => {
  res.json({ estado: 'conectado' });
});

// Ruta para recibir mensaje desde la app
app.get('/mensaje', (req, res) => {
  const texto = req.query.texto || '';
  io.emit('mensaje', texto);
  res.json({ ok: true, mensaje: texto });
});

io.on('connection', (socket) => {
  console.log('Cliente conectado');
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Servidor corriendo en puerto ' + PORT);
});
