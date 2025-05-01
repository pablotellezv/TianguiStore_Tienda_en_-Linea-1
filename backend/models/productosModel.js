const db = require("../db");

/**
 * 📦 Obtener todos los productos publicados (con marca y categoría)
 */
exports.obtenerPublicados = () => {
  return db.query(`
    SELECT p.*, m.nombre_marca, c.nombre_categoria
    FROM productos p
    LEFT JOIN marcas m ON p.marca_id = m.marca_id
    LEFT JOIN categorias c ON p.categoria_id = c.categoria_id
    WHERE p.publicado = TRUE
  `);
};

/**
 * 🔍 Obtener un producto por su ID
 * @param {number} id
 */
exports.obtenerPorId = (id) => {
  return db.query("SELECT * FROM productos WHERE producto_id = ?", [parseInt(id)]);
};

/**
 * ➕ Insertar un nuevo producto
 * @param {Object} datos
 */
exports.insertar = (datos) => {
  const {
    nombre,
    descripcion,
    precio,
    stock,
    categoria_id,
    marca_id,
    tipo_pago = "efectivo",
    publicado = false,
    meses_sin_intereses = false,
    proveedor_id = null,
    imagen_url = null
  } = datos;

  return db.query(
    `INSERT INTO productos 
     (nombre, descripcion, precio, stock, categoria_id, marca_id, tipo_pago, publicado, meses_sin_intereses, proveedor_id, imagen_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nombre?.trim(),
      descripcion?.trim() || null,
      parseFloat(precio),
      parseInt(stock ?? 0),
      parseInt(categoria_id),
      parseInt(marca_id) || null,
      tipo_pago,
      publicado === true,
      meses_sin_intereses === true,
      proveedor_id || null,
      imagen_url?.trim() || null
    ]
  );
};

/**
 * ✏️ Actualizar producto existente por ID
 * @param {number} id
 * @param {Object} datos
 */
exports.actualizar = (id, datos) => {
  const {
    nombre,
    descripcion,
    precio,
    stock,
    categoria_id,
    marca_id,
    tipo_pago = "efectivo",
    publicado = false,
    meses_sin_intereses = false,
    imagen_url = null
  } = datos;

  return db.query(
    `UPDATE productos SET 
      nombre = ?, descripcion = ?, precio = ?, stock = ?, 
      categoria_id = ?, marca_id = ?, tipo_pago = ?, 
      publicado = ?, meses_sin_intereses = ?, imagen_url = ?
     WHERE producto_id = ?`,
    [
      nombre?.trim(),
      descripcion?.trim() || null,
      parseFloat(precio),
      parseInt(stock ?? 0),
      parseInt(categoria_id),
      parseInt(marca_id) || null,
      tipo_pago,
      publicado === true,
      meses_sin_intereses === true,
      imagen_url?.trim() || null,
      parseInt(id)
    ]
  );
};

/**
 * 🗑️ Eliminar un producto por ID
 * @param {number} id
 */
exports.eliminar = (id) => {
  return db.query("DELETE FROM productos WHERE producto_id = ?", [parseInt(id)]);
};
