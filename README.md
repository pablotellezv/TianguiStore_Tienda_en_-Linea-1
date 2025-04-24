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
