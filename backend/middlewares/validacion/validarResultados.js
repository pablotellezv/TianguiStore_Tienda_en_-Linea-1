const { validationResult } = require("express-validator");

module.exports = function validarResultados(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      message: "Errores de validación",
      errores: errores.array()
    });
  }
  next();
};
