// Rutas para listar, crear y marcar objetos como encontrados
const express = require('express');
const fs = require('fs');
const path = require('path');
const { LostItem, CATEGORIES } = require('../models/LostItem');

const router = express.Router();

// Carpeta donde se guardan las fotos
const uploadsDir = path.join(__dirname, '..', 'uploads');

// Si la carpeta no existe, la creamos
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Guarda una imagen que viene en base64 y regresa la ruta
function saveBase64Image(base64, mimeType) {
  var ext = 'jpg';
  if (mimeType && mimeType.indexOf('png') !== -1) {
    ext = 'png';
  }

  var fileName = Date.now() + '.' + ext;
  var filePath = path.join(uploadsDir, fileName);

  // Convertir base64 a archivo
  var buffer = Buffer.from(base64, 'base64');
  fs.writeFileSync(filePath, buffer);

  return '/uploads/' + fileName;
}

// GET /api/items
// Lista los objetos que todavia no se han encontrado
router.get('/', async function (req, res) {
  try {
    var search = req.query.search || '';
    var category = req.query.category || '';

    // Traemos todos los que no estan encontrados
    var items = await LostItem.find({ found: false });

    // Filtrar por categoria (si mandaron una)
    var filtrados = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];

      // Si pidieron categoria y no coincide, lo saltamos
      if (category !== '' && item.category !== category) {
        continue;
      }

      // Si hay texto de busqueda, revisamos titulo, descripcion y quien reporto
      if (search !== '') {
        var texto = search.toLowerCase();
        var titulo = (item.title || '').toLowerCase();
        var desc = (item.description || '').toLowerCase();
        var quien = (item.reportedBy || '').toLowerCase();

        if (
          titulo.indexOf(texto) === -1 &&
          desc.indexOf(texto) === -1 &&
          quien.indexOf(texto) === -1
        ) {
          continue;
        }
      }

      filtrados.push(item);
    }

    // Ordenar: los mas nuevos primero
    filtrados.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json(filtrados);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar objetos' });
  }
});

// POST /api/items
// Crea un objeto perdido nuevo
router.post('/', async function (req, res) {
  try {
    var title = req.body.title;
    var description = req.body.description || '';
    var category = req.body.category;
    var reportedBy = req.body.reportedBy;
    var imageBase64 = req.body.imageBase64;
    var imageMimeType = req.body.imageMimeType || 'image/jpeg';

    // Validaciones basicas
    if (!title || !category || !reportedBy || !imageBase64) {
      return res.status(400).json({
        message: 'Faltan datos (titulo, categoria, nombre o foto)',
      });
    }

    // Revisar que la categoria sea valida
    var categoriaOk = false;
    for (var i = 0; i < CATEGORIES.length; i++) {
      if (CATEGORIES[i] === category) {
        categoriaOk = true;
      }
    }
    if (!categoriaOk) {
      return res.status(400).json({ message: 'Categoria invalida' });
    }

    // Guardar la foto en disco
    var imageUrl = saveBase64Image(imageBase64, imageMimeType);

    // Guardar en MongoDB
    var item = await LostItem.create({
      title: title,
      description: description,
      category: category,
      reportedBy: reportedBy,
      imageUrl: imageUrl,
      found: false,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear objeto' });
  }
});

// PATCH /api/items/:id/found
// Marca un objeto como encontrado
router.patch('/:id/found', async function (req, res) {
  try {
    var id = req.params.id;
    var item = await LostItem.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Objeto no encontrado' });
    }

    item.found = true;
    item.updatedAt = new Date();
    await item.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error al marcar encontrado' });
  }
});

module.exports = router;
