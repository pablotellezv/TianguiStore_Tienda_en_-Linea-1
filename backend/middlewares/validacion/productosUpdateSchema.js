const { checkSchema } = require("express-validator");

/**
 * ✏️ Esquema de validación para actualización parcial de productos
 * Utilizado en PUT /productos/:id
 */
const productosUpdateSchema = checkSchema({
  nombre: {
    optional: true,
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage: "El nombre debe tener entre 2 y 100 caracteres"
    },
    trim: true,
    escape: true,
    bail: true
  },
  descripcion: {
    optional: true,
    isLength: {
      options: { min: 10, max: 500 },
      errorMessage: "La descripción debe tener entre 10 y 500 caracteres"
    },
    trim: true,
    escape: true,
    bail: true
  },
  precio: {
    optional: true,
    isFloat: {
      options: { min: 0 },
      errorMessage: "El precio debe ser un número mayor o igual a 0"
    },
    bail: true
  },
  descuento: {
    optional: true,
    isFloat: {
      options: { min: 0, max: 100 },
      errorMessage: "El descuento debe estar entre 0 y 100"
    }
  },
  stock: {
    optional: true,
    isInt: {
      options: { min: 0 },
      errorMessage: "El stock debe ser un número entero no negativo"
    }
  },
  marca_id: {
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: "La marca debe ser un ID válido"
    }
  },
  categoria_id: {
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: "La categoría debe ser un ID válido"
    }
  },
  proveedor_id: {
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: "El proveedor debe ser un ID válido"
    }
  },
  publicado: {
    optional: true,
    isBoolean: { errorMessage: "Publicado debe ser booleano" },
    toBoolean: true
  },
  tipo_pago: {
    optional: true,
    isIn: {
      options: [["efectivo", "crédito", "débito", "transferencia"]],
      errorMessage: "Tipo de pago inválido"
    }
  },
  meses_sin_intereses: {
    optional: true,
    isBoolean: { errorMessage: "Debe ser booleano" },
    toBoolean: true
  },
  imagen_url: {
    optional: true,
    isURL: { errorMessage: "URL de imagen no válida" },
    trim: true
  },
  status: {
    optional: true,
    isIn: {
      options: [["activo", "inactivo", "demo"]],
      errorMessage: "Estado inválido. Usa: activo, inactivo o demo"
    }
  }
});

module.exports = { productosUpdateSchema };
