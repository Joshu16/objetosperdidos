// Archivo principal del servidor
require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const itemsRouter = require('./routes/items');

const app = express();

// Puerto y conexion a MongoDB (leidos del archivo .env)
const PORT = process.env.PORT || 3001;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/objetosperdidos';

// Middlewares basicos
app.use(cors()); // permite que la app se conecte al servidor
app.use(morgan('dev')); // muestra las peticiones en la consola
app.use(express.json({ limit: '15mb' })); // para recibir JSON (fotos en base64)

// Carpeta donde se guardan las fotos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas de objetos perdidos
app.use('/api/items', itemsRouter);

// Ruta simple para saber si el servidor esta bien
app.get('/api/health', function (req, res) {
  var mongoOk = false;
  if (mongoose.connection.readyState === 1) {
    mongoOk = true;
  }
  res.json({ ok: true, mongo: mongoOk });
});

// Conectar a MongoDB y luego arrancar el servidor
mongoose
  .connect(MONGODB_URI)
  .then(function () {
    console.log('MongoDB conectado:', MONGODB_URI);

    app.listen(PORT, '0.0.0.0', function () {
      console.log('API en http://0.0.0.0:' + PORT);
    });
  })
  .catch(function (error) {
    console.log('No se pudo conectar a MongoDB:', error.message);
    process.exit(1);
  });
