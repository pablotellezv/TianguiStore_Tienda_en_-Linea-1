# 🛍️ TianguiStore – Plataforma Modular para Tiendas en Línea con Enfoque Educativo y Comercial

**Repositorio oficial:** [github.com/Dtcsrni/TianguiStore_Tienda_en_-Linea](https://github.com/Dtcsrni/TianguiStore_Tienda_en_-Linea)  
**Autor:** I.S.C. Erick Renato Vega Ceron

---

## 🔍 Descripción del proyecto

**TianguiStore** es una tienda en línea modular, escalable y educativa diseñada con tecnologías modernas de backend y frontend. Nació como una herramienta para el aprendizaje de arquitectura web, pero ha evolucionado hasta ser un sistema base adaptable a necesidades reales de negocio.

### ✅ Casos de uso reales:

- Comercio local y PyMEs
- Cooperativas de productores
- Emprendimientos gastronómicos
- Servicios técnicos y profesionales
- Proyectos escolares y tesis
- Capacitación en desarrollo web full-stack

---

## ⚙️ Tecnologías implementadas

| Área        | Tecnología                 |
|-------------|-----------------------------|
| Lenguaje    | JavaScript (ES6+)           |
| Backend     | Node.js + Express.js        |
| Base de Datos | MySQL / MariaDB (10.4+)    |
| Frontend    | HTML + CSS + Bootstrap 5    |
| Autenticación | JWT + bcryptjs            |
| API         | RESTful modular             |
| Seguridad   | Helmet + HPP + CORS         |
| Validaciones | express-validator + middleware personalizado |
| DevTools    | Visual Studio Code, Git     |

---

## 🚀 Estado actual del proyecto: `v0.1 Alfa`

### Funciones actuales:
- 🔐 Login y registro seguro por JWT
- 👤 Roles y control de permisos
- 🛍️ Catálogo de productos dinámico
- 🛒 Carrito por usuario autenticado
- 🧾 Pedidos con historial por cliente
- 🗃️ Base de datos relacional completa en SQL
- 🛡️ Middleware de validación por esquemas

---

## 📅 Roadmap versión 0.2

- 🔍 Búsqueda y filtros por producto/categoría
- 🛠️ Panel administrativo por rol (admin, vendedor, soporte)
- 🎨 Mejora visual con componentes adaptables (navbar, footer)
- ⚙️ Configuración dinámica de la tienda
- 📦 Gestión de stock y promociones
- 🌐 Versión SaaS administrada + documentación API

---

## ▶️ Instalación y ejecución local

### 🔧 Requisitos
- Node.js 18+
- MySQL o MariaDB (XAMPP recomendado)
- Git + Visual Studio Code

### 📥 Pasos

```bash
git clone https://github.com/Dtcsrni/TianguiStore_Tienda_en_-Linea.git
cd TianguiStore_Tienda_en_-Linea
npm install
```

Crea un archivo `.env` en `backend/` con:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=tianguistore
JWT_SECRET=miclaveultrasecreta
```

Importa el script `estructura_completa_tienda_db.sql` en tu gestor SQL.

Luego, ejecuta:

```bash
node backend/server.js
```

Abre `public/index.html` en el navegador o con Live Server.

---

## 💡 Cómo contribuir

1. Haz un fork
2. Crea tu rama: `git checkout -b feature/mi-mejora`
3. Realiza tus cambios
4. Abre un Pull Request para revisión

---

## 💬 ¿Deseas personalizar TianguiStore?

- Puedes usarlo en tus clases o como plantilla para clientes reales.
- Ofrecemos instalación, hosting, marca blanca y licencias bajo acuerdo.
- Escríbeme a: **armsystechno@gmail.com**

---

## 📄 Licenciamiento

- Licencia educativa sin fines de lucro (CC BY-NC-SA)
- Licencia comercial disponible bajo contrato individual
- Consulta más detalles en el archivo [`licencia.md`](./licencia.md)

---

## 🌟 Apoya este proyecto

- ⭐ Dale estrella al repo
- 👀 Haz Watch para actualizaciones
- 📤 Compártelo con estudiantes o desarrolladores independientes

> _Hecho en México 🇲🇽 para el presente digital de quienes venden con propósito_

---
