const { validationResult } = require("express-validator");

/**
 * 📥 Middleware de validación avanzada
 * Agrupa errores por origen: body, query, params, etc.
 * @returns {Function} Express middleware
 */
const validarResultados = (req, res, next) => {
  const errores = validationResult(req);

  if (errores.isEmpty()) {
    return next();
  }

  const erroresAgrupados = {};

  errores.array().forEach(err => {
    const origen = err.location;
    if (!erroresAgrupados[origen]) {
      erroresAgrupados[origen] = [];
    }
    erroresAgrupados[origen].push({
      campo: err.param,
      mensaje: err.msg
    });
  });

  return res.status(422).json({
    mensaje: "Error de validación en los datos enviados",
    errores: erroresAgrupados
  });
};

module.exports = validarResultados;
