const configuracionModel = require("../models/configuracion.model");

/**
 * 📦 Obtener todas las configuraciones del sistema.
 */
async function obtenerTodasConfiguraciones(req, res) {
  try {
    const configuraciones = await configuracionModel.obtenerTodas();
    res.status(200).json(configuraciones);
  } catch (error) {
    console.error("❌ Error al obtener configuraciones:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

/**
 * 🔍 Obtener una configuración específica por clave.
 */
async function obtenerConfiguracionPorClave(req, res) {
  const { clave } = req.params;

  try {
    const config = await configuracionModel.buscarPorClave(clave);

    if (!config) {
      return res.status(404).json({ message: "Configuración no encontrada." });
    }

    res.status(200).json(config);
  } catch (error) {
    console.error("❌ Error al obtener configuración:", error);
    res.status(500).json({ message: "Error interno al obtener configuración." });
  }
}

/**
 * ✏️ Actualizar una configuración existente.
 */
async function actualizarConfiguracion(req, res) {
  const { clave } = req.params;
  const nuevoValor = req.body.valor_json;

  if (typeof nuevoValor === "undefined") {
    return res.status(400).json({ message: "Se requiere el campo 'valor_json' en el cuerpo." });
  }

  try {
    const config = await configuracionModel.buscarPorClave(clave);

    if (!config) {
      return res.status(404).json({ message: "Configuración no encontrada." });
    }

    if (!config.modificable) {
      return res.status(403).json({ message: "Esta configuración no puede modificarse." });
    }

    if (!validarTipoDato(nuevoValor, config.tipo_dato)) {
      return res.status(400).json({
        message: `El valor proporcionado no es válido para el tipo '${config.tipo_dato}'.`
      });
    }

    await configuracionModel.actualizarValor(clave, nuevoValor);
    res.status(200).json({ message: "Configuración actualizada correctamente." });
  } catch (error) {
    console.error("❌ Error al actualizar configuración:", error);
    res.status(500).json({ message: "Error interno al actualizar configuración." });
  }
}

/**
 * ✅ Valida el tipo de dato del valor que se desea guardar
 */
function validarTipoDato(valor, tipo) {
  switch (tipo) {
    case "texto": return typeof valor === "string";
    case "numero": return typeof valor === "number" && isFinite(valor);
    case "booleano": return typeof valor === "boolean";
    case "lista":
      return Array.isArray(valor) &&
        valor.every(v => typeof v === "string" || typeof v === "number");
    case "json":
      return typeof valor === "object" && valor !== null && !Array.isArray(valor);
    default: return false;
  }
}

module.exports = {
  obtenerTodasConfiguraciones,
  obtenerConfiguracionPorClave,
  actualizarConfiguracion
};
