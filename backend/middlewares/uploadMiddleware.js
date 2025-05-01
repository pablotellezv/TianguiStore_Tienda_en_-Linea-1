const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 📁 Rutas de almacenamiento
const rutaImagenes = path.join(__dirname, '..', 'public', 'uploads', 'imagenes');
const rutaModelos = path.join(__dirname, '..', 'public', 'uploads', 'modelos');

// 🔧 Crear carpetas si no existen
fs.mkdirSync(rutaImagenes, { recursive: true });
fs.mkdirSync(rutaModelos, { recursive: true });

// 📦 Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'imagenes') return cb(null, rutaImagenes);
    if (file.fieldname === 'modelo3d') return cb(null, rutaModelos);
    return cb(new Error(`Campo de archivo no permitido: ${file.fieldname}`));
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${timestamp}-${random}${ext}`);
  }
});

// 🎯 Validación de tipos MIME
const fileFilter = (req, file, cb) => {
  const validImages = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const validModelTypes = [
    'model/gltf+json', 'model/gltf-binary', // .gltf y .glb
    'application/octet-stream',             // genérico
    'model/obj', 'model/stl', 'model/fbx'   // opcional: si tu visor 3D los soporta
  ];

  if (file.fieldname === 'imagenes' && validImages.includes(file.mimetype)) {
    return cb(null, true);
  }

  if (file.fieldname === 'modelo3d') {
    return cb(null, true); // puedes reforzar si lo deseas con mimetype
  }

  return cb(new Error(`Tipo de archivo no permitido: ${file.originalname}`));
};

// 🚀 Middleware final
const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // hasta 15MB por archivo
  },
  fileFilter
});

module.exports = upload;
