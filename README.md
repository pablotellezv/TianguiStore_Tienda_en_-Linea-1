# 🛍️ TianguiStore – Plataforma Modular para Tiendas en Línea con Enfoque Educativo

**Repositorio oficial:** [github.com/Dtcsrni/TianguiStore_Tienda_en_-Linea](https://github.com/Dtcsrni/TianguiStore_Tienda_en_-Linea)  
**Autor:** 🧑‍💻🎮 I.S.C. Erick Renato Vega Ceron

---

## 🔍 Descripción del proyecto

**TianguiStore** es una plataforma web educativa y modular, desarrollada con JavaScript, Node.js y MySQL. Está diseñada para enseñar y practicar el desarrollo de sistemas web con base de datos relacional, y permite adaptaciones rápidas a distintos contextos comerciales como:

- 📚 Librerías
- 🧰 Ferreterías
- 🏥 Clínicas médicas
- 🐾 Veterinarias
- 🥬 Verdulerías
- 🛒 Tiendas de abarrotes
- 🏪 Minisúper
- ✏️ Papelerías
- 🍽️ Restaurantes
- 🍸 Bares
- 🌃 Centros nocturnos

---

## ⚙️ Tecnologías y herramientas

- **Lenguaje principal:** JavaScript (ES6+)
- **Backend:** Node.js + Express.js
- **Frontend:** HTML, CSS personalizado, Bootstrap 5
- **Base de datos:** MySQL/MariaDB 10.4.32
- **Autenticación:** JWT + bcryptjs
- **Entorno de desarrollo:** Visual Studio Code + ESLint + Prettier + Live Server
- **Gestor de dependencias:** npm
- **Estilo de desarrollo:** Modular, basado en principios SOLID
- **API:** RESTful organizada por módulos

---

## 🧠 Estructura del proyecto

```plaintext
TianguiStore_Tienda_en_-Linea/
├── backend/
│   ├── controllers/      # Lógica por módulo
│   ├── routes/           # Endpoints agrupados
│   ├── middlewares/      # Seguridad y validaciones
│   ├── utils/            # Funciones auxiliares
│   ├── db.js             # Conexión a la BD
│   ├── server.js         # Entrada principal del backend
│   └── tienda_db_completa.sql
├── public/
│   ├── index.html        # Página principal
│   ├── componentes/      # Navbar, footer, etc.
│   ├── estilo/           # Hojas de estilo
│   ├── imagenes/         # Gráficos
│   └── scripts/          # JS para frontend
├── database/             # Scripts por vertical
├── scripts/              # Automatización (opcional)
├── .env                  # Variables de entorno
├── README.md
└── Manual Usuario TianguiStore

# 🤝 Guía para Contribuir a TianguiStore

¡Gracias por tu interés en contribuir a **TianguiStore**! Este proyecto está diseñado con fines educativos y de aprendizaje colaborativo, por lo que cualquier tipo de contribución, desde la corrección de errores hasta nuevas funcionalidades, es bienvenida.

---

## 🧭 Principios generales

- 📚 El proyecto sigue buenas prácticas de desarrollo: modularidad, separación de responsabilidades (SRP), principios SOLID.
- 🛠️ Está enfocado en enseñar sobre arquitectura backend/frontend, autenticación, y diseño de base de datos.
- 🌱 Cualquier sugerencia que mejore la claridad, el código o la documentación será considerada.

---

## 📝 ¿Cómo contribuir?

### 1. Haz un fork del repositorio

Puedes hacer clic en el botón **Fork** en la parte superior del repositorio.

```bash
git clone https://github.com/tuusuario/TianguiStore_Tienda_en_-Linea.git
cd TianguiStore_Tienda_en_-Linea
```

### 2. Crea una rama nueva

```bash
git checkout -b feature/tu-cambio
```

### 3. Realiza tus cambios con buena documentación y comentarios

- Usa comentarios claros si introduces nueva lógica.
- Añade pruebas o datos de ejemplo si es posible.
- Asegúrate de que el proyecto funcione antes de hacer push.

### 4. Haz commit siguiendo este formato

```bash
git commit -m "feat: agrega funcionalidad X"  # otros: fix, docs, style, refactor
```

### 5. Sube tu rama y crea un Pull Request

```bash
git push origin feature/tu-cambio
```

Luego, ve al repositorio en GitHub y crea un **Pull Request** desde tu rama.

---

## 🔍 Estructura del proyecto

Antes de contribuir, te recomendamos revisar:

- `backend/` – lógica de negocio, rutas, middlewares
- `public/` – frontend en HTML + JS
- `tienda_db_completa.sql` – estructura de la base de datos

---

## ✅ Criterios de aceptación

- Código limpio, modular y funcional
- No rompe funcionalidades existentes
- Sigue el estilo y arquitectura del proyecto
- Incluye comentarios/documentación si aplica

---

## 🗓️ Ideas para contribuir

- Mejoras en la validación de formularios
- Nuevos filtros en productos
- Versión mobile del frontend
- Verticales personalizadas (verdulería, papelería…)
- Test unitarios o casos de prueba
- Diagramas de arquitectura o ERD actualizados

---

## 🙌 Gracias

Gracias por tomarte el tiempo de ayudar a mejorar este proyecto. Tu contribución ayuda a que otros estudiantes aprendan con una base de código real, bien estructurada y en evolución constante.

¡Feliz codificación! 🚀
