const { checkSchema } = require("express-validator");

/**
 * 🛡️ Esquema de validación para crear productos
 */
const productosSchema = checkSchema({
  // 🔤 Nombre
  nombre: {
    notEmpty: { errorMessage: "El nombre del producto es obligatorio" },
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage: "Debe tener entre 2 y 100 caracteres"
    },
    trim: true,
    escape: true,
    bail: true
  },

  // 📝 Descripción
  descripcion: {
    notEmpty: { errorMessage: "La descripción es obligatoria" },
    isLength: {
      options: { min: 10, max: 500 },
      errorMessage: "Debe tener entre 10 y 500 caracteres"
    },
    trim: true,
    escape: true,
    bail: true
  },

  // 💰 Precio
  precio: {
    notEmpty: { errorMessage: "El precio es obligatorio" },
    isFloat: {
      options: { min: 0 },
      errorMessage: "Debe ser un número mayor o igual a 0"
    },
    bail: true
  },

  // 🎯 Descuento (opcional)
  descuento: {
    optional: true,
    isFloat: {
      options: { min: 0, max: 100 },
      errorMessage: "Debe estar entre 0 y 100"
    }
  },

  // 📦 Stock
  stock: {
    isInt: {
      options: { min: 0 },
      errorMessage: "El stock debe ser un entero no negativo"
    },
    bail: true
  },

  // 🏷️ Marca
  marca_id: {
    isInt: { errorMessage: "La marca debe ser un ID numérico válido" }
  },

  // 🗂️ Categoría
  categoria_id: {
    isInt: { errorMessage: "La categoría debe ser un ID numérico válido" }
  },

  // 🚚 Proveedor (opcional)
  proveedor_id: {
    optional: true,
    isInt: { errorMessage: "El proveedor debe ser un ID válido" }
  },

  // ✅ Publicado
  publicado: {
    isBoolean: { errorMessage: "Debe ser true o false" }
  },

  // 💳 Tipo de pago
  tipo_pago: {
    isIn: {
      options: [["efectivo", "crédito", "débito", "transferencia"]],
      errorMessage: "Tipo de pago no válido"
    }
  },

  // 🕒 MSI
  meses_sin_intereses: {
    isBoolean: { errorMessage: "Debe ser true o false" }
  },

  // 🖼️ URL de imagen (opcional)
  imagen_url: {
    optional: true,
    isURL: { errorMessage: "La URL de la imagen no es válida" }
  },

  // ⚙️ Estado interno (opcional)
  status: {
    optional: true,
    isIn: {
      options: [["activo", "inactivo", "demo"]],
      errorMessage: "Estado inválido. Usa: activo, inactivo o demo"
    }
  }
});

module.exports = { productosSchema };
