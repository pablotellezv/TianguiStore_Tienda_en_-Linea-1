// admin/index.js
import { obtenerUsuarioAutenticado } from "./auth.js";
import { mostrarDashboard } from "./dashboard.js";
import { mostrarUsuarios } from "./usuarios.js";
import { mostrarProductos } from "./productos.js";
import { mostrarPedidos } from "./pedidos.js";
import { mostrarConfiguracion } from "./configuracion.js";

// 📌 Secciones disponibles y sus permisos necesarios
const secciones = {
  dashboard: { mostrar: mostrarDashboard, permiso: true },
  usuarios: { mostrar: mostrarUsuarios, permisoKey: "usuarios" },
  productos: { mostrar: mostrarProductos, permisoKey: "productos" },
  pedidos: { mostrar: mostrarPedidos, permisoKey: "pedidos" },
  configuracion: { mostrar: mostrarConfiguracion, permisoKey: "configuracion" }
};

// 🔐 Validar sesión y mostrar dashboard por defecto
document.addEventListener("DOMContentLoaded", () => {
  const usuario = obtenerUsuarioAutenticado();

  if (!usuario) {
    alert("⚠️ Acceso no autorizado o sesión expirada.");
    window.location.href = "/login.html";
    return;
  }

  document.getElementById("usuarioNombre").textContent =
    usuario.nombre || "Administrador";

  mostrarSeccion("dashboard");
});

// 🚪 Cerrar sesión y limpiar datos
export function cerrarSesion() {
  localStorage.removeItem("usuario");
  localStorage.removeItem("token");
  localStorage.removeItem("carrito");
  window.location.href = "/login.html";
}

// 🔄 Cambiar entre secciones
export async function mostrarSeccion(nombreSeccion) {
  const contenedor = document.getElementById("seccion-principal");
  const usuario = obtenerUsuarioAutenticado();
  const permisos = usuario?.permisos || {};

  if (!contenedor || !secciones[nombreSeccion]) {
    console.warn(`❌ Sección "${nombreSeccion}" no válida.`);
    return;
  }

  const seccion = secciones[nombreSeccion];
  const tienePermiso =
    seccion.permiso === true || permisos[seccion.permisoKey]?.leer;

  contenedor.innerHTML = `
    <div class="text-center my-8">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-yellow-400 border-opacity-75 mx-auto"></div>
      <p class="mt-4 text-sm text-gray-400">Cargando sección <strong>${nombreSeccion}</strong>...</p>
    </div>
  `;

  if (!tienePermiso) {
    contenedor.innerHTML = `
      <div class="text-center text-yellow-300 mt-10">
        <i class="fas fa-exclamation-triangle text-3xl mb-2"></i>
        <p class="font-semibold">No tienes permiso para acceder a esta sección.</p>
      </div>
    `;
    return;
  }

  try {
    await seccion.mostrar(contenedor);
  } catch (error) {
    console.error(`⚠️ Error al mostrar sección "${nombreSeccion}":`, error);
    contenedor.innerHTML = `
      <div class="text-center text-red-500 mt-10">
        <i class="fas fa-bug text-3xl mb-2"></i>
        <p>Ocurrió un error al cargar la sección. Intenta nuevamente.</p>
      </div>
    `;
  }
}
