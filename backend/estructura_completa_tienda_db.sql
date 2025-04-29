
-- ================================================================
-- 🎯 CREACIÓN Y CARGA COMPLETA EXTENDIDA DE tienda_db
-- ================================================================

DROP DATABASE IF EXISTS tienda_db;
CREATE DATABASE IF NOT EXISTS tienda_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tienda_db;

-- ================================================================
-- 📋 CREACIÓN DE TABLAS
-- ================================================================

-- Estados de Pedido
CREATE TABLE IF NOT EXISTS estados_pedido (
    estado_id INT AUTO_INCREMENT PRIMARY KEY,
    estado_nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT
) ENGINE=InnoDB;

-- Roles
CREATE TABLE IF NOT EXISTS roles (
    rol_id INT AUTO_INCREMENT PRIMARY KEY,
    rol_nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    permisos_json JSON
) ENGINE=InnoDB;

-- Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    usuario_id INT AUTO_INCREMENT PRIMARY KEY,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    contrasena_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido_paterno VARCHAR(50),
    apellido_materno VARCHAR(50),
    telefono VARCHAR(20),
    direccion TEXT,
    foto_perfil_url VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    rol_id INT NOT NULL DEFAULT 3,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(rol_id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Marcas
CREATE TABLE IF NOT EXISTS marcas (
    marca_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_marca VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    logo_url VARCHAR(255),
    micrositio_url VARCHAR(255)
) ENGINE=InnoDB;

-- Categorías
CREATE TABLE IF NOT EXISTS categorias (
    categoria_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
) ENGINE=InnoDB;

-- Productos
CREATE TABLE IF NOT EXISTS productos (
    producto_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    marca_id INT,
    precio DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(5,2) DEFAULT 0.00,
    stock INT DEFAULT 0,
    categoria_id INT,
    imagen_url VARCHAR(255),
    publicado BOOLEAN DEFAULT FALSE,
    proveedor_id INT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('activo', 'inactivo', 'demo') DEFAULT 'activo',
    meses_sin_intereses BOOLEAN DEFAULT FALSE,
    tipo_pago ENUM('efectivo', 'crédito', 'débito', 'transferencia') DEFAULT 'efectivo',
    FOREIGN KEY (marca_id) REFERENCES marcas(marca_id) ON DELETE SET NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias(categoria_id) ON DELETE SET NULL,
    FOREIGN KEY (proveedor_id) REFERENCES usuarios(usuario_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    pedido_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    vendedor_id INT,
    repartidor_id INT,
    estado_id INT NOT NULL,
    fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega DATETIME,
    notas TEXT,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(usuario_id) ON DELETE RESTRICT,
    FOREIGN KEY (vendedor_id) REFERENCES usuarios(usuario_id) ON DELETE SET NULL,
    FOREIGN KEY (repartidor_id) REFERENCES usuarios(usuario_id) ON DELETE SET NULL,
    FOREIGN KEY (estado_id) REFERENCES estados_pedido(estado_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Detalle de Pedido
CREATE TABLE IF NOT EXISTS detalle_pedido (
    detalle_id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(pedido_id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(producto_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ================================================================
-- 📋 INSERCIÓN DE DATOS BASE
-- ================================================================

-- Estados de Pedido
INSERT INTO estados_pedido (estado_nombre, descripcion) VALUES
('pendiente', 'Pedido registrado pero no confirmado aún.'),
('confirmado', 'Pedido validado por el sistema o vendedor.'),
('pagado', 'Pedido que ha sido pagado.'),
('enviado', 'Pedido enviado hacia el cliente.'),
('entregado', 'Pedido entregado exitosamente.'),
('cancelado', 'Pedido cancelado antes de su procesamiento.');

-- Roles
INSERT INTO roles (rol_nombre, descripcion, permisos_json) VALUES
('admin', 'Administrador del sistema con control total.', JSON_OBJECT('usuarios', JSON_OBJECT('crear', true, 'leer', true, 'modificar', true, 'eliminar', true),'productos', JSON_OBJECT('crear', true, 'leer', true, 'modificar', true, 'eliminar', true, 'publicar', true),'pedidos', JSON_OBJECT('crear', true, 'leer', true, 'modificar', true, 'eliminar', true, 'cancelar', true, 'entregar', true),'roles', JSON_OBJECT('leer', true, 'modificar', true),'reportes', JSON_OBJECT('exportar', true))),
('contabilidad', 'Responsable de reportes y auditorías.', JSON_OBJECT('usuarios', JSON_OBJECT('leer', true),'reportes', JSON_OBJECT('exportar', true))),
('cliente', 'Cliente de la tienda, realiza compras.', JSON_OBJECT('productos', JSON_OBJECT('leer', true),'pedidos', JSON_OBJECT('crear', true, 'leer', true, 'cancelar', true))),
('vendedor', 'Gestor de ventas y productos.', JSON_OBJECT('productos', JSON_OBJECT('crear', true, 'leer', true, 'modificar', true),'pedidos', JSON_OBJECT('crear', true, 'leer', true))),
('repartidor', 'Encargado de entregas.', JSON_OBJECT('pedidos', JSON_OBJECT('leer', true, 'modificar', true, 'entregar', true))),
('soporte', 'Atención y resolución de incidencias.', JSON_OBJECT('usuarios', JSON_OBJECT('leer', true, 'modificar', true),'pedidos', JSON_OBJECT('leer', true, 'modificar', true, 'cancelar', true))),
('analista', 'Acceso a reportes estadísticos.', JSON_OBJECT('reportes', JSON_OBJECT('exportar', true)));

-- Usuarios Ejemplo
INSERT INTO usuarios (correo_electronico, contrasena_hash, nombre, apellido_paterno, activo, rol_id) VALUES
('admin@tienda.com', '$2y$10$7GhXkLIXb0jJZG8jRLJwHe5EjI/okdYk2aUwVPQzOwKh.W8GVXUaa', 'Administrador', 'General', TRUE, 1),
('cliente@tienda.com', '$2y$10$7GhXkLIXb0jJZG8jRLJwHe5EjI/okdYk2aUwVPQzOwKh.W8GVXUaa', 'Cliente', 'Demo', TRUE, 3),
('vendedor@tienda.com', '$2y$10$7GhXkLIXb0jJZG8jRLJwHe5EjI/okdYk2aUwVPQzOwKh.W8GVXUaa', 'Vendedor', 'Demo', TRUE, 4),
('soporte@tienda.com', '$2y$10$7GhXkLIXb0jJZG8jRLJwHe5EjI/okdYk2aUwVPQzOwKh.W8GVXUaa', 'Soporte', 'Demo', TRUE, 6),
('repartidor@tienda.com', '$2y$10$7GhXkLIXb0jJZG8jRLJwHe5EjI/okdYk2aUwVPQzOwKh.W8GVXUaa', 'Repartidor', 'Demo', TRUE, 5);

-- Marcas
INSERT INTO marcas (nombre_marca, descripcion, logo_url, micrositio_url) VALUES
('Real de Plata', 'Productos tradicionales mineros.', '/imagenes/marcas/real_de_plata.png', '/marcas/real-de-plata'),
('IoT Creativo', 'Servicios y soluciones IoT.', '/imagenes/marcas/iot_creativo.png', '/marcas/iot-creativo');

-- Categorías
INSERT INTO categorias (nombre_categoria, descripcion) VALUES
('Alimentos Típicos', 'Comidas tradicionales mexicanas.'),
('Bebidas Tradicionales', 'Bebidas artesanales y fermentadas.'),
('Servicios Empresariales', 'Consultorías y servicios especializados.'),
('Tecnología e Innovación', 'Productos y servicios de tecnología avanzada.');

-- Productos y Servicios
INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria_id, marca_id, publicado, meses_sin_intereses, tipo_pago) VALUES
('Paste de Papa con Carne', 'Paste tradicional relleno de papa y carne.', 45.00, 50, '/imagenes/productos/paste_papa_carne.png', 1, 1, TRUE, FALSE, 'efectivo'),
('Paste de Piña Dulce', 'Paste dulce relleno de piña.', 38.00, 45, '/imagenes/productos/paste_pina.png', 1, 1, TRUE, FALSE, 'efectivo'),
('Café de Montaña', 'Café arábico de altura de Hidalgo.', 110.00, 70, '/imagenes/productos/cafe_montana_hidalgo.png', 1, 1, TRUE, FALSE, 'efectivo'),
('Pulque Natural', 'Pulque fresco y fermentado.', 35.00, 80, '/imagenes/productos/pulque_natural_apan.png', 2, 1, TRUE, FALSE, 'efectivo'),
('Pan de Muerto', 'Pan artesanal con esencia de azahar.', 65.00, 40, '/imagenes/productos/pan_muerto_artesanal.png', 1, 1, TRUE, FALSE, 'efectivo'),
('Gorditas de Nata', 'Gorditas tradicionales de nata.', 30.00, 90, '/imagenes/productos/gorditas_nata.png', 1, 1, TRUE, FALSE, 'efectivo'),
('Atole de Guayaba', 'Atole casero de guayaba.', 25.00, 50, '/imagenes/productos/atole_guayaba.png', 2, 1, TRUE, FALSE, 'efectivo'),
('Consultoría en Sistemas', 'Servicio profesional (5 días hábiles).', 15000.00, 9999, '/imagenes/servicios/consultoria_sistemas.png', 3, 2, TRUE, TRUE, 'crédito'),
('Consultoría en IoT', 'Diseño de soluciones IoT (7 días hábiles).', 23000.00, 9999, '/imagenes/servicios/consultoria_iot.png', 4, 2, TRUE, TRUE, 'crédito'),
('Asesoría en Ciberseguridad', 'Protección de sistemas IoT (3 días hábiles).', 17000.00, 9999, '/imagenes/servicios/ciberseguridad_iot.png', 4, 2, TRUE, TRUE, 'crédito');

