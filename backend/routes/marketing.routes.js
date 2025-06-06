const express = require("express");
const router = express.Router();
const marketingModel = require("../models/marketing.model");

// ✅ Ruta: Obtener promociones activas globales
router.get("/promociones", async (req, res) => {
  try {
    const promociones = await marketingModel.obtenerPromocionesActivas();
    res.status(200).json(promociones);
  } catch (error) {
    console.error("❌ Error al obtener promociones:", error);
    res.status(500).json({ mensaje: "Error al obtener promociones." });
  }
});

// ✅ Ruta: Obtener combos disponibles
router.get("/combos", async (req, res) => {
  try {
    const combos = await marketingModel.obtenerCombosDisponibles();
    res.status(200).json(combos);
  } catch (error) {
    console.error("❌ Error al obtener combos:", error);
    res.status(500).json({ mensaje: "Error al obtener combos." });
  }
});

// ✅ Ruta: Validar cupón
router.get("/cupon/:codigo", async (req, res) => {
  const { codigo } = req.params;
  try {
    const cupon = await marketingModel.validarCupon(codigo);
    if (!cupon) {
      return res.status(404).json({ mensaje: "Cupón no válido o expirado." });
    }
    res.status(200).json(cupon);
  } catch (error) {
    console.error("❌ Error al validar cupón:", error);
    res.status(500).json({ mensaje: "Error al validar el cupón." });
  }
});

module.exports = router;
