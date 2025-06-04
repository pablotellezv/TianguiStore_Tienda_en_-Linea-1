INSERT INTO galeria_productos (producto_id, tipo, url, alt_text, orden_visual, destacada) VALUES
(1, 'imagen', 'https://tianguistore.com/img/productos/p1_img1.webp', 'Imagen 1 del producto 1', 0, TRUE),
(1, 'imagen', 'https://tianguistore.com/img/productos/p1_img2.webp', 'Imagen 2 del producto 1', 1, FALSE),
(2, 'imagen', 'https://tianguistore.com/img/productos/p2_img1.webp', 'Imagen 1 del producto 2', 0, TRUE),
(2, 'imagen', 'https://tianguistore.com/img/productos/p2_img2.webp', 'Imagen 2 del producto 2', 1, FALSE),
(3, 'imagen', 'https://tianguistore.com/img/productos/p3_img1.webp', 'Imagen 1 del producto 3', 0, TRUE),
(3, 'imagen', 'https://tianguistore.com/img/productos/p3_img2.webp', 'Imagen 2 del producto 3', 1, FALSE),
(4, 'imagen', 'https://tianguistore.com/img/productos/p4_img1.webp', 'Imagen 1 del producto 4', 0, TRUE),
(4, 'imagen', 'https://tianguistore.com/img/productos/p4_img2.webp', 'Imagen 2 del producto 4', 1, FALSE),
(5, 'imagen', 'https://tianguistore.com/img/productos/p5_img1.webp', 'Imagen 1 del producto 5', 0, TRUE),
(5, 'imagen', 'https://tianguistore.com/img/productos/p5_img2.webp', 'Imagen 2 del producto 5', 1, FALSE),
(6, 'imagen', 'https://tianguistore.com/img/productos/p6_img1.webp', 'Imagen 1 del producto 6', 0, TRUE),
(6, 'imagen', 'https://tianguistore.com/img/productos/p6_img2.webp', 'Imagen 2 del producto 6', 1, FALSE),
(7, 'imagen', 'https://tianguistore.com/img/productos/p7_img1.webp', 'Imagen 1 del producto 7', 0, TRUE),
(7, 'imagen', 'https://tianguistore.com/img/productos/p7_img2.webp', 'Imagen 2 del producto 7', 1, FALSE),
(8, 'imagen', 'https://tianguistore.com/img/productos/p8_img1.webp', 'Imagen 1 del producto 8', 0, TRUE),
(8, 'imagen', 'https://tianguistore.com/img/productos/p8_img2.webp', 'Imagen 2 del producto 8', 1, FALSE),
(9, 'imagen', 'https://tianguistore.com/img/productos/p9_img1.webp', 'Imagen 1 del producto 9', 0, TRUE),
(9, 'imagen', 'https://tianguistore.com/img/productos/p9_img2.webp', 'Imagen 2 del producto 9', 1, FALSE),
(10, 'imagen', 'https://tianguistore.com/img/productos/p10_img1.webp', 'Imagen 1 del producto 10', 0, TRUE),
(10, 'imagen', 'https://tianguistore.com/img/productos/p10_img2.webp', 'Imagen 2 del producto 10', 1, FALSE);


INSERT INTO inventario_productos (producto_id, almacen_id, cantidad, stock_minimo) VALUES
(1, 1, 65, 5),
(1, 2, 64, 5),
(2, 1, 44, 5),
(2, 2, 22, 5),
(3, 1, 64, 5),
(3, 2, 76, 5),
(4, 1, 53, 5),
(4, 2, 78, 5),
(5, 1, 70, 5),
(5, 2, 45, 5),
(6, 1, 11, 5),
(6, 2, 79, 5),
(7, 1, 32, 5),
(7, 2, 25, 5),
(8, 1, 79, 5),
(8, 2, 64, 5),
(9, 1, 19, 5),
(9, 2, 59, 5),
(10, 1, 12, 5),
(10, 2, 73, 5);

INSERT INTO producto_atributo_valor (producto_id, atributo_id, valor_texto) VALUES
(1, 1, 'ATmega328P'),
(1, 2, '5V'),
(2, 3, '0–600V'),
(2, 4, '20MΩ'),
(3, 5, '3–7 m'),
(3, 6, '3–5V'),
(4, 7, 'ATmega328P'),
(4, 8, '5V'),
(5, 9, 'sin soldadura'),
(5, 10, '830'),
(6, 11, '3–7 m'),
(6, 12, '3–5V'),
(7, 13, 'I2C'),
(7, 14, '0x27'),
(8, 15, '12V 2A'),
(8, 16, '110–240V AC'),
(9, 17, '10A 250VAC'),
(9, 18, 'digital TTL'),
(10, 19, '3–7 m'),
(10, 20, '3–5V');

INSERT INTO precios_por_volumen (producto_id, cantidad_minima, precio_unitario) VALUES
(1, 5, 301.32),
(1, 10, 332.41),
(1, 25, 292.86),
(2, 5, 268.36),
(2, 10, 386.11),
(2, 25, 306.77),
(3, 5, 80.45),
(3, 10, 92.03),
(3, 25, 87.88),
(4, 5, 271.85),
(4, 10, 248.38),
(4, 25, 272.45),
(5, 5, 222.71),
(5, 10, 213.31),
(5, 25, 200.39),
(6, 5, 41.23),
(6, 10, 44.35),
(6, 25, 41.17),
(7, 5, 128.86),
(7, 10, 134.70),
(7, 25, 127.08),
(8, 5, 279.33),
(8, 10, 261.33),
(8, 25, 283.13),
(9, 5, 102.43),
(9, 10, 96.49),
(9, 25, 100.61),
(10, 5, 43.14),
(10, 10, 47.92),
(10, 25, 46.31);

INSERT INTO atributos_dinamicos (
  atributo_id, nombre_atributo, slug_atributo, tipo_valor, unidad_medida, categoria_id, subcategoria_id
) VALUES
-- 🧠 Subcategoría: Microcontroladores (ID = 1)
(1, 'Microcontrolador', 'microcontrolador', 'texto', NULL, 1, 1),
(2, 'Voltaje de operación', 'voltaje', 'texto', 'V', 1, 1),

-- 🔍 Subcategoría: Herramientas de medición (ID = 2)
(3, 'Rango de voltaje', 'rango_voltaje', 'texto', 'V', 1, 2),
(4, 'Resistencia máxima', 'resistencia_max', 'texto', 'Ω', 1, 2),

-- 🌡️ Subcategoría: Sensores (ID = 3)
(5, 'Rango de detección', 'rango_deteccion', 'texto', 'm', 1, 3),
(6, 'Voltaje de alimentación', 'alimentacion', 'texto', 'V', 1, 3),

-- 🧪 Subcategoría: Accesorios (Protoboard) (ID = 4)
(7, 'Tipo de protoboard', 'tipo', 'texto', NULL, 1, 4),
(8, 'Número de puntos', 'puntos', 'numero', NULL, 1, 4),

-- 📺 Subcategoría: Visualización (LCD) (ID = 5)
(9, 'Tipo de interfaz', 'tipo_interfaz', 'texto', NULL, 1, 5),
(10, 'Dirección I2C', 'direccion', 'texto', NULL, 1, 5),

-- 🔌 Subcategoría: Alimentación (ID = 6)
(11, 'Salida', 'salida', 'texto', 'V/A', 1, 6),
(12, 'Entrada', 'entrada', 'texto', 'V AC', 1, 6),

-- ⚙️ Subcategoría: Control (Relés) (ID = 7)
(13, 'Carga máxima', 'carga_maxima', 'texto', 'A VAC', 1, 7),
(14, 'Tipo de control', 'control', 'texto', NULL, 1, 7),

-- 🔁 Subcategoría: Sensores (Repetidos por PIR) (ID = 3)
(15, 'Rango de detección', 'rango_deteccion', 'texto', 'm', 1, 3),
(16, 'Voltaje de alimentación', 'alimentacion', 'texto', 'V', 1, 3);

INSERT INTO variantes_producto (
  producto_id, combinacion_slug, sku_variante, precio_variante, stock_variante, imagen_variante_url, activa
) VALUES
-- 🔁 Producto 1: Multímetro Digital UNI-T UT33D+ (variantes por color de carcasa)
(1, 'rojo', 'UT33DPLUS-RED', 320.00, 25, 'https://tianguistore.com/img/variantes/multimetro-rojo.webp', TRUE),
(1, 'azul', 'UT33DPLUS-BLUE', 320.00, 30, 'https://tianguistore.com/img/variantes/multimetro-azul.webp', TRUE),

-- 🧠 Producto 2: Arduino UNO R3 (variantes por versión: original vs compatible)
(2, 'original', 'ARDUINO-UNO-R3-ORG', 480.00, 40, 'https://tianguistore.com/img/variantes/arduino-original.webp', TRUE),
(2, 'compatible', 'ARDUINO-UNO-R3-CLON', 280.00, 60, 'https://tianguistore.com/img/variantes/arduino-clon.webp', TRUE),

-- 📡 Producto 4: ESP32 DevKit V1 (variantes por número de pines)
(4, '30-pines', 'ESP32-30P', 155.00, 50, 'https://tianguistore.com/img/variantes/esp32-30p.webp', TRUE),
(4, '38-pines', 'ESP32-38P', 165.00, 40, 'https://tianguistore.com/img/variantes/esp32-38p.webp', TRUE),

