// backend/middlewares/validacion/usuarioSchema.js
const { checkSchema } = require("express-validator");

const usuarioSchema = checkSchema({
  nombre: {
    notEmpty: {
      errorMessage: "El nombre es obligatorio"
    },
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage: "El nombre debe tener entre 2 y 100 caracteres"
    }
  },
  correo_electronico: {
    isEmail: {
      errorMessage: "Correo electrónico inválido"
    },
    notEmpty: {
      errorMessage: "El correo electrónico es obligatorio"
    }
  },
  contrasena: {
    isStrongPassword: {
      errorMessage: "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número"
    },
    notEmpty: {
      errorMessage: "La contraseña es obligatoria"
    }
  },
  apellido_paterno: {
    optional: true,
    isLength: {
      options: { max: 100 },
      errorMessage: "El apellido paterno no debe exceder los 100 caracteres"
    }
  },
  apellido_materno: {
    optional: true,
    isLength: {
      options: { max: 100 },
      errorMessage: "El apellido materno no debe exceder los 100 caracteres"
    }
  },
  direccion: {
    optional: true,
    isLength: {
      options: { max: 255 },
      errorMessage: "La dirección no debe exceder los 255 caracteres"
    }
  },
  telefono: {
    optional: true,
    isMobilePhone: {
      errorMessage: "El número de teléfono no es válido"
    }
  },
  tipo_usuario: {
    optional: true,
    isIn: {
      options: [["cliente", "admin", "soporte"]],
      errorMessage: "El tipo de usuario debe ser 'cliente', 'admin' o 'soporte'"
    }
  }
});

module.exports = { usuarioSchema };
