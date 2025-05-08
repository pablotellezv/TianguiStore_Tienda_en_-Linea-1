/**
 * 📦 loadComponent.js
 * 
 * Descripción:
 * Este archivo maneja la carga dinámica de los componentes compartidos (Navbar y Footer) en las páginas,
 * la verificación de la sesión del usuario y la actualización de los menús basados en el rol y los permisos 
 * del usuario. Además, incluye la funcionalidad de alternar entre temas (claro/oscuro) y actualizar el contador 
 * del carrito globalmente.
 * 
 * Funciones:
 * - Cargar y mostrar dinámicamente el Navbar y Footer desde archivos HTML.
 * - Verificar la sesión del usuario (autenticado o no).
 * - Insertar los menús de navegación dinámicamente según los permisos del usuario.
 * - Actualizar el contador global del carrito.
 * 
 * Autor: I.S.C. Erick Renato Vega Ceron
 * Fecha de Creación: Mayo 2025
 */

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 🌐 Cargar Navbar dinámicamente
    const navbarContainer = document.getElementById("navbar-container");
    if (navbarContainer) {
      const res = await fetch("./componentes/navbar.html");
      if (!res.ok) throw new Error("Error al cargar navbar.html");
      navbarContainer.innerHTML = await res.text();
    }

    // 📦 Cargar Footer dinámicamente
    const footerContainer = document.getElementById("footer-container");
    if (footerContainer) {
      const res = await fetch("./componentes/footer.html");
      if (!res.ok) throw new Error("Error al cargar footer.html");
      footerContainer.innerHTML = await res.text();
    }

    // 🔁 Inicializaciones post-carga
    iniciarNavbar();
    actualizarContadorCarrito();
    verificarSesion();
    insertarMenusDinamicos();
  } catch (error) {
    console.error("⚠️ Error al cargar componentes compartidos:", error);
  }
});

// 🎛️ Función para inicializar el Navbar, incluyendo la alternancia del tema y el menú hamburguesa
function iniciarNavbar() {
  const toggleBtn = document.getElementById("toggleNavbarBtn");
  const navbarMenu = document.getElementById("navbarMenu");
  if (toggleBtn && navbarMenu) {
    toggleBtn.addEventListener("click", () => {
      navbarMenu.classList.toggle("hidden");
    });
  }

  const themeBtn = document.getElementById("toggleThemeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
      const icon = themeBtn.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-moon");
        icon.classList.toggle("fa-sun");
      }
    });
  }
}

// 🧮 Función para actualizar el contador global del carrito
function actualizarContadorCarrito() {
  try {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    document.querySelectorAll("#contador-carrito").forEach(el => el.textContent = total);
  } catch (err) {
    console.error("⚠️ Error al actualizar contador de carrito:", err);
  }
}

// 🔐 Función para verificar la sesión del usuario y actualizar el menú de cuenta
function verificarSesion() {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const usuarioInfo = document.getElementById("usuario-info");
  const menuLogin = document.getElementById("menu-login");
  const menuRegistro = document.getElementById("menu-registro");
  const menuLogout = document.getElementById("menu-logout");

  if (!usuarioInfo || !menuLogin || !menuRegistro || !menuLogout) {
    console.warn("⚠️ Elementos de sesión no encontrados en navbar.");
    return;
  }

  if (token && usuario) {
    console.log(`✅ Sesión activa para: ${usuario.correo}`);
    usuarioInfo.textContent = usuario.correo;
    menuLogin.classList.add("hidden");
    menuRegistro.classList.add("hidden");
    menuLogout.classList.remove("hidden");

    // Funcionalidad para cerrar sesión
    menuLogout.addEventListener("click", () => {
      localStorage.clear();
      alert("Sesión cerrada exitosamente.");
      window.location.href = "login.html";
    });
  } else {
    console.log("🚫 Usuario no autenticado.");
    usuarioInfo.textContent = "Cuenta";
    menuLogin.classList.remove("hidden");
    menuRegistro.classList.remove("hidden");
    menuLogout.classList.add("hidden");
  }
}

// 📌 Función para mostrar secciones del menú dinámicamente según los permisos del usuario
function insertarMenusDinamicos() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const permisos = usuario?.permisos || {};
  if (!usuario || !usuario.rol) return;

  // Función para mostrar un elemento del menú
  const mostrar = (id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("hidden");
  };

  // Mostrar elementos según permisos del usuario
  if (permisos.productos?.leer || permisos.productos?.crear) mostrar("nav-productos");
  if (permisos.usuarios?.leer) mostrar("nav-usuarios");
  if (permisos.pedidos?.leer) mostrar("nav-pedidos");
  if (permisos.configuracion?.leer) mostrar("nav-configuracion");
  if (permisos.reportes?.exportar) mostrar("nav-metricas");

  // Mostrar panel de administración si tiene acceso
  if (
    permisos.usuarios?.leer ||
    permisos.productos?.leer ||
    permisos.configuracion?.leer ||
    permisos.reportes?.exportar
  ) {
    mostrar("nav-panel");
  }
}
