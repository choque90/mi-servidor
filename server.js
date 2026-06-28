const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());

// Estado del LED
let comandoLED = 'LED_OFF';

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

// Ruta para controlar LED
app.get('/led', (req, res) => {
  const accion = req.query.accion || 'off';
  comandoLED = accion === 'on' ? 'LED_ON' : 'LED_OFF';
  io.emit('led', comandoLED);
  res.json({ ok: true, comando: comandoLED });
});

// Ruta que lee el ESP32 cada segundo
app.get('/comando', (req, res) => {
  res.send(comandoLED);
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
