const pool = require("../db");

const obtenerUsuarios = async (req, res) => {
  try {
    const [usuarios] = await pool.query(
      "SELECT usuario_id, nombre, correo_electronico, rol FROM usuarios"
    );
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  obtenerUsuarios,
};
