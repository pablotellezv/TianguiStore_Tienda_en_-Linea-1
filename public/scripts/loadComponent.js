/**
 * 📦 loadComponent.js
 * Carga dinámica de Navbar y Footer, aplica tema, y controla visibilidad y menús según sesión.
 * Incluye dropdown con imagen de perfil, permisos por rol y estilo glassmorphism.
 * Autor: I.S.C. Erick Renato Vega Ceron — Versión Final Mayo 2025
 */

document.addEventListener("DOMContentLoaded", async () => {
  try {
    aplicarTemaDesdePreferencias();
    await Promise.all([cargarNavbar(), cargarFooter()]);
    inicializarMaterialize();
    sincronizarToggleTema();
    actualizarContadorCarrito();
  } catch (error) {
    console.error("⚠️ Error general de inicialización:", error);
  }
});

/* ══════════════════════════════════════
   📁 CARGA DE COMPONENTES
═══════════════════════════════════════ */

async function cargarNavbar() {
  const contenedor = document.getElementById("navbar-container");
  if (!contenedor) return;

  try {
    const res = await fetch("./componentes/navbar.html");
    if (!res.ok) throw new Error("No se pudo cargar navbar.html");
    contenedor.innerHTML = await res.text();
    contenedor.classList.add("animate__animated", "animate__fadeInDown");

    gestionarVisibilidadMenus();
    inicializarMaterialize();
  } catch (err) {
    console.error("❌ Navbar:", err);
    contenedor.innerHTML = `<nav class="red darken-4 center-align">⚠️ Error al cargar menú</nav>`;
  }
}

async function cargarFooter() {
  const contenedor = document.getElementById("footer-container");
  if (!contenedor) return;

  try {
    const res = await fetch("./componentes/footer.html");
    if (!res.ok) throw new Error("No se pudo cargar footer.html");
    contenedor.innerHTML = await res.text();
    contenedor.classList.add("animate__animated", "animate__fadeInUp");
  } catch (err) {
    console.error("❌ Footer:", err);
    contenedor.innerHTML = `<footer class="page-footer red darken-4 center-align">⚠️ Error al cargar pie de página</footer>`;
  }
}

/* ══════════════════════════════════════
   🌗 TEMA OSCURO / CLARO
═══════════════════════════════════════ */

function aplicarTemaDesdePreferencias() {
  const tema = localStorage.getItem("tema") || "oscuro";
  document.documentElement.classList.toggle("dark", tema === "oscuro");
}

function sincronizarToggleTema() {
  const toggle = document.getElementById("toggleThemeBtn");
  const icono = toggle?.querySelector("i");
  if (!toggle || !icono) return;

  const temaActual = localStorage.getItem("tema") || "oscuro";
  icono.classList.replace("fa-moon", temaActual === "oscuro" ? "fa-sun" : "fa-moon");

  toggle.addEventListener("click", () => {
    const oscuro = document.documentElement.classList.toggle("dark");
    localStorage.setItem("tema", oscuro ? "oscuro" : "claro");
    icono.classList.toggle("fa-sun", oscuro);
    icono.classList.toggle("fa-moon", !oscuro);
  });
}

/* ══════════════════════════════════════
   🧠 INICIALIZACIÓN MATERIALIZE
═══════════════════════════════════════ */

function inicializarMaterialize() {
  const sidenavs = document.querySelectorAll(".sidenav");
  const tooltips = document.querySelectorAll(".tooltipped");
  const dropdowns = document.querySelectorAll(".dropdown-trigger");
  const selects = document.querySelectorAll("select");
  const collapsibles = document.querySelectorAll(".collapsible");

  M.Sidenav.init(sidenavs);
  M.Tooltip.init(tooltips);
  M.Dropdown.init(dropdowns, {
    constrainWidth: false,
    coverTrigger: false,
    alignment: "right",
  });
  M.Collapsible.init(collapsibles);
  M.FormSelect.init(selects);
}

/* ══════════════════════════════════════
   🛒 CONTADOR DE CARRITO
═══════════════════════════════════════ */

function actualizarContadorCarrito() {
  try {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    const total = carrito.reduce((acc, prod) => acc + (prod.cantidad || 0), 0);
    document.querySelectorAll("#contador-carrito").forEach(el => el.textContent = total);
  } catch (err) {
    console.error("❌ Error en contador de carrito:", err);
  }
}

/* ══════════════════════════════════════
   🔐 VISIBILIDAD Y MENÚ POR ROL
═══════════════════════════════════════ */

function gestionarVisibilidadMenus() {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const permisos = usuario?.permisos || {};
  const menuUsuario = document.getElementById("menu-usuario");
  const loginBtn = document.getElementById("menu-login");
  const registroBtn = document.getElementById("menu-registro");

  if (!token || !usuario) {
    if (loginBtn) loginBtn.style.display = "block";
    if (registroBtn) registroBtn.style.display = "block";
    return;
  }

  if (!menuUsuario) return;
  menuUsuario.innerHTML = "";

  const nombre = usuario.nombre || usuario.correo || "Usuario";
  const rol = (usuario.rol || "cliente").toLowerCase();
  const nivel = usuario.nivel || "Básico";
  const foto = usuario.fotoPerfil || "./imagenes/default_profile.png";

  const rolConfig = {
    admin: { color: "amber darken-2", icon: "fas fa-user-shield" },
    soporte: { color: "blue lighten-2", icon: "fas fa-headset" },
    vendedor: { color: "green lighten-2", icon: "fas fa-store" },
    cliente: { color: "grey lighten-1", icon: "fas fa-user" },
  };

  const rolColor = rolConfig[rol]?.color || "grey";
  const rolIcon = rolConfig[rol]?.icon || "fas fa-user";

  menuUsuario.innerHTML = `
    <li>
      <a class="dropdown-trigger tooltipped" href="#" data-target="dropdown-usuario" data-tooltip="${nombre}"
         style="display: flex; align-items: center; gap: 0.6rem;">
        <img src="${foto}" alt="Perfil" class="circle z-depth-2"
             style="width: 36px; height: 36px; object-fit: cover; border: 2px solid #555;" />
        <div style="display: flex; flex-direction: column; line-height: 1.2;">
          <span class="white-text" style="font-weight: 600; font-size: 0.95rem;">${nombre}</span>
          <span class="${rolColor} white-text badge z-depth-1"
                style="font-size: 0.75rem; padding: 2px 6px; border-radius: 6px;">
            <i class="${rolIcon}" style="margin-right: 4px;"></i>${rol.charAt(0).toUpperCase() + rol.slice(1)} — ${nivel}
          </span>
        </div>
        <i class="fas fa-caret-down right white-text"></i>
      </a>
    </li>
  `;

  const dropdown = document.createElement("ul");
  dropdown.id = "dropdown-usuario";
  dropdown.className = "dropdown-content glass-navbar z-depth-2";
  dropdown.setAttribute("role", "menu");

  dropdown.innerHTML = `
    <li><a href="perfil.html"><i class="fas fa-id-card" style="color:#4caf50;"></i> Perfil</a></li>
    ${permisos.admin ? `<li><a href="adminPanel.html"><i class="fas fa-cogs" style="color:#fbc02d;"></i> Panel Admin</a></li>` : ""}
    ${permisos.usuarios?.leer ? `<li><a href="usuarios.html"><i class="fas fa-users" style="color:#29b6f6;"></i> Usuarios</a></li>` : ""}
    ${permisos.configuracion?.leer ? `<li><a href="configuracion.html"><i class="fas fa-sliders-h" style="color:#ff8f00;"></i> Configuración</a></li>` : ""}
    ${permisos.reportes?.exportar ? `<li><a href="metricas.html"><i class="fas fa-chart-bar" style="color:#26a69a;"></i> Métricas</a></li>` : ""}
    ${permisos.pedidos?.leer ? `<li><a href="misPedidos.html"><i class="fas fa-box-open" style="color:#ffa000;"></i> Pedidos</a></li>` : ""}
    <li class="divider" tabindex="-1"></li>
    <li><a href="#" id="menu-logout"><i class="fas fa-sign-out-alt red-text"></i> Cerrar sesión</a></li>
  `;

  document.body.appendChild(dropdown);
  asignarLogout(["menu-logout"]);
  mostrarMenuPedidosSiSesionActiva();

  const usuarioDropdown = document.querySelector(".dropdown-trigger[data-target='dropdown-usuario']");
  if (usuarioDropdown) {
    M.Dropdown.init(usuarioDropdown, {
      constrainWidth: false,
      coverTrigger: false,
      alignment: "right",
      inDuration: 250,
      outDuration: 150,
      container: document.body
    });
  }
}

function mostrarMenuPedidosSiSesionActiva() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const permisos = usuario?.permisos || {};
  const puedeVerPedidos = permisos?.pedidos?.leer === true;

  const liNavbar = document.getElementById("nav-pedidos");
  const liSidenav = document.getElementById("sidenav-pedidos");

  if (puedeVerPedidos) {
    if (liNavbar) liNavbar.style.display = "flex";
    if (liSidenav) liSidenav.style.display = "block";
  } else {
    if (liNavbar) liNavbar.style.display = "none";
    if (liSidenav) liSidenav.style.display = "none";
  }
}

/* ══════════════════════════════════════
   🔓 CIERRE DE SESIÓN
═══════════════════════════════════════ */

function asignarLogout(ids) {
  const logout = () => {
    localStorage.clear();
    M.toast({
      html: "Sesión cerrada exitosamente",
      classes: "rounded amber darken-3",
    });
    window.location.href = "login.html";
  };

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.onclick = logout;
  });
}
