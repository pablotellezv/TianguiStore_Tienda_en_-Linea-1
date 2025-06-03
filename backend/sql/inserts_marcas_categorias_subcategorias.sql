-- Inserción de marcas
INSERT INTO marcas (marca_id, nombre_marca, slug_marca) VALUES
(1, 'Arduino', 'arduino'),
(2, 'Espressif', 'espressif'),
(3, 'Texas Instruments', 'texas-instruments'),
(4, 'Aosong', 'aosong'),
(5, 'Genérica', 'gen-rica'),
(6, 'Winsen', 'winsen'),
(7, 'Seeed Studio', 'seeed-studio'),
(8, 'Adafruit', 'adafruit'),
(9, 'SparkFun', 'sparkfun'),
(10, 'Heltec', 'heltec');

-- Inserción de categorías
INSERT INTO categorias (categoria_id, nombre_categoria) VALUES
(1, 'Sensores'),
(2, 'Microcontroladores'),
(3, 'Placas de Desarrollo'),
(4, 'Displays'),
(5, 'Componentes Pasivos'),
(6, 'Fuentes de Energía');

-- Inserción de subcategorías
INSERT INTO subcategorias (subcategoria_id, categoria_id, nombre_subcategoria) VALUES
(1, 1, 'Temperatura'),
(2, 1, 'Humedad'),
(3, 1, 'Movimiento'),
(4, 1, 'Luz'),
(5, 1, 'Gas'),
(6, 1, 'Proximidad'),
(7, 3, 'Arduino'),
(8, 3, 'ESP32'),
(9, 3, 'STM32'),
(10, 3, 'Raspberry Pi Pico');
