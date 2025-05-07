/**
 * 📁 MIDDLEWARE: productosUpdateSchema.js
 * 📦 Esquema de validación para actualización parcial de productos (PUT)
 */

const { checkSchema } = require("express-validator");

const productosUpdateSchema = checkSchema({
  nombre: {
    optional: true,
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage: "El nombre debe tener entre 2 y 100 caracteres"
    },
    trim: true,
    escape: true
  },
  descripcion: {
    optional: true,
    isLength: {
      options: { min: 10, max: 500 },
      errorMessage: "La descripción debe tener entre 10 y 500 caracteres"
    },
    trim: true,
    escape: true
  },
  precio: {
    optional: true,
    isFloat: {
      options: { min: 0 },
      errorMessage: "El precio debe ser un número positivo"
    }
  },
  stock: {
    optional: true,
    isInt: {
      options: { min: 0 },
      errorMessage: "El stock debe ser un número entero positivo"
    }
  },
  publicado: {
    optional: true,
    isBoolean: {
      errorMessage: "Publicado debe ser true o false"
    }
  },
  categoria_id: {
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: "ID de categoría inválido"
    }
  },
  marca_id: {
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: "ID de marca inválido"
    }
  },
  proveedor_id: {
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: "ID de proveedor inválido"
    }
  }
});

module.exports = { productosUpdateSchema }; // ✅ Exportación nombrada
