// backend/middlewares/validacion/configuracionSchema.js
const { body, query } = require('express-validator');

// Validación de 'configuracionSchema' para los campos 'clave' y 'valor'
const configuracionSchema = [
  // Validación para 'clave'
  body('clave')
    .isString().withMessage('La clave debe ser una cadena de texto')
    .notEmpty().withMessage('La clave es obligatoria')
    .isLength({ min: 2, max: 100 }).withMessage('La clave debe tener entre 2 y 100 caracteres')
    .trim()
    .escape()
    .matches(/^[a-zA-Z0-9-_]+$/).withMessage('La clave solo puede contener letras, números, guiones y guiones bajos'),
  
  // Validación para 'valor'
  body('valor')
    .isString().withMessage('El valor debe ser una cadena de texto')
    .notEmpty().withMessage('El valor es obligatorio')
    .isLength({ min: 1, max: 500 }).withMessage('El valor debe tener entre 1 y 500 caracteres')
    .trim()
    .escape()
    .matches(/^[a-zA-Z0-9\s,.\-_\(\)\[\]\{\}:;]+$/).withMessage('El valor solo puede contener letras, números y caracteres especiales como: , . - _ ( ) [ ] { } : ;')
];

// Validación para 'configuracionGetSchema' con parámetros opcionales
const configuracionGetSchema = [
  // Validación opcional para 'limit'
  query('limit')
    .optional()
    .isInt({ min: 1 }).withMessage('El límite debe ser un número entero mayor o igual que 1'),
  
  // Validación opcional para 'offset'
  query('offset')
    .optional()
    .isInt({ min: 0 }).withMessage('El offset debe ser un número entero mayor o igual que 0'),
  
  // Validación opcional para un filtro (por ejemplo, búsqueda por nombre)
  query('filtro')
    .optional()
    .isString().withMessage('El filtro debe ser una cadena de texto')
    .trim()
    .escape()
];

module.exports = { configuracionSchema, configuracionGetSchema };
