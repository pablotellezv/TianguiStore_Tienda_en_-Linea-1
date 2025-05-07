/**
 * 📁 MIDDLEWARE: uploadMiddleware.js
 * 📦 Manejo de archivos con multer: imágenes y modelos 3D
 *
 * ✅ Soporta:
 *   - Subida de imágenes (.jpeg, .png, .webp, etc.)
 *   - Subida de archivos 3D (.glb, .gltf, .obj, .stl, etc.)
 *
 * 🧩 Depende de:
 *   - multer (manejo de uploads)
 *   - path, fs (manejo de rutas)
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 📁 Rutas de almacenamiento
const rutaImagenes = path.join(__dirname, '..', 'public', 'uploads', 'imagenes');
const rutaModelos = path.join(__dirname, '..', 'public', 'uploads', 'modelos');

// 🔧 Crear carpetas si no existen
fs.mkdirSync(rutaImagenes, { recursive: true });
fs.mkdirSync(rutaModelos, { recursive: true });

// 📦 Configuración del almacenamiento en disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    switch (file.fieldname) {
      case 'imagenes':
        return cb(null, rutaImagenes);
      case 'modelo3d':
        return cb(null, rutaModelos);
      default:
        return cb(new Error(`Campo de archivo no permitido: ${file.fieldname}`));
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${timestamp}-${random}${extension}`);
  }
});

// 🎯 Validación de tipos MIME permitidos
const fileFilter = (req, file, cb) => {
  const mimeImagenes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const mimeModelos = [
    'model/gltf+json', 'model/gltf-binary',
    'application/octet-stream', // genérico (usado por .glb y .fbx)
    'model/obj', 'model/stl', 'model/fbx'
  ];

  if (file.fieldname === 'imagenes' && mimeImagenes.includes(file.mimetype)) {
    return cb(null, true);
  }

  if (file.fieldname === 'modelo3d') {
    // Puedes hacer validación más estricta aquí si lo deseas
    return cb(null, true);
  }

  return cb(new Error(`Tipo de archivo no permitido: ${file.originalname}`));
};

// 🚀 Middleware final de subida
const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15 MB por archivo
  },
  fileFilter
});

module.exports = upload;
