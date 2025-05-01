const validator = require("validator");

// 🎯 Definición de campos permitidos y reglas
const camposPermitidos = {
  correo_electronico: { tipo: "string", max: 120, validar: "isEmail" },
  contrasena: { tipo: "string", max: 100, validar: "isStrongPassword" },
  nombre: { tipo: "string", max: 100 },
  apellido_paterno: { tipo: "string", max: 100 },
  apellido_materno: { tipo: "string", max: 100 },
  direccion: { tipo: "string", max: 255 },

  nombre_producto: { tipo: "string", max: 100 },
  descripcion: { tipo: "string", max: 500 },
  precio: { tipo: "float", validar: "isFloat", opciones: { min: 0 } },
  descuento: { tipo: "float", validar: "isFloat", opciones: { min: 0, max: 100 } },
  stock: { tipo: "int", validar: "isInt", opciones: { min: 0 } },
  publicado: { tipo: "boolean" },
  categoria_id: { tipo: "int", validar: "isInt", opciones: { min: 1 } },
  marca_id: { tipo: "int", validar: "isInt", opciones: { min: 1 } },
  proveedor_id: { tipo: "int", validar: "isInt", opciones: { min: 1 } },
  tipo_pago: { tipo: "string", max: 30 },
  meses_sin_intereses: { tipo: "boolean" },
};

/**
 * 🧽 Sanitiza y valida un objeto plano (body, query o params)
 * @param {Object} obj
 * @returns {string[]} lista de errores encontrados
 */
function sanitizarYValidar(obj) {
  const errores = [];

  for (const campo in obj) {
    const valor = obj[campo];
    const config = camposPermitidos[campo];

    if (!config) {
      delete obj[campo];
      continue;
    }

    try {
      // 🔤 Cadenas de texto
      if (config.tipo === "string" && typeof valor === "string") {
        let limpio = validator.stripLow(validator.escape(valor.trim()));
        limpio = validator.whitelist(limpio, 'a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ@._\\-\\s');

        if (config.max && limpio.length > config.max) {
          limpio = limpio.slice(0, config.max);
        }

        if (config.validar === "isEmail" && !validator.isEmail(limpio)) {
          errores.push(`"${campo}" no es un correo electrónico válido.`);
        }

        if (config.validar === "isStrongPassword" &&
            !validator.isStrongPassword(limpio, { minLength: 8, minUppercase: 1, minNumbers: 1 })) {
          errores.push(`"${campo}" no es una contraseña segura.`);
        }

        obj[campo] = limpio;
      }

      // 🔢 Flotantes
      else if (config.tipo === "float") {
        const num = parseFloat(valor);
        if (isNaN(num) || !validator.isFloat(String(num), config.opciones)) {
          errores.push(`"${campo}" debe ser un número válido.`);
        } else {
          obj[campo] = num;
        }
      }

      // 🔢 Enteros
      else if (config.tipo === "int") {
        const entero = parseInt(valor);
        if (isNaN(entero) || !validator.isInt(String(entero), config.opciones)) {
          errores.push(`"${campo}" debe ser un número entero válido.`);
        } else {
          obj[campo] = entero;
        }
      }

      // ✅ Booleanos
      else if (config.tipo === "boolean") {
        if (typeof valor === "boolean") {
          obj[campo] = valor;
        } else if (valor === "true" || valor === "false") {
          obj[campo] = valor === "true";
        } else {
          errores.push(`"${campo}" debe ser booleano (true o false).`);
        }
      }

      // ❌ Tipo incorrecto
      else if (typeof valor !== config.tipo) {
        errores.push(`"${campo}" tiene un tipo incorrecto (se esperaba ${config.tipo}).`);
      }

    } catch (err) {
      errores.push(`Error procesando el campo "${campo}".`);
    }
  }

  return errores;
}

/**
 * 🛡️ Middleware Express para sanitizar y validar req.body, req.query y req.params
 */
module.exports = function sanitizeAndValidate(req, res, next) {
  try {
    const errores = [
      ...sanitizarYValidar(req.body),
      ...sanitizarYValidar(req.query),
      ...sanitizarYValidar(req.params),
    ];

    if (errores.length > 0) {
      return res.status(400).json({
        message: "Error en los datos enviados.",
        errores
      });
    }

    next();
  } catch (err) {
    console.error("❌ Error interno en sanitización:", err);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
