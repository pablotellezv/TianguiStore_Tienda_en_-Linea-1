
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS tienda_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tienda_db;

-- Tabla: estados de pedido
CREATE TABLE IF NOT EXISTS estados_pedido (
    estado_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador del estado del pedido',
    estado_nombre VARCHAR(50) NOT NULL UNIQUE COMMENT 'Nombre del estado (pendiente, confirmado, etc.)'
) ENGINE=InnoDB;

-- Insertar estados de pedido
INSERT IGNORE INTO estados_pedido (estado_nombre) VALUES
('pendiente'),
('confirmado'),
('pagado'),
('enviado'),
('entregado'),
('cancelado');

-- Tabla: roles
CREATE TABLE IF NOT EXISTS roles (
    rol_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único para cada rol de usuario',
    rol_nombre VARCHAR(50) NOT NULL UNIQUE COMMENT 'Nombre del rol (admin, vendedor, cliente, etc.)',
    descripcion TEXT COMMENT 'Descripción de las responsabilidades del rol',
    permisos_json JSON COMMENT 'Permisos en formato JSON'
) ENGINE=InnoDB;

-- Tabla: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    usuario_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID del usuario',
    correo_electronico VARCHAR(100) NOT NULL UNIQUE COMMENT 'Correo usado para iniciar sesión',
    contrasena_hash VARCHAR(255) NOT NULL COMMENT 'Hash seguro de la contraseña',
    nombre VARCHAR(50) NOT NULL COMMENT 'Nombre del usuario',
    apellido_paterno VARCHAR(50) COMMENT 'Apellido paterno del usuario',
    apellido_materno VARCHAR(50) COMMENT 'Apellido materno del usuario',
    telefono VARCHAR(20) COMMENT 'Número de teléfono',
    direccion TEXT COMMENT 'Dirección física del usuario',
    foto_perfil_url VARCHAR(255) COMMENT 'URL de la foto de perfil',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Indica si el usuario está activo',
    rol_id INT NOT NULL DEFAULT 7 COMMENT 'Rol asignado al usuario',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha en que se registró el usuario',
    FOREIGN KEY (rol_id) REFERENCES roles(rol_id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Tabla: marcas
CREATE TABLE IF NOT EXISTS marcas (
    marca_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID de la marca',
    nombre_marca VARCHAR(100) NOT NULL UNIQUE COMMENT 'Nombre de la marca del producto'
) ENGINE=InnoDB;

-- Tabla: categorías
CREATE TABLE IF NOT EXISTS categorias (
    categoria_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID de la categoría',
    nombre_categoria VARCHAR(100) NOT NULL UNIQUE COMMENT 'Nombre de la categoría del producto'
) ENGINE=InnoDB;

-- Tabla: productos
CREATE TABLE IF NOT EXISTS productos (
    producto_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único del producto',
    nombre VARCHAR(100) NOT NULL COMMENT 'Nombre del producto',
    descripcion TEXT COMMENT 'Descripción detallada del producto',
    marca_id INT COMMENT 'Marca asociada al producto',
    precio DECIMAL(10,2) NOT NULL COMMENT 'Precio de venta del producto',
    descuento DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Descuento en porcentaje (0-100)',
    stock INT DEFAULT 0 COMMENT 'Cantidad disponible en inventario',
    categoria_id INT COMMENT 'ID de la categoría del producto',
    imagen_url VARCHAR(255) COMMENT 'Ruta o URL de la imagen del producto',
    publicado BOOLEAN DEFAULT FALSE COMMENT 'Indica si el producto está disponible públicamente',
    proveedor_id INT COMMENT 'Usuario que proporciona el producto',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de registro del producto',
    FOREIGN KEY (marca_id) REFERENCES marcas(marca_id) ON DELETE SET NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias(categoria_id) ON DELETE SET NULL,
    FOREIGN KEY (proveedor_id) REFERENCES usuarios(usuario_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Tabla: pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    pedido_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID del pedido',
    cliente_id INT NOT NULL COMMENT 'Usuario que realiza la compra',
    vendedor_id INT COMMENT 'Usuario que registra el pedido (si aplica)',
    repartidor_id INT COMMENT 'Usuario asignado para entrega',
    estado_id INT NOT NULL COMMENT 'Estado actual del pedido',
    fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha en que se creó el pedido',
    fecha_entrega DATETIME COMMENT 'Fecha en que fue entregado',
    notas TEXT COMMENT 'Observaciones del pedido',
    FOREIGN KEY (cliente_id) REFERENCES usuarios(usuario_id) ON DELETE RESTRICT,
    FOREIGN KEY (vendedor_id) REFERENCES usuarios(usuario_id) ON DELETE SET NULL,
    FOREIGN KEY (repartidor_id) REFERENCES usuarios(usuario_id) ON DELETE SET NULL,
    FOREIGN KEY (estado_id) REFERENCES estados_pedido(estado_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Tabla: detalle_pedido (relación entre pedidos y productos)
CREATE TABLE IF NOT EXISTS detalle_pedido (
    detalle_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID del detalle del pedido',
    pedido_id INT NOT NULL COMMENT 'Pedido al que pertenece',
    producto_id INT NOT NULL COMMENT 'Producto vendido',
    cantidad INT NOT NULL COMMENT 'Cantidad del producto en el pedido',
    precio_unitario DECIMAL(10,2) NOT NULL COMMENT 'Precio del producto en el momento de la venta',
    FOREIGN KEY (pedido_id) REFERENCES pedidos(pedido_id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(producto_id) ON DELETE RESTRICT
) ENGINE=InnoDB;



-- Insertar 10 roles con permisos ajustados y descripciones claras
INSERT IGNORE INTO roles (rol_nombre, descripcion, permisos_json) VALUES
('admin', 'Administrador con control total sobre usuarios, productos, pedidos y reportes.', JSON_OBJECT(
    'usuarios', JSON_OBJECT('crear', true, 'leer', true, 'modificar', true, 'eliminar', true),
    'productos', JSON_OBJECT('crear', true, 'leer', true, 'modificar', true, 'eliminar', true, 'publicar', true),
    'pedidos', JSON_OBJECT('crear', true, 'leer', true, 'modificar', true, 'eliminar', true, 'cancelar', true, 'entregar', true),
    'roles', JSON_OBJECT('leer', true, 'modificar', true),
    'reportes', JSON_OBJECT('exportar', true)
)),
('gerente', 'Encargado de coordinación general sin privilegios destructivos.', JSON_OBJECT(
    'usuarios', JSON_OBJECT('leer', true, 'modificar', true),
    'productos', JSON_OBJECT('leer', true, 'modificar', true, 'publicar', true),
    'pedidos', JSON_OBJECT('leer', true, 'modificar', true),
    'reportes', JSON_OBJECT('exportar', true)
)),
('supervisor', 'Supervisor de calidad y procesos, con capacidad de validación y revisión.', JSON_OBJECT(
    'productos', JSON_OBJECT('leer', true, 'modificar', true, 'confirmar_eliminacion', true, 'publicar', true),
    'pedidos', JSON_OBJECT('leer', true, 'modificar', true),
    'usuarios', JSON_OBJECT('leer', true)
)),
('soporte', 'Atención a clientes, gestión de incidencias y soporte técnico.', JSON_OBJECT(
    'usuarios', JSON_OBJECT('leer', true, 'modificar', true),
    'pedidos', JSON_OBJECT('leer', true, 'modificar', true, 'cancelar', true)
)),
('vendedor', 'Responsable de ventas y manejo de productos y pedidos de clientes.', JSON_OBJECT(
    'productos', JSON_OBJECT('crear', true, 'leer', true, 'modificar', true),
    'pedidos', JSON_OBJECT('crear', true, 'leer', true, 'modificar', true, 'asignar_cliente', true)
)),
('proveedor', 'Proveedor externo que administra sus propios productos para validación.', JSON_OBJECT(
    'productos', JSON_OBJECT('crear', true, 'leer', true, 'modificar', true)
)),
('cliente', 'Usuario registrado que realiza compras y seguimiento de pedidos.', JSON_OBJECT(
    'productos', JSON_OBJECT('leer', true),
    'pedidos', JSON_OBJECT('crear', true, 'leer', true, 'cancelar', true),
    'usuarios', JSON_OBJECT('modificar', true)
)),
('repartidor', 'Encargado de entregar pedidos asignados y actualizar estado.', JSON_OBJECT(
    'pedidos', JSON_OBJECT('leer', true, 'modificar', true, 'entregar', true)
)),
('administrativo', 'Gestiona documentos, reportes y controles internos.', JSON_OBJECT(
    'reportes', JSON_OBJECT('exportar', true),
    'usuarios', JSON_OBJECT('leer', true),
    'pedidos', JSON_OBJECT('leer', true)
)),
('analista', 'Accede solo a la lectura de datos para análisis y reportes estadísticos.', JSON_OBJECT(
    'usuarios', JSON_OBJECT('leer', true),
    'productos', JSON_OBJECT('leer', true),
    'pedidos', JSON_OBJECT('leer', true),
    'reportes', JSON_OBJECT('exportar', true)
));
