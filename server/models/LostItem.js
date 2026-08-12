// Modelo de un objeto perdido en MongoDB
const mongoose = require('mongoose');

// Categorias permitidas
const CATEGORIES = [
  'Electronica',
  'Ropa',
  'Utiles escolares',
  'Accesorios',
  'Deportes',
  'Otros',
];

// Campos que guarda cada objeto
const lostItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  reportedBy: {
    type: String,
    required: true,
  },
  found: {
    type: Boolean,
    default: false, // false = sigue perdido
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Exportamos el modelo y las categorias
module.exports = {
  LostItem: mongoose.model('LostItem', lostItemSchema),
  CATEGORIES: CATEGORIES,
};
