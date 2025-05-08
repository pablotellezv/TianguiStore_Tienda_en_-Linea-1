/**
 * 📦 loadComponent.js
 * Carga dinámica de Navbar/Footer, gestión de tema, sesión y permisos.
 * Compatible con MaterializeCSS y vista responsive.
 *
 * Autor: I.S.C. Erick Renato Vega Ceron
 * Última actualización: Mayo 2025
 */

document.addEventListener("DOMContentLoaded", async () => {
  try {
    aplicarTemaDesdePreferencias();

    // 🔼 Navbar
    const navbarContainer = document.getElementById("navbar-container");
    if (navbarContainer) {
      const res = await fetch("./componentes/navbar.html");
      if (!res.ok) throw new Error("No se pudo cargar navbar.html");
      navbarContainer.innerHTML = await res.text();

      inicializarComponentesMaterialize();
      sincronizarTemaToggle();
      actualizarContadorCarrito();
      aplicarVisibilidadMenus();
    }

    // 🔽 Footer
    const footerContainer = document.getElementById("footer-container");
    if (footerContainer) {
      const res = await fetch("./componentes/footer.html");
      if (!res.ok) throw new Error("No se pudo cargar footer.html");
      footerContainer.innerHTML = await res.text();
    }

  } catch (error) {
    console.error("⚠️ Error al cargar componentes:", error);
  }
});

// 🌓 Aplicar tema almacenado
function aplicarTemaDesdePreferencias() {
  const tema = localStorage.getItem("tema");
  const esOscuro = !tema || tema === "oscuro";
  document.documentElement.classList.toggle("dark", esOscuro);
}

// ⚙️ Inicializar componentes Materialize
function inicializarComponentesMaterialize() {
  M.Sidenav.init(document.querySelectorAll(".sidenav"));
  M.Tooltip.init(document.querySelectorAll(".tooltipped"));
  M.Dropdown.init(document.querySelectorAll(".dropdown-trigger"), {
    constrainWidth: false,
    coverTrigger: false,
    alignment: "right"
  });
}

// 🌓 Alternar tema e ícono
function sincronizarTemaToggle() {
  const toggleBtn = document.getElementById("toggleThemeBtn");
  const icon = toggleBtn?.querySelector("i");
  if (!toggleBtn || !icon) return;

  const temaActual = localStorage.getItem("tema") || "oscuro";
  icon.classList.replace("fa-moon", temaActual === "oscuro" ? "fa-sun" : "fa-moon");

  toggleBtn.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("tema", isDark ? "oscuro" : "claro");
    icon.classList.toggle("fa-sun", isDark);
    icon.classList.toggle("fa-moon", !isDark);
  });
}

// 🛒 Actualizar número del carrito
function actualizarContadorCarrito() {
  try {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    document.querySelectorAll("#contador-carrito").forEach(el => {
      el.textContent = total;
    });
  } catch (error) {
    console.error("❌ Error al procesar carrito:", error);
  }
}

// 🔐 Mostrar u ocultar elementos según sesión y permisos
function aplicarVisibilidadMenus() {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const permisos = usuario?.permisos || {};
  const usuarioInfo = document.getElementById("usuario-info");

  const mostrar = (ids, visible = true) => {
    [].concat(ids).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = visible ? "block" : "none";
    });
  };

  // 🔓 No autenticado
  if (!token || !usuario) {
    console.log("🔒 Usuario no autenticado");
    if (usuarioInfo) usuarioInfo.textContent = "Cuenta";

    mostrar(["menu-login", "menu-registro", "menu-login-desktop", "menu-registro-desktop", "menu-login-mobile", "menu-registro-mobile"], true);
    mostrar(["menu-logout", "menu-logout-desktop", "menu-logout-mobile"], false);
    ocultarMenusPrivados();
    return;
  }

  // ✅ Autenticado
  console.log(`🔑 Usuario autenticado: ${usuario.correo}`);
  if (usuarioInfo) usuarioInfo.textContent = usuario.correo;

  mostrar(["menu-login", "menu-registro", "menu-login-desktop", "menu-registro-desktop", "menu-login-mobile", "menu-registro-mobile"], false);
  mostrar(["menu-logout", "menu-logout-desktop", "menu-logout-mobile"], true);

  asignarLogout(["menu-logout", "menu-logout-desktop", "menu-logout-mobile"]);

  const visibilidad = [
    { keys: ["nav-productos", "nav-productos-mobile"], visible: permisos.productos?.leer || permisos.productos?.crear },
    { keys: ["nav-categorias", "nav-categorias-mobile"], visible: permisos.categorias?.leer },
    { keys: ["nav-usuarios", "nav-usuarios-mobile"], visible: permisos.usuarios?.leer },
    { keys: ["nav-pedidos", "nav-pedidos-mobile"], visible: permisos.pedidos?.leer },
    { keys: ["nav-configuracion"], visible: permisos.configuracion?.leer },
    { keys: ["nav-metricas"], visible: permisos.reportes?.exportar },
    {
      keys: ["nav-panel"],
      visible: permisos.usuarios?.leer || permisos.productos?.leer || permisos.configuracion?.leer || permisos.reportes?.exportar
    }
  ];

  visibilidad.forEach(({ keys, visible }) => mostrar(keys, visible));
}

// 🚪 Asignar eventos de logout
function asignarLogout(ids) {
  const logout = () => {
    localStorage.clear();
    M.toast({ html: "Sesión cerrada exitosamente", classes: "rounded amber darken-3" });
    window.location.href = "login.html";
  };

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.onclick = logout;
  });
}

// 🛑 Ocultar todos los menús privados
function ocultarMenusPrivados() {
  const privados = [
    "nav-productos", "nav-productos-mobile",
    "nav-categorias", "nav-categorias-mobile",
    "nav-usuarios", "nav-usuarios-mobile",
    "nav-pedidos", "nav-pedidos-mobile",
    "nav-configuracion", "nav-metricas", "nav-panel"
  ];
  privados.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}
