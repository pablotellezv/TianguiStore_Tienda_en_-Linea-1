// utils/validacion/schemas.js

module.exports = {
    producto: {
      nombre: { tipo: "string", max: 100 },
      descripcion: { tipo: "string", max: 500 },
      precio: { tipo: "float", validar: "isFloat", opciones: { min: 0 } },
      descuento: { tipo: "float", validar: "isFloat", opciones: { min: 0, max: 100 } },
      stock: { tipo: "int", validar: "isInt", opciones: { min: 0 } },
      publicado: { tipo: "boolean" },
      categoria_id: { tipo: "int", validar: "isInt" },
      marca_id: { tipo: "int", validar: "isInt" },
      proveedor_id: { tipo: "int", validar: "isInt" },
      tipo_pago: { tipo: "string", max: 30 },
      meses_sin_intereses: { tipo: "boolean" }
    },
    usuario: {
      correo_electronico: { tipo: "string", max: 120, validar: "isEmail" },
      contrasena: { tipo: "string", max: 100, validar: "isStrongPassword" },
      nombre: { tipo: "string", max: 100 },
      apellido_paterno: { tipo: "string", max: 100 },
      apellido_materno: { tipo: "string", max: 100 },
      direccion: { tipo: "string", max: 255 }
    }
  };
  