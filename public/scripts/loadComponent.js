/**
 * 📦 loadComponent.js
 * Carga dinámica de Navbar/Footer, aplica el tema y ajusta menús según la sesión.
 * Compatible con MaterializeCSS y diseño responsive.
 * 
 * Autor: I.S.C. Erick Renato Vega Ceron
 * Última actualización: Mayo 2025
 */

document.addEventListener("DOMContentLoaded", async () => {
  try {
    aplicarTemaDesdePreferencias();
    await inicializarNavbarYFooter();
    inicializarComponentesMaterialize();
    sincronizarToggleTema();
    actualizarContadorCarrito();
    controlarVisibilidadMenus();
  } catch (error) {
    console.error("⚠️ Error al inicializar la interfaz:", error);
  }
});

// 🔄 Cargar dinámicamente el navbar y footer
async function inicializarNavbarYFooter() {
  const navbarContainer = document.getElementById("navbar-container");
  const footerContainer = document.getElementById("footer-container");

  if (navbarContainer) {
    const res = await fetch("./componentes/navbar.html");
    if (!res.ok) throw new Error("No se pudo cargar navbar.html");
    navbarContainer.innerHTML = await res.text();
  }

  if (footerContainer) {
    const res = await fetch("./componentes/footer.html");
    if (!res.ok) throw new Error("No se pudo cargar footer.html");
    footerContainer.innerHTML = await res.text();
  }
}

// 🌓 Aplicar tema claro u oscuro según preferencias guardadas
function aplicarTemaDesdePreferencias() {
  const temaGuardado = localStorage.getItem("tema");
  const esOscuro = !temaGuardado || temaGuardado === "oscuro";
  document.documentElement.classList.toggle("dark", esOscuro);
}

// ⚙️ Inicializar componentes de Materialize
function inicializarComponentesMaterialize() {
  M.Sidenav.init(document.querySelectorAll(".sidenav"));
  M.Tooltip.init(document.querySelectorAll(".tooltipped"));
  M.Dropdown.init(document.querySelectorAll(".dropdown-trigger"), {
    constrainWidth: false,
    coverTrigger: false,
    alignment: "right"
  });
}

// 🌗 Sincronizar el botón de tema con el estado actual
function sincronizarToggleTema() {
  const toggleBtn = document.getElementById("toggleThemeBtn");
  const icon = toggleBtn?.querySelector("i");
  if (!toggleBtn || !icon) return;

  const temaActual = localStorage.getItem("tema") || "oscuro";
  icon.classList.replace("fa-moon", temaActual === "oscuro" ? "fa-sun" : "fa-moon");

  toggleBtn.addEventListener("click", () => {
    const esOscuro = document.documentElement.classList.toggle("dark");
    localStorage.setItem("tema", esOscuro ? "oscuro" : "claro");
    icon.classList.toggle("fa-sun", esOscuro);
    icon.classList.toggle("fa-moon", !esOscuro);
  });
}

// 🛒 Actualiza el contador total del carrito
function actualizarContadorCarrito() {
  try {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    document.querySelectorAll("#contador-carrito").forEach(el => {
      el.textContent = total;
    });
  } catch (error) {
    console.error("❌ Error al actualizar carrito:", error);
  }
}

// 🔐 Control dinámico de visibilidad de menús por sesión y permisos
function controlarVisibilidadMenus() {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const permisos = usuario?.permisos || {};
  const pedidos = usuario?.pedidos || [];
  const usuarioInfo = document.getElementById("usuario-info");

  const mostrar = (ids, visible = true) => {
    [].concat(ids).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = visible ? "block" : "none";
    });
  };

  if (!token || !usuario) {
    if (usuarioInfo) usuarioInfo.textContent = "Cuenta";
    mostrar([
      "menu-login", "menu-registro",
      "menu-login-desktop", "menu-registro-desktop",
      "menu-login-mobile", "menu-registro-mobile"
    ], true);

    mostrar([
      "menu-logout", "menu-logout-desktop", "menu-logout-mobile",
      "menu-perfil-desktop", "menu-perfil-mobile",
      "nav-pedidos", "nav-pedidos-mobile"
    ], false);

    ocultarMenusPrivados();
    return;
  }

  // Usuario autenticado
  if (usuarioInfo) {
    usuarioInfo.textContent = usuario.nombre || usuario.correo || "Usuario";
  }

  mostrar([
    "menu-login", "menu-registro",
    "menu-login-desktop", "menu-registro-desktop",
    "menu-login-mobile", "menu-registro-mobile"
  ], false);

  mostrar([
    "menu-logout", "menu-logout-desktop", "menu-logout-mobile",
    "menu-perfil-desktop", "menu-perfil-mobile"
  ], true);

  asignarLogout(["menu-logout", "menu-logout-desktop", "menu-logout-mobile"]);

  // Mostrar "Mis pedidos" si tiene alguno
  const tienePedidos = Array.isArray(pedidos) && pedidos.length > 0;
  mostrar(["nav-pedidos", "nav-pedidos-mobile"], tienePedidos);

  // Mostrar menús administrativos por permisos
  const reglas = [
    { keys: ["nav-usuarios", "nav-usuarios-mobile"], visible: permisos.usuarios?.leer },
    { keys: ["nav-configuracion"], visible: permisos.configuracion?.leer },
    { keys: ["nav-metricas"], visible: permisos.reportes?.exportar },
    {
      keys: ["nav-panel"],
      visible:
        permisos.usuarios?.leer ||
        permisos.productos?.leer ||
        permisos.configuracion?.leer ||
        permisos.reportes?.exportar
    }
  ];

  reglas.forEach(({ keys, visible }) => mostrar(keys, visible));
}

// 🚪 Asignar logout a múltiples botones
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

// 🔒 Ocultar elementos restringidos por defecto
function ocultarMenusPrivados() {
  const privados = [
    "nav-usuarios", "nav-usuarios-mobile",
    "nav-pedidos", "nav-pedidos-mobile",
    "nav-configuracion", "nav-metricas", "nav-panel",
    "menu-perfil-desktop", "menu-perfil-mobile"
  ];

  privados.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}
