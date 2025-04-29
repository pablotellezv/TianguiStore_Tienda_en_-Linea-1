-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 29-04-2025 a las 12:54:45
-- Versión del servidor: 8.0.41
-- Versión de PHP: 8.2.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tienda_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `categoria_id` int NOT NULL,
  `nombre_categoria` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`categoria_id`, `nombre_categoria`, `descripcion`) VALUES
(1, 'Alimentos Típicos', 'Comidas tradicionales mexicanas.'),
(2, 'Bebidas Tradicionales', 'Bebidas artesanales y fermentadas.'),
(3, 'Servicios Empresariales', 'Consultorías y servicios especializados.'),
(4, 'Tecnología e Innovación', 'Productos y servicios de tecnología avanzada.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedido`
--

CREATE TABLE `detalle_pedido` (
  `detalle_id` int NOT NULL,
  `pedido_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados_pedido`
--

CREATE TABLE `estados_pedido` (
  `estado_id` int NOT NULL,
  `estado_nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `estados_pedido`
--

INSERT INTO `estados_pedido` (`estado_id`, `estado_nombre`, `descripcion`) VALUES
(1, 'pendiente', 'Pedido registrado pero no confirmado aún.'),
(2, 'confirmado', 'Pedido validado por el sistema o vendedor.'),
(3, 'pagado', 'Pedido que ha sido pagado.'),
(4, 'enviado', 'Pedido enviado hacia el cliente.'),
(5, 'entregado', 'Pedido entregado exitosamente.'),
(6, 'cancelado', 'Pedido cancelado antes de su procesamiento.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marcas`
--

CREATE TABLE `marcas` (
  `marca_id` int NOT NULL,
  `nombre_marca` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `logo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `micrositio_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `marcas`
--

INSERT INTO `marcas` (`marca_id`, `nombre_marca`, `descripcion`, `logo_url`, `micrositio_url`) VALUES
(1, 'Real de Plata', 'Productos tradicionales mineros.', '/imagenes/marcas/real_de_plata.png', '/marcas/real-de-plata'),
(2, 'IoT Creativo', 'Servicios y soluciones IoT.', '/imagenes/marcas/iot_creativo.png', '/marcas/iot-creativo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `pedido_id` int NOT NULL,
  `cliente_id` int NOT NULL,
  `vendedor_id` int DEFAULT NULL,
  `repartidor_id` int DEFAULT NULL,
  `estado_id` int NOT NULL,
  `fecha_pedido` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_entrega` datetime DEFAULT NULL,
  `notas` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `producto_id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `marca_id` int DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `descuento` decimal(5,2) DEFAULT '0.00',
  `stock` int DEFAULT '0',
  `categoria_id` int DEFAULT NULL,
  `imagen_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publicado` tinyint(1) DEFAULT '0',
  `proveedor_id` int DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('activo','inactivo','demo') COLLATE utf8mb4_unicode_ci DEFAULT 'activo',
  `meses_sin_intereses` tinyint(1) DEFAULT '0',
  `tipo_pago` enum('efectivo','crédito','débito','transferencia') COLLATE utf8mb4_unicode_ci DEFAULT 'efectivo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`producto_id`, `nombre`, `descripcion`, `marca_id`, `precio`, `descuento`, `stock`, `categoria_id`, `imagen_url`, `publicado`, `proveedor_id`, `fecha_creacion`, `created_at`, `updated_at`, `status`, `meses_sin_intereses`, `tipo_pago`) VALUES
(1, 'Pan de Nube de Real del Monte', 'Pan dulce típico de Real del Monte, conocido por su textura esponjosa y su corteza azucarada. Elaborado con receta tradicional minera, es una delicia que se disfruta mejor acompañado de café caliente en las mañanas frías de la sierra hidalguense.', 1, 12.00, 0.00, 50, 1, '/imagenes/productos/producto_tipico_pachuca_1.png', 1, NULL, '2025-04-29 03:14:00', '2025-04-29 09:14:00', '2025-04-29 10:38:07', 'activo', 0, 'efectivo'),
(2, 'Calavera de Barro Decorativa', 'Figura de calavera hecha de barro cocido y pintada a mano con colores vivos. Representa una fusión entre arte popular y tradición del Día de Muertos. Comúnmente usadas como decoración en altares durante las celebraciones de noviembre en Hidalgo.', 1, 60.00, 0.00, 45, 1, '/imagenes/productos/producto_tipico_pachuca_2.png', 1, NULL, '2025-04-29 03:14:00', '2025-04-29 09:14:00', '2025-04-29 10:38:07', 'activo', 0, 'efectivo'),
(3, 'Estuche Textil Tenango', 'Pequeño estuche de tela bordada con motivos tradicionales Tenango, originarios de la Sierra Otomí-Tepehua. Cada pieza es única y elaborada por artesanas locales que plasman flora, fauna y símbolos de la cosmovisión indígena hidalguense.', 1, 90.00, 0.00, 70, 1, '/imagenes/productos/producto_tipico_pachuca_3.png', 1, NULL, '2025-04-29 03:14:00', '2025-04-29 09:14:00', '2025-04-29 10:38:07', 'activo', 0, 'efectivo'),
(4, 'Taza Artesanal de Calavera', 'Taza de cerámica artesanal con diseño de calavera colorido inspirado en el arte de José Guadalupe Posada. Ideal para bebidas calientes, es un objeto que combina funcionalidad con identidad cultural mexicana.', 1, 85.00, 0.00, 80, 2, '/imagenes/productos/producto_tipico_pachuca_4.png', 1, NULL, '2025-04-29 03:14:00', '2025-04-29 09:14:00', '2025-04-29 10:38:07', 'activo', 0, 'efectivo'),
(5, 'Pastel de Tres Leches Hidalguense', 'Rebanada de pastel tradicional empapado en mezcla de tres tipos de leche (entera, evaporada y condensada). Suave, cremoso y coronado con azúcar glass, este postre es común en reuniones familiares y celebraciones en el estado.', 1, 35.00, 0.00, 40, 1, '/imagenes/productos/producto_tipico_pachuca_5.png', 1, NULL, '2025-04-29 03:14:00', '2025-04-29 09:14:00', '2025-04-29 10:38:07', 'activo', 0, 'efectivo'),
(6, 'Café de Alta Montaña de Zempoala', 'Granos de café arábica cultivados a más de 1300 msnm en la región boscosa del Parque Nacional El Chico. Con notas florales y cuerpo medio, este café artesanal representa el creciente cultivo orgánico hidalguense.', 1, 120.00, 0.00, 90, 1, '/imagenes/productos/producto_tipico_pachuca_6.png', 1, NULL, '2025-04-29 03:14:00', '2025-04-29 09:14:00', '2025-04-29 10:38:07', 'activo', 0, 'efectivo'),
(7, 'Jarrito de Barro para Pulque', 'Vasija tradicional elaborada en talleres de barro de Ixmiquilpan, utilizada para servir pulque fresco. Decorada con líneas rústicas negras, mantiene la temperatura del pulque y es símbolo de las cantinas rurales de Hidalgo.', 1, 45.00, 0.00, 50, 2, '/imagenes/productos/producto_tipico_pachuca_7.png', 1, NULL, '2025-04-29 03:14:00', '2025-04-29 09:14:00', '2025-04-29 10:38:07', 'activo', 0, 'efectivo'),
(8, 'Tacos de Chapulines con Tortilla Azul', 'Platillo exótico típico de Tulancingo, que combina tortillas de maíz azul hechas a mano con chapulines sazonados con ajo y limón. Fuente rica en proteínas, forma parte de la gastronomía prehispánica aún vigente en Hidalgo.', 2, 65.00, 0.00, 9999, 3, '/imagenes/productos/producto_tipico_pachuca_8.png', 1, NULL, '2025-04-29 03:14:00', '2025-04-29 09:14:00', '2025-04-29 10:38:07', 'activo', 1, 'crédito'),
(9, 'Barbacoa de Borrego con Salsa Verde', 'Costilla de borrego cocida al horno en penca de maguey y servida con salsa verde de molcajete. Plato icónico de las celebraciones dominicales en Actopan, cuna de la barbacoa tradicional hidalguense.', 2, 150.00, 0.00, 9999, 4, '/imagenes/productos/producto_tipico_pachuca_9.png', 1, NULL, '2025-04-29 03:14:00', '2025-04-29 09:14:00', '2025-04-29 10:38:07', 'activo', 1, 'crédito'),
(10, 'Flan Napolitano al Horno', 'Postre de origen colonial muy popular en Pachuca, elaborado con huevo, leche y caramelo natural. Su textura suave y sabor dulce lo convierten en un final perfecto para cualquier comida tradicional.', 2, 25.00, 0.00, 9999, 4, '/imagenes/productos/producto_tipico_pachuca_10.png', 1, NULL, '2025-04-29 03:14:00', '2025-04-29 09:14:00', '2025-04-29 10:38:07', 'activo', 1, 'crédito');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `rol_id` int NOT NULL,
  `rol_nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `permisos_json` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`rol_id`, `rol_nombre`, `descripcion`, `permisos_json`) VALUES
(1, 'admin', 'Administrador del sistema con control total.', '{\"roles\": {\"leer\": true, \"modificar\": true}, \"pedidos\": {\"leer\": true, \"crear\": true, \"cancelar\": true, \"eliminar\": true, \"entregar\": true, \"modificar\": true}, \"reportes\": {\"exportar\": true}, \"usuarios\": {\"leer\": true, \"crear\": true, \"eliminar\": true, \"modificar\": true}, \"productos\": {\"leer\": true, \"crear\": true, \"eliminar\": true, \"publicar\": true, \"modificar\": true}}'),
(2, 'contabilidad', 'Responsable de reportes y auditorías.', '{\"reportes\": {\"exportar\": true}, \"usuarios\": {\"leer\": true}}'),
(3, 'cliente', 'Cliente de la tienda, realiza compras.', '{\"pedidos\": {\"leer\": true, \"crear\": true, \"cancelar\": true}, \"productos\": {\"leer\": true}}'),
(4, 'vendedor', 'Gestor de ventas y productos.', '{\"pedidos\": {\"leer\": true, \"crear\": true}, \"productos\": {\"leer\": true, \"crear\": true, \"modificar\": true}}'),
(5, 'repartidor', 'Encargado de entregas.', '{\"pedidos\": {\"leer\": true, \"entregar\": true, \"modificar\": true}}'),
(6, 'soporte', 'Atención y resolución de incidencias.', '{\"pedidos\": {\"leer\": true, \"cancelar\": true, \"modificar\": true}, \"usuarios\": {\"leer\": true, \"modificar\": true}}'),
(7, 'analista', 'Acceso a reportes estadísticos.', '{\"reportes\": {\"exportar\": true}}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `usuario_id` int NOT NULL,
  `correo_electronico` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contrasena_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido_paterno` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apellido_materno` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` text COLLATE utf8mb4_unicode_ci,
  `foto_perfil_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `rol_id` int NOT NULL DEFAULT '3',
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`usuario_id`, `correo_electronico`, `contrasena_hash`, `nombre`, `apellido_paterno`, `apellido_materno`, `telefono`, `direccion`, `foto_perfil_url`, `activo`, `rol_id`, `fecha_registro`) VALUES
(1, 'admin@tienda.com', '$2b$10$lFgV.7nbt22bcYcuAcgST.BiTxmCBI.cvtqLOG.0g6YoQYPUf4zsK', 'Administrador', 'General', NULL, NULL, NULL, NULL, 1, 1, '2025-04-29 03:14:00'),
(2, 'cliente@tienda.com', '$2y$10$UloVDh3PV03QXVa9pBAygePf5K8rLjqNHeToRbUFw3PKvJgC1INkW', 'Cliente', 'Demo', NULL, NULL, NULL, NULL, 1, 3, '2025-04-29 03:14:00'),
(3, 'vendedor@tienda.com', '$2y$10$FwVYGyD69iKDNhHMeTLMjOLvYdZtdcRnQ80Eq3dljAGmv/Ig5Wh7a', 'Vendedor', 'Demo', NULL, NULL, NULL, NULL, 1, 4, '2025-04-29 03:14:00'),
(4, 'soporte@tienda.com', '$2y$10$t0jkN2g8JG8E.Fuw1tnnYemWf3rD05l4jOkUhlhKQwSbYJMCW/F9K', 'Soporte', 'Demo', NULL, NULL, NULL, NULL, 1, 6, '2025-04-29 03:14:00'),
(5, 'repartidor@tienda.com', '$2y$10$nGAZsZtCvHYJUFMEhBa/EeAfGvdSKSkB8k5n8VoKUCZ2Km53QGU2e', 'Repartidor', 'Demo', NULL, NULL, NULL, NULL, 1, 5, '2025-04-29 03:14:00');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`categoria_id`),
  ADD UNIQUE KEY `nombre_categoria` (`nombre_categoria`);

--
-- Indices de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD PRIMARY KEY (`detalle_id`),
  ADD KEY `pedido_id` (`pedido_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `estados_pedido`
--
ALTER TABLE `estados_pedido`
  ADD PRIMARY KEY (`estado_id`),
  ADD UNIQUE KEY `estado_nombre` (`estado_nombre`);

--
-- Indices de la tabla `marcas`
--
ALTER TABLE `marcas`
  ADD PRIMARY KEY (`marca_id`),
  ADD UNIQUE KEY `nombre_marca` (`nombre_marca`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`pedido_id`),
  ADD KEY `cliente_id` (`cliente_id`),
  ADD KEY `vendedor_id` (`vendedor_id`),
  ADD KEY `repartidor_id` (`repartidor_id`),
  ADD KEY `estado_id` (`estado_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`producto_id`),
  ADD KEY `marca_id` (`marca_id`),
  ADD KEY `categoria_id` (`categoria_id`),
  ADD KEY `proveedor_id` (`proveedor_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`rol_id`),
  ADD UNIQUE KEY `rol_nombre` (`rol_nombre`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`usuario_id`),
  ADD UNIQUE KEY `correo_electronico` (`correo_electronico`),
  ADD KEY `rol_id` (`rol_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `categoria_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  MODIFY `detalle_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estados_pedido`
--
ALTER TABLE `estados_pedido`
  MODIFY `estado_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `marcas`
--
ALTER TABLE `marcas`
  MODIFY `marca_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `pedido_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `producto_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `rol_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `usuario_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD CONSTRAINT `detalle_pedido_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`pedido_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_pedido_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`producto_id`) ON DELETE RESTRICT;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`vendedor_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pedidos_ibfk_3` FOREIGN KEY (`repartidor_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pedidos_ibfk_4` FOREIGN KEY (`estado_id`) REFERENCES `estados_pedido` (`estado_id`) ON DELETE RESTRICT;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`marca_id`) REFERENCES `marcas` (`marca_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`categoria_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `productos_ibfk_3` FOREIGN KEY (`proveedor_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`rol_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
