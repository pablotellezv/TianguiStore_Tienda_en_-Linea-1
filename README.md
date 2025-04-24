# 🛍️ TianguiStore – Plataforma Modular para Tiendas en Línea con Enfoque Educativo

**Repositorio oficial:** [github.com/Dtcsrni/TianguiStore_Tienda_en_-Linea](https://github.com/Dtcsrni/TianguiStore_Tienda_en_-Linea)  
**Autor:** 🧑‍💻🎮 I.S.C. Erick Renato Vega Ceron

---

## 🔍 Descripción del proyecto

**TianguiStore** es una plataforma educativa modular desarrollada con JavaScript, Node.js y MySQL/MariaDB. Está pensada para el aprendizaje práctico en arquitectura web, autenticación y modelado de datos, y se puede adaptar a verticales como:

- 📚 Librerías
- 🧰 Ferreterías
- 🏥 Clínicas médicas
- 🐾 Veterinarias
- 🥬 Verdulerías
- 🛒 Abarrotes
- 🏪 Minisúper
- ✏️ Papelerías
- 🍽️ Restaurantes
- 🍸 Bares
- 🌃 Centros nocturnos

---

## ⚙️ Tecnologías principales

- **Lenguaje:** JavaScript (ES6+)
- **Backend:** Node.js + Express
- **Base de datos:** MySQL/MariaDB 10.4.32
- **Frontend:** HTML + CSS + Bootstrap 5
- **Autenticación:** JWT + bcryptjs
- **Entorno:** Visual Studio Code
- **API:** RESTful organizada por dominios

---

## 📥 Cómo clonar, actualizar o crear tu propia versión de TianguiStore

### 🔁 Clonar el repositorio original

```bash
git clone https://github.com/Dtcsrni/TianguiStore_Tienda_en_-Linea.git
cd TianguiStore_Tienda_en_-Linea
npm install
```

---

### 🔄 Obtener los últimos cambios del repositorio original

```bash
git remote add upstream https://github.com/Dtcsrni/TianguiStore_Tienda_en_-Linea.git
git fetch upstream
git checkout main
git merge upstream/main
```

---

### 🍴 Crear tu propia versión (fork)

1. Haz clic en **Fork** en GitHub.
2. Clona tu fork:

```bash
git clone https://github.com/tuusuario/TianguiStore_Tienda_en_-Linea.git
cd TianguiStore_Tienda_en_-Linea
npm install
```

3. Crea una nueva rama:

```bash
git checkout -b feature/mi-mejora
```

4. Sube tus cambios y crea un Pull Request si deseas contribuir.

---

### ⭐ Apoya el proyecto

- Dale una **estrella ⭐** al repositorio.
- Haz clic en **Watch 👀** para recibir notificaciones.
- ¡Comparte con otros estudiantes o colegas!

---

## 🚀 Estado actual: versión 0.1 Beta

### ✅ Incluye

- Login y registro con JWT
- Listado de productos
- Carrito por usuario autenticado
- Pedidos con historial
- Script SQL estructurado y comentado

### 🔜 Próxima versión (0.2)

- Filtros y búsqueda
- Panel de administrador
- CRUD desde backend
- Gestión de roles y perfiles
- Verticales activables

---

## 📄 Licencia

Este proyecto se distribuye con fines educativos bajo la Licencia MIT.

---
---

## ▶️ Cómo ejecutar TianguiStore localmente

### Requisitos previos

- Node.js (recomendado: v18 o superior)
- MySQL/MariaDB (preferentemente desde XAMPP)
- Visual Studio Code (u otro editor)
- Git

### Pasos para ejecución local

1. Clona el proyecto:

```bash
git clone https://github.com/Dtcsrni/TianguiStore_Tienda_en_-Linea.git
cd TianguiStore_Tienda_en_-Linea
```

2. Instala las dependencias del backend:

```bash
npm install
```

3. Crea un archivo `.env` dentro del directorio `backend/` con este contenido:

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=tianguistore
JWT_SECRET=miclaveultrasecreta
```

4. Importa el archivo `tienda_db_completa.sql` en tu gestor MySQL (ej. phpMyAdmin) y crea una base de datos llamada `tianguistore`.

5. Inicia el servidor:

```bash
node backend/server.js
```

6. Abre `public/index.html` con Live Server o desde tu navegador.

¡Listo! Ahora puedes probar todas las funcionalidades de TianguiStore desde tu máquina local.
