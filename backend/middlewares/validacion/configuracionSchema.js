const { checkSchema } = require("express-validator");

const configuracionSchema = checkSchema({
  minimo_monto_para_envio: {
    isFloat: {
      options: { min: 0 },
      errorMessage: "El monto mínimo para envío debe ser un número positivo"
    }
  },
  habilitar_cupones: {
    isBoolean: { errorMessage: "Debe ser verdadero o falso (habilitar_cupones)" }
  },
  longitud_minima_contrasena: {
    isInt: {
      options: { min: 6 },
      errorMessage: "La longitud mínima de la contraseña debe ser al menos 6 caracteres"
    }
  },
  moneda_predeterminada: {
    isIn: {
      options: [["MXN", "USD", "EUR"]],
      errorMessage: "La moneda debe ser una de: MXN, USD, EUR"
    }
  },
  zona_horaria: {
    isString: { errorMessage: "La zona horaria debe ser un texto" },
    isLength: {
      options: { min: 3, max: 64 },
      errorMessage: "La zona horaria debe tener entre 3 y 64 caracteres"
    }
  },
  dias_operacion: {
    isArray: {
      options: { min: 1 },
      errorMessage: "Los días de operación deben enviarse como arreglo"
    }
  },
  "dias_operacion.*": {
    isIn: {
      options: [["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]],
      errorMessage: "Día inválido. Solo se permiten días válidos de la semana"
    }
  },
  mostrar_stock_publico: {
    isBoolean: { errorMessage: "Debe indicar si se muestra el stock al público (true/false)" }
  },
  tiempo_sesion_min: {
    isInt: {
      options: { min: 5 },
      errorMessage: "El tiempo de sesión debe ser de al menos 5 minutos"
    }
  },
  version_actual_frontend: {
    isString: { errorMessage: "La versión del frontend debe ser una cadena" },
    isLength: {
      options: { min: 1, max: 30 },
      errorMessage: "La versión debe tener entre 1 y 30 caracteres"
    },
    trim: true
  }
});

module.exports = { configuracionSchema };
