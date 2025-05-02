const db = require("../db/connection");

/* =============== CATEGORÍAS DE BLOG =============== */

/**
 * 📋 Obtener categorías activas del blog.
 */
async function obtenerCategoriasBlog() {
  const [rows] = await db.query(`
    SELECT * FROM blog_categorias
    WHERE estado = 'activa'
    ORDER BY nombre_categoria ASC
  `);
  return rows;
}

/**
 * ➕ Crear nueva categoría para el blog.
 */
async function crearCategoriaBlog({
  nombre_categoria,
  descripcion = "",
  slug_categoria,
  icono_url = null,
  estado = "activa"
}) {
  await db.query(`
    INSERT INTO blog_categorias (
      nombre_categoria, descripcion, slug_categoria, icono_url, estado, fecha_creacion
    ) VALUES (?, ?, ?, ?, ?, NOW())
  `, [
    nombre_categoria?.trim(),
    descripcion?.trim(),
    slug_categoria?.trim(),
    icono_url?.trim() || null,
    estado
  ]);
}

/* =============== ENTRADAS DE BLOG =============== */

/**
 * 📋 Obtener entradas publicadas, ordenadas por fecha.
 */
async function obtenerEntradasPublicadas() {
  const [rows] = await db.query(`
    SELECT eb.*, bc.nombre_categoria
    FROM entradas_blog eb
    LEFT JOIN blog_categorias bc ON eb.categoria_id = bc.categoria_id
    WHERE eb.estado = 'publicado'
    ORDER BY eb.fecha_publicacion DESC
  `);
  return rows;
}

/**
 * 🔍 Obtener entrada de blog por slug.
 */
async function obtenerEntradaPorSlug(slug) {
  const [rows] = await db.query(`
    SELECT eb.*, bc.nombre_categoria
    FROM entradas_blog eb
    LEFT JOIN blog_categorias bc ON eb.categoria_id = bc.categoria_id
    WHERE eb.slug = ?
  `, [slug?.trim()]);
  return rows[0] || null;
}

/**
 * ➕ Crear nueva entrada de blog.
 */
async function crearEntradaBlog({
  categoria_id = null,
  titulo,
  slug,
  contenido_largo,
  resumen = "",
  imagen_destacada = null,
  estado = "borrador",
  fecha_publicacion = null
}) {
  await db.query(`
    INSERT INTO entradas_blog (
      categoria_id, titulo, slug, contenido_largo,
      resumen, imagen_destacada, estado,
      fecha_publicacion, fecha_creacion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `, [
    categoria_id ? parseInt(categoria_id) : null,
    titulo?.trim(),
    slug?.trim(),
    contenido_largo?.trim(),
    resumen?.trim(),
    imagen_destacada?.trim() || null,
    estado,
    fecha_publicacion
  ]);
}

/**
 * ✏️ Actualizar entrada de blog por ID.
 */
async function actualizarEntradaBlog(id, datos) {
  const campos = [];
  const valores = [];

  for (const [clave, valor] of Object.entries(datos)) {
    if (valor !== undefined) {
      campos.push(`${clave} = ?`);
      valores.push(
        typeof valor === "string" ? valor.trim() : valor
      );
    }
  }

  if (campos.length === 0) return;

  valores.push(parseInt(id));
  const sql = `UPDATE entradas_blog SET ${campos.join(", ")} WHERE id = ?`;
  await db.query(sql, valores);
}

module.exports = {
  obtenerCategoriasBlog,
  crearCategoriaBlog,
  obtenerEntradasPublicadas,
  obtenerEntradaPorSlug,
  crearEntradaBlog,
  actualizarEntradaBlog
};