-- 🔌 Producto 8: Fuente de poder 12V 2A (variantes por conector)
(8, 'jack-5.5mm', 'FUENTE-12V2A-JACK', 89.00, 30, 'https://tianguistore.com/img/variantes/fuente-jack.webp', TRUE),
(8, 'terminales', 'FUENTE-12V2A-TERM', 89.00, 20, 'https://tianguistore.com/img/variantes/fuente-terminal.webp', TRUE),

-- ⚙️ Producto 9: Módulo Relé 1 Canal (variantes por voltaje)
(9, '5v', 'RELAY1CH-5V', 19.00, 100, 'https://tianguistore.com/img/variantes/rele-5v.webp', TRUE),
(9, '12v', 'RELAY1CH-12V', 21.00, 60, 'https://tianguistore.com/img/variantes/rele-12v.webp', TRUE);

INSERT INTO productos (
  nombre, slug_producto, descripcion, especificaciones, sku,
  marca_id, categoria_id, subcategoria_id, proveedor_id, tipo_publicacion_id,
  precio, descuento, stock, mostrar_sin_stock, stock_ilimitado,
  peso_kg, dimensiones_cm, garantia_meses, envio_gratis,
  imagen_url, video_url, modelo_3d_url,
  publicado, destacado, estado_visible, status,
  meses_sin_intereses, es_digital, tipo_digital
) VALUES
-- 1. Multímetro Digital UNI-T
('Multímetro Digital UNI-T UT33D+',
 'multimetro-digital-uni-t-ut33d-plus',
 'Multímetro digital compacto para uso general en electrónica, con funciones de voltaje, resistencia y continuidad.',
 'Pantalla LCD 2000 cuentas, protección contra sobrecarga, medición de voltaje DC/AC hasta 600V, resistencia hasta 20MΩ',
 'UT33DPLUS-UNI',
 1, 1, 2, 1, 1,
 320.00, 0.00, 50, FALSE, FALSE,
 0.25, '13x7x3 cm', 12, TRUE,
 'https://tianguistore.com/img/productos/multimetro-uni-t.jpg', NULL, NULL,
 TRUE, FALSE, 'visible', 'activo',
 FALSE, FALSE, NULL),

-- 2. Arduino UNO R3 Original
('Arduino UNO R3 Original',
 'arduino-uno-r3-original',
 'Placa de desarrollo basada en ATmega328P. Ideal para proyectos educativos y prototipado rápido.',
 'Microcontrolador ATmega328P, 14 pines digitales, 6 entradas analógicas, alimentación USB o jack 7-12V.',
 'ARDUINO-UNO-R3',
 2, 1, 1, 1, 1,
 480.00, 10.00, 100, FALSE, FALSE,
 0.05, '7x5x2 cm', 6, FALSE,
 'https://tianguistore.com/img/productos/arduino-uno.jpg', NULL, NULL,
 TRUE, TRUE, 'visible', 'activo',
 TRUE, FALSE, NULL),

-- 3. Sensor IR TCRT5000
('Sensor Infrarrojo de Proximidad TCRT5000',
 'sensor-ir-proximidad-tcrt5000',
 'Sensor óptico reflexivo para detección de objetos cercanos o líneas en robots móviles.',
 'Distancia efectiva: 0.2–15 mm. Salida digital, alimentación 3.3–5V.',
 'TCRT5000-SENSOR',
 3, 1, 3, 1, 1,
 18.00, 0.00, 200, FALSE, FALSE,
 0.01, '2x1.2x0.8 cm', 0, FALSE,
 'https://tianguistore.com/img/productos/tcrt5000.jpg', NULL, NULL,
 TRUE, FALSE, 'visible', 'activo',
 FALSE, FALSE, NULL),

-- 4. ESP32 Devkit V1 DOIT
('ESP32 Devkit V1 WiFi + Bluetooth',
 'esp32-devkit-v1-wifi-bluetooth',
 'Módulo de desarrollo basado en ESP32 con conectividad Wi-Fi y Bluetooth, ideal para IoT.',
 'Doble núcleo Xtensa LX6, 520KB SRAM, 2.4GHz WiFi, BT 4.2, 30 GPIOs.',
 'ESP32-DEVKIT-V1',
 4, 1, 1, 1, 1,
 155.00, 5.00, 80, FALSE, FALSE,
 0.03, '6x3x1.5 cm', 6, FALSE,
 'https://tianguistore.com/img/productos/esp32-devkit.jpg', NULL, NULL,
 TRUE, TRUE, 'visible', 'activo',
 TRUE, FALSE, NULL),

