/**
 * 📁 MIDDLEWARE: uploadMiddleware.js
 * 🛡 Manejo de archivos sin multer (más seguro)
 * ✅ Soporta:
 *   - Subida de imágenes (.jpeg, .png, .webp, etc.)
 *   - Subida de archivos 3D (.glb, .gltf, .obj, .stl, etc.)
 * 📌 Usa: express, fs, path, busboy
 */

const fs = require('fs');
const path = require('path');
const Busboy = require('busboy');

// 📁 Directorios de destino
const rutaImagenes = path.join(__dirname, '..', 'public', 'uploads', 'imagenes');
const rutaModelos = path.join(__dirname, '..', 'public', 'uploads', 'modelos');

// 🛠 Crear carpetas si no existen
fs.mkdirSync(rutaImagenes, { recursive: true });
fs.mkdirSync(rutaModelos, { recursive: true });

// 🎯 Tipos MIME permitidos
const mimePermitidos = {
  imagenes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  modelo3d: [
    'model/gltf+json', 'model/gltf-binary',
    'application/octet-stream', 'model/obj', 'model/stl', 'model/fbx'
  ]
};

// 🚀 Middleware robusto
const uploadMiddleware = (req, res, next) => {
  if (req.method !== 'POST' && req.method !== 'PUT') return next();

  const busboy = new Busboy({
    headers: req.headers,
    limits: { fileSize: 15 * 1024 * 1024 }, // ⛔ Máx. 15 MB por archivo
  });

  req.archivosSubidos = {};
  const archivosTemp = []; // Para limpiar si algo falla

  let errorYaEnviado = false;

  // 📦 Al recibir archivo
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    // 🧪 Validar tipo MIME
    const esImagen = fieldname === 'imagenes' && mimePermitidos.imagenes.includes(mimetype);
    const esModelo = fieldname === 'modelo3d' && mimePermitidos.modelo3d.includes(mimetype);

    if (!esImagen && !esModelo) {
      file.resume(); // ❌ Rechazar archivo
      console.warn(`Archivo rechazado (${fieldname} - ${mimetype})`);
      return;
    }

    // 🚫 No permitir más de 1 archivo por campo
    if (req.archivosSubidos[fieldname]) {
      file.resume();
      if (!errorYaEnviado) {
        errorYaEnviado = true;
        return res.status(400).json({ error: `Solo se permite un archivo por campo: ${fieldname}` });
      }
      return;
    }

    const destino = esImagen ? rutaImagenes : rutaModelos;
    const nombreSeguro = `${fieldname}-${Date.now()}-${Math.floor(Math.random() * 1e9)}${path.extname(filename)}`;
    const rutaFinal = path.join(destino, nombreSeguro);
    const writeStream = fs.createWriteStream(rutaFinal);

    // Guardar temporalmente por si ocurre error
    archivosTemp.push(rutaFinal);

    file.pipe(writeStream);
    req.archivosSubidos[fieldname] = nombreSeguro;

    // 🔒 Manejo de errores de escritura
    writeStream.on('error', (err) => {
      console.error('❌ Error al guardar archivo:', err);
      if (!errorYaEnviado) {
        errorYaEnviado = true;
        return res.status(500).json({ error: 'Error al guardar archivo en disco.' });
      }
    });
  });

  // ✔ Finalizó todo correctamente
  busboy.on('finish', () => {
    if (!errorYaEnviado) next();
  });

  // ❌ Error global
  busboy.on('error', (err) => {
    console.error('❌ Error en busboy:', err);
    limpiarArchivos(archivosTemp);
    if (!errorYaEnviado) {
      errorYaEnviado = true;
      return res.status(500).json({ error: 'Error al procesar la carga de archivos.' });
    }
  });

  req.pipe(busboy);
};

// 🧹 Limpieza de archivos si hay errores
function limpiarArchivos(rutas) {
  for (const archivo of rutas) {
    fs.unlink(archivo, (err) => {
      if (err) console.warn(`⚠ No se pudo eliminar archivo temporal: ${archivo}`);
    });
  }
}

module.exports = uploadMiddleware;
