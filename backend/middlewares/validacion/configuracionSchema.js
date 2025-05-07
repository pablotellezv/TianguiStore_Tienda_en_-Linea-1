const { checkSchema } = require("express-validator");

module.exports = checkSchema({
  clave: {
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage: "La clave debe tener entre 2 y 100 caracteres"
    },
    trim: true,
    escape: true
  },
  valor: {
    isLength: {
      options: { min: 1, max: 500 },
      errorMessage: "El valor debe tener entre 1 y 500 caracteres"
    },
    trim: true,
    escape: true
  }
});
