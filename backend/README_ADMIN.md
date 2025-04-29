
# 🛠️ Guía de Despliegue Inicial – TianguiStore / tienda_db

Este documento contiene las instrucciones administrativas para instalar, configurar e inicializar correctamente la base de datos `tienda_db`, con datos de prueba listos para usar.

---

## 📦 Contenido del Paquete

- `full_inicializacion_tienda_db_super_extendida.sql`: Script SQL que crea la base de datos, estructura completa y datos de inicio.
- `actualizar_contrasenas_tianguistore.sql`: Script para actualizar contraseñas con valores hasheados con `bcrypt`.
- `usuarios_prueba.txt`: Documento confidencial con credenciales de prueba para login de cada rol del sistema.

---

## 🚀 Pasos de Instalación

### 1. Crear la base de datos

Abra **phpMyAdmin** o su cliente SQL y ejecute el script:

```sql
full_inicializacion_tienda_db_super_extendida.sql
```

Este archivo:
- Crea la base de datos `tienda_db`
- Genera todas las tablas necesarias con sus relaciones
- Inserta datos iniciales: roles, usuarios, marcas, productos, etc.

---

### 2. Actualizar contraseñas

Después de importar la estructura y los usuarios, ejecuta:

```sql
actualizar_contrasenas_tianguistore.sql
```

Esto asegurará que las contraseñas en la tabla `usuarios` estén correctamente encriptadas con `bcrypt` y puedan utilizarse en el login del sistema.

---

### 3. Revisar usuarios de prueba

Las credenciales están documentadas en:

```
/private/usuarios_prueba.txt
```

**🔐 Importante:** Este archivo debe ser almacenado **fuera del directorio público del servidor web**.
- Ejemplo seguro: `/var/private/usuarios_prueba.txt`
- **No** lo coloques en `/public`, `/htdocs`, o subcarpetas accesibles desde el navegador.

---

## 👥 Usuarios de Prueba

| Correo                     | Contraseña    | Rol          |
|-----------------------------|---------------|--------------|
| admin@tienda.com            | `Admin123`     | Administrador |
| cliente@tienda.com          | `Cliente123`   | Cliente       |
| vendedor@tienda.com         | `Vendedor123`  | Vendedor      |
| soporte@tienda.com          | `Soporte123`   | Soporte       |
| repartidor@tienda.com       | `Repartidor123`| Repartidor    |

---

## 🔐 Recomendaciones de Seguridad

- Cambiar las contraseñas de los usuarios de prueba en entorno de producción.
- Utilizar **HTTPS** obligatorio.
- Implementar autenticación y autorización robusta usando **JWT**.
- Aplicar validaciones de entrada en frontend y backend.
- Configurar políticas de Rate Limiting, registros de acceso y auditoría de seguridad.

---

## 📁 Estructura Sugerida de Archivos

```
/database
  ├── full_inicializacion_tienda_db_super_extendida.sql
  ├── actualizar_contrasenas_tianguistore.sql
/private
  └── usuarios_prueba.txt  ← confidencial
```

---

© TianguiStore – Documentación Técnica para Despliegue Inicial  
Versión: v1.1 — Última actualización: 29 de abril de 2025
