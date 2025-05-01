const pool = require("../db");

// 📌 Obtener TODAS las configuraciones
async function obtenerTodasConfiguraciones(req, res) {
  try {
    const [configuraciones] = await pool.query(`
      SELECT clave, valor_json, descripcion, tipo_dato, modificable, ultima_modificacion
      FROM configuracion_tienda
      ORDER BY clave ASC
    `);

    res.status(200).json(configuraciones);
  } catch (error) {
    console.error("❌ Error al obtener configuraciones:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

// 📌 Obtener una configuración específica
async function obtenerConfiguracionPorClave(req, res) {
  const { clave } = req.params;

  try {
    const [result] = await pool.query(
      `SELECT clave, valor_json, descripcion, tipo_dato, modificable
       FROM configuracion_tienda WHERE clave = ?`,
      [clave]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Configuración no encontrada." });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("❌ Error al obtener configuración:", error);
    res.status(500).json({ message: "Error al obtener configuración." });
  }
}

// 📌 Actualizar una configuración específica (validando tipo)
async function actualizarConfiguracion(req, res) {
  const { clave } = req.params;
  const nuevoValor = req.body.valor_json;

  if (typeof nuevoValor === "undefined") {
    return res.status(400).json({ message: "Se requiere el campo valor_json en el cuerpo." });
  }

  try {
    const [fila] = await pool.query(
      "SELECT tipo_dato, modificable FROM configuracion_tienda WHERE clave = ?",
      [clave]
    );

    if (fila.length === 0) {
      return res.status(404).json({ message: "Configuración no encontrada." });
    }

    const { tipo_dato, modificable } = fila[0];

    if (!modificable) {
      return res.status(403).json({ message: "Esta configuración no puede ser modificada desde el sistema." });
    }

    // Validación por tipo
    const esValido = validarTipoDato(nuevoValor, tipo_dato);
    if (!esValido) {
      return res.status(400).json({ message: `El valor proporcionado no coincide con el tipo declarado: ${tipo_dato}.` });
    }

    await pool.query(
      "UPDATE configuracion_tienda SET valor_json = ?, ultima_modificacion = NOW() WHERE clave = ?",
      [JSON.stringify(nuevoValor), clave]
    );

    res.status(200).json({ message: "Configuración actualizada correctamente." });
  } catch (error) {
    console.error("❌ Error al actualizar configuración:", error);
    res.status(500).json({ message: "Error interno al actualizar configuración." });
  }
}

// ✅ Valida el valor según su tipo declarado
function validarTipoDato(valor, tipo) {
  switch (tipo) {
    case "texto":
      return typeof valor === "string";

    case "numero":
      return typeof valor === "number" && isFinite(valor);

    case "booleano":
      return typeof valor === "boolean";

    case "lista":
      return Array.isArray(valor) && valor.every(v => typeof v === "string" || typeof v === "number");

    case "json":
      return typeof valor === "object" && valor !== null && !Array.isArray(valor);

    default:
      return false;
  }
}

module.exports = {
  obtenerTodasConfiguraciones,
  obtenerConfiguracionPorClave,
  actualizarConfiguracion
};
