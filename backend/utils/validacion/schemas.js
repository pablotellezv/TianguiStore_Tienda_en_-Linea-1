// utils/validacion/schemas.js

module.exports = {
  producto: {
    nombre:        { tipo: "string", max: 100, requerido: true },
    descripcion:   { tipo: "string", max: 500, requerido: true },
    precio:        { tipo: "float", validator: "isFloat", opciones: { min: 0 }, requerido: true },
    descuento:     { tipo: "float", validator: "isFloat", opciones: { min: 0, max: 100 }, requerido: false },
    stock:         { tipo: "int", validator: "isInt", opciones: { min: 0 }, requerido: true },
    publicado:     { tipo: "boolean", requerido: false },
    categoria_id:  { tipo: "int", validator: "isInt", requerido: true },
    marca_id:      { tipo: "int", validator: "isInt", requerido: true },
    proveedor_id:  { tipo: "int", validator: "isInt", requerido: false },
    tipo_pago:     { tipo: "string", max: 30, requerido: true },
    meses_sin_intereses: { tipo: "boolean", requerido: false }
  },

  usuario: {
    correo_electronico: { tipo: "string", max: 120, validator: "isEmail", requerido: true },
    contrasena:         { tipo: "string", max: 100, validator: "isStrongPassword", requerido: true },
    nombre:             { tipo: "string", max: 100, requerido: true },
    apellido_paterno:   { tipo: "string", max: 100, requerido: true },
    apellido_materno:   { tipo: "string", max: 100, requerido: false },
    direccion:          { tipo: "string", max: 255, requerido: false }
  }
};
