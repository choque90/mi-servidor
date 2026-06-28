const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.use(express.json());

// Variables de estado
let comandoLED = 'LED_OFF';
let ultimoMensaje = '';

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
  ultimoMensaje = texto;
  res.json({ ok: true, mensaje: texto });
});

// Ruta para controlar LED
app.get('/led', (req, res) => {
  const accion = req.query.accion || 'off';
  comandoLED = accion === 'on' ? 'LED_ON' : 'LED_OFF';
  res.json({ ok: true, comando: comandoLED });
});

// Ruta que lee el ESP32 cada segundo
app.get('/comando', (req, res) => {
  res.send(comandoLED);
});

// Ruta para que la página web consulte el último estado
app.get('/ultimoMensaje', (req, res) => {
  res.json({ mensaje: ultimoMensaje, led: comandoLED });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log('Servidor corriendo en puerto ' + PORT);
});
