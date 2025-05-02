const db = require("../db/connection");

/* =============== COMENTARIOS DE BLOG =============== */

/**
 * 📋 Obtener comentarios aprobados por entrada.
 */
async function obtenerComentariosBlog(entrada_id) {
  const [rows] = await db.query(`
    SELECT * FROM blog_comentarios
    WHERE entrada_id = ? AND estado = 'aprobado'
    ORDER BY fecha ASC
  `, [parseInt(entrada_id)]);
  return rows;
}

/**
 * ➕ Registrar nuevo comentario en blog.
 */
async function registrarComentarioBlog({
  entrada_id,
  autor_nombre,
  comentario,
  usuario_id = null
}) {
  await db.query(`
    INSERT INTO blog_comentarios (
      entrada_id, usuario_id, autor_nombre, comentario, estado, fecha
    ) VALUES (?, ?, ?, ?, 'pendiente', NOW())
  `, [
    parseInt(entrada_id),
    usuario_id ? parseInt(usuario_id) : null,
    autor_nombre?.trim(),
    comentario?.trim()
  ]);
}

/**
 * ✏️ Aprobar o rechazar un comentario (admin).
 */
async function actualizarEstadoComentario(comentario_id, estado) {
  await db.query(`
    UPDATE blog_comentarios SET estado = ? WHERE comentario_id = ?
  `, [estado, parseInt(comentario_id)]);
}

/* =============== VALORACIONES DE PRODUCTOS =============== */

/**
 * 📋 Obtener valoraciones visibles de un producto.
 */
async function obtenerValoracionesProducto(producto_id) {
  const [rows] = await db.query(`
    SELECT v.*, u.nombre AS nombre_usuario
    FROM valoraciones v
    JOIN usuarios u ON v.usuario_id = u.usuario_id
    WHERE v.producto_id = ? AND v.estado = 'visible'
    ORDER BY v.fecha DESC
  `, [parseInt(producto_id)]);
  return rows;
}

/**
 * ➕ Registrar o actualizar una valoración.
 */
async function registrarValoracion({
  producto_id,
  usuario_id,
  calificacion,
  comentario = ""
}) {
  await db.query(`
    INSERT INTO valoraciones (
      producto_id, usuario_id, calificacion, comentario, fecha, estado
    ) VALUES (?, ?, ?, ?, NOW(), 'visible')
    ON DUPLICATE KEY UPDATE 
      calificacion = VALUES(calificacion),
      comentario = VALUES(comentario),
      fecha = NOW(),
      estado = 'visible'
  `, [
    parseInt(producto_id),
    parseInt(usuario_id),
    parseInt(calificacion),
    comentario?.trim()
  ]);
}

/**
 * ✏️ Ocultar valoración (moderación).
 */
async function ocultarValoracion(valoracion_id) {
  await db.query(`
    UPDATE valoraciones SET estado = 'oculto' WHERE valoracion_id = ?
  `, [parseInt(valoracion_id)]);
}

module.exports = {
  // Comentarios blog
  obtenerComentariosBlog,
  registrarComentarioBlog,
  actualizarEstadoComentario,
  // Valoraciones producto
  obtenerValoracionesProducto,
  registrarValoracion,
  ocultarValoracion
};
