const pool = require("../db");

const obtenerMarcas = async (req, res) => {
  try {
    const [marcas] = await pool.query("SELECT marca_id, nombre_marca FROM marcas");
    res.json(marcas);
  } catch (error) {
    console.error("❌ Error al obtener marcas:", error);
    res.status(500).json({ message: "Error al obtener las marcas." });
  }
};

module.exports = { obtenerMarcas };
