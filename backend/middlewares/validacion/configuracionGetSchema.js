const { checkSchema } = require("express-validator");

const configuracionGetSchema = checkSchema({
  clave: {
    optional: true,
    isString: { errorMessage: "La clave debe ser texto" },
    trim: true,
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage: "La clave debe tener entre 2 y 100 caracteres"
    }
  },
  grupo: {
    optional: true,
    isIn: {
      options: [["general", "pago", "visual", "seguridad", "operacion"]],
      errorMessage: "Grupo inválido. Usa: general, pago, visual, seguridad u operacion"
    }
  },
  tipo: {
    optional: true,
    isIn: {
      options: [["boolean", "string", "number", "json", "array"]],
      errorMessage: "Tipo inválido. Usa: boolean, string, number, json o array"
    }
  },
  solo_activos: {
    optional: true,
    isBoolean: { errorMessage: "Debe ser verdadero o falso (solo_activos)" }
  }
});

module.exports = { configuracionGetSchema };