-- 5. Protoboard 830 Puntos
('Protoboard 830 puntos - Doble Línea',
 'protoboard-830-puntos',
 'Protoboard estándar sin soldadura, con 830 puntos de conexión. Ideal para prototipos electrónicos.',
 'Distribución: 630 puntos en matriz + 2 rieles de 100 puntos. Compatible con Arduino, ESP32, etc.',
 'PROTOBOARD-830P',
 5, 1, 4, 1, 1,
 45.00, 0.00, 150, FALSE, FALSE,
 0.10, '16.5x5.5x0.85 cm', 0, FALSE,
 'https://tianguistore.com/img/productos/protoboard.jpg', NULL, NULL,
 TRUE, FALSE, 'visible', 'activo',
 FALSE, FALSE, NULL),

-- 6. Sensor DHT11
('Sensor de Temperatura y Humedad DHT11',
 'sensor-dht11-temperatura-humedad',
 'Sensor digital básico de temperatura y humedad. Ideal para domótica, educación o monitoreo ambiental.',
 'Rango temp: 0–50°C ±2°C; Rango humedad: 20–90% ±5%; salida digital, 3–5V',
 'DHT11-SENSOR',
 5, 1, 3, 1, 1,
 25.00, 0.00, 120, FALSE, FALSE,
 0.02, '2.5x2x1 cm', 0, FALSE,
 'https://tianguistore.com/img/productos/dht11.jpg', NULL, NULL,
 TRUE, FALSE, 'visible', 'activo',
 FALSE, FALSE, NULL),

-- 7. LCD 16x2 Azul con I2C
('Pantalla LCD 16x2 Azul con Módulo I2C',
 'lcd-16x2-i2c',
 'Pantalla de 16 caracteres por 2 líneas con módulo I2C integrado. Ahorra pines en proyectos con Arduino o ESP.',
 'Voltaje: 5V, interfaz I2C, direccionamiento 0x27, retroiluminación azul, caracteres blancos.',
 'LCD162-I2C-AZUL',
 5, 1, 5, 1, 1,
 60.00, 0.00, 75, FALSE, FALSE,
 0.04, '8x3.5x1.2 cm', 0, FALSE,
 'https://tianguistore.com/img/productos/lcd-i2c.jpg', NULL, NULL,
 TRUE, TRUE, 'visible', 'activo',
 FALSE, FALSE, NULL),

-- 8. Fuente 12V 2A
('Fuente de Poder 12V 2A con Jack 5.5mm',
 'fuente-12v-2a-jack',
 'Fuente de alimentación para routers, cámaras y electrónica general. Conector estándar 5.5x2.1mm.',
 'Entrada: 100–240V AC; Salida: 12V DC 2A; Conector Jack DC; Longitud de cable: 1.2m',
 'FUENTE-12V2A',
 6, 1, 6, 1, 1,
 89.00, 0.00, 60, FALSE, FALSE,
 0.20, '9x5x3 cm', 12, FALSE,
 'https://tianguistore.com/img/productos/fuente-12v.jpg', NULL, NULL,
 TRUE, FALSE, 'visible', 'activo',
 FALSE, FALSE, NULL),

-- 9. Módulo Relé 1 Canal
('Módulo Relevador de 1 Canal 5V',
 'modulo-relevador-1-canal-5v',
 'Permite controlar cargas de alto voltaje con microcontroladores. Aislado ópticamente.',
 'Voltaje: 5V, corriente de activación: 15–20 mA, carga: hasta 10A 250VAC / 10A 30VDC',
 'RELAY1CH-5V',
 5, 1, 7, 1, 1,
 19.00, 0.00, 180, FALSE, FALSE,
 0.03, '5x2.6x1.8 cm', 0, FALSE,
 'https://tianguistore.com/img/productos/relevador-1ch.jpg', NULL, NULL,
 TRUE, FALSE, 'visible', 'activo',
 FALSE, FALSE, NULL),

-- 10. Sensor de Movimiento PIR HC-SR501
('Sensor de Movimiento PIR HC-SR501',
 'sensor-movimiento-pir-hcsr501',
 'Sensor infrarrojo pasivo (PIR) para detección de movimiento en proyectos de seguridad o automatización.',
 'Voltaje: 5V, rango: 3–7 m, tiempo de retardo ajustable, ángulo de detección: 120°',
 'PIR-HCSR501',
 5, 1, 3, 1, 1,
 29.00, 0.00, 140, FALSE, FALSE,
 0.02, '3.2x2.4x2.4 cm', 0, FALSE,
 'https://tianguistore.com/img/productos/pir-hcsr501.jpg', NULL, NULL,
 TRUE, FALSE, 'visible', 'activo',
 FALSE, FALSE, NULL);
