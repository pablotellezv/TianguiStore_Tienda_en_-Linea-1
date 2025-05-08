const { checkSchema } = require("express-validator");

module.exports = checkSchema({
  clave: {
    optional: true, // Este campo es opcional
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage: "La clave debe tener entre 2 y 100 caracteres"
    },
    trim: true, // Elimina los espacios al principio y al final
    escape: true, // Escapa los caracteres HTML especiales
    matches: {
      options: [/^[a-zA-Z0-9-_]+$/], // Solo permite letras, números, guiones y guiones bajos
      errorMessage: "La clave solo puede contener letras, números, guiones y guiones bajos"
    }
  }
});
