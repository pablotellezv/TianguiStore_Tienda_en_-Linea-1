const { checkSchema } = require("express-validator");

module.exports = checkSchema({
  clave: {
    optional: true,
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage: "La clave debe tener entre 2 y 100 caracteres"
    },
    trim: true,
    escape: true
  }
});
