# 🛍️ TianguiStore – Plataforma Modular para Tiendas en Línea con Enfoque Educativo y Profesional

**Repositorio oficial:** [github.com/Dtcsrni/TianguiStore_Tienda_en_-_Linea](https://github.com/Dtcsrni/TianguiStore_Tienda_en_-_Linea)  
**Autor:** I.S.C. Erick Renato Vega Ceron

---

## 🔍 ¿Qué es TianguiStore?

**TianguiStore** es una tienda en línea adaptable, diseñada para servir tanto como herramienta educativa como base funcional para proyectos reales de comercio electrónico. Desarrollada con tecnologías modernas, su arquitectura modular facilita el aprendizaje práctico y la personalización para diversos sectores productivos.

### Aplicaciones reales:
- Comercio local y PyMEs
- Cooperativas y productores independientes
- Emprendimientos gastronómicos
- Tesis universitarias y talleres escolares
- Agencias de desarrollo que requieren una base lista para producción

---

## ⚙️ Tecnologías utilizadas

| Categoría       | Herramienta                      |
|------------------|-----------------------------------|
| Lenguaje         | JavaScript (ES6+)                 |
| Backend          | Node.js + Express.js              |
| Base de Datos    | MySQL / MariaDB (AMPPS recomendado) |
| Frontend         | HTML + CSS + Bootstrap 5          |
| Autenticación    | JWT + bcryptjs                    |
| Validaciones     | express-validator + middlewares   |
| Seguridad        | Helmet, HPP, CORS                 |
| Herramientas     | Git + Visual Studio Code          |
| API              | RESTful organizada por dominios   |

---

## 🚀 Estado actual: `v0.1 Alfa`

### Funcionalidades implementadas:
- Registro e inicio de sesión con JWT
- Roles de usuario con control de permisos
- Catálogo de productos dinámico
- Carrito de compras por sesión autenticada
- Gestión básica de pedidos con historial
- Base de datos relacional documentada (SQL)
- Validaciones robustas por esquema

---

## 🧭 Próxima versión (`v0.2`)

- Filtros y búsqueda por categoría y texto
- Panel de administración contextual según rol
- Gestión completa de usuarios, pedidos y productos
- Personalización de configuración de tienda
- Mejora estética general con componentes reutilizables

---

## ▶️ ¿Cómo ejecutar TianguiStore localmente?

### Requisitos:

- Node.js 18 o superior
- AMPPS (Apache + MySQL + PHP + Softaculous)
- Git
- Navegador moderno

### Instrucciones:

```bash
git clone https://github.com/Dtcsrni/TianguiStore_Tienda_en_-_Linea.git
cd TianguiStore_Tienda_en_-_Linea
npm install
```

Luego, crea un archivo `.env` en `backend/` con los siguientes datos:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=tianguistore
JWT_SECRET=miclaveultrasecreta
```

Importa el archivo `estructura_completa_tienda_db.sql` desde AMPPS (usando phpMyAdmin o consola MySQL).

Después, ejecuta el servidor:

```bash
node backend/server.js
```

Abre `public/index.html` directamente o utilizando una extensión como Live Server en VSCode.

---

## 💬 ¿Deseas personalizar TianguiStore?

- Puedes adaptarlo fácilmente para clientes reales o proyectos de tesis.
- Se ofrece licenciamiento profesional, instalación remota, branding personalizado y soporte extendido.

📩 Contacto directo: **armsystechno@gmail.com**

---

## 📄 Licencia

- Uso educativo gratuito bajo licencia CC BY-NC-SA
- Uso comercial solo mediante contrato formal con el autor

---

## 🌟 ¿Te gusta el proyecto?

- Dale ⭐ para apoyarlo
- Haz Watch 👀 para recibir actualizaciones
- Comparte con estudiantes, colegas o desarrolladores freelance

> _“Hecho en México 🇲🇽 con visión ética, modularidad técnica y utilidad real para quienes venden con propósito.”_
