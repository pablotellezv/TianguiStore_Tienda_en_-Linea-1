document.addEventListener("DOMContentLoaded", async () => {
    try {
        // 🌐 Cargar Navbar
        const navbarContainer = document.getElementById("navbar-container");
        if (navbarContainer) {
            const navbarResponse = await fetch("./componentes/navbar.html");
            navbarContainer.innerHTML = await navbarResponse.text();
        }

        // 📦 Cargar Footer
        const footerContainer = document.getElementById("footer-container");
        if (footerContainer) {
            const footerResponse = await fetch("./componentes/footer.html");
            footerContainer.innerHTML = await footerResponse.text();
        }

        // 🧮 Actualizar contador del carrito
        actualizarContadorCarrito();

        // 🔐 Verificar sesión desde localStorage/JWT
        verificarSesion();

        // 🛒 Agregar dinámicamente el menú de productos si el usuario tiene permisos
        insertarMenuProductos();
    } catch (error) {
        console.error("⚠️ Error al cargar componentes:", error);
    }
});

// 📌 Actualizar contador de carrito
function actualizarContadorCarrito() {
    try {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        document.querySelectorAll("#contador-carrito").forEach(el => el.textContent = totalItems);
    } catch (error) {
        console.error("⚠️ Error al actualizar el contador del carrito:", error);
    }
}

// 📌 Verificar sesión y ajustar opciones de cuenta
function verificarSesion() {
    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    const usuarioInfo   = document.getElementById("usuario-info");
    const menuLogin     = document.getElementById("menu-login");
    const menuRegistro  = document.getElementById("menu-registro");
    const menuLogout    = document.getElementById("menu-logout");
    const btnCerrar     = document.getElementById("btnCerrarSesion");

    if (!usuarioInfo || !menuLogin || !menuRegistro || !menuLogout || !btnCerrar) {
        console.warn("⚠️ Elementos del navbar no encontrados.");
        return;
    }

    if (token && usuario) {
        console.log(`✅ Sesión activa para: ${usuario.correo}`);
        usuarioInfo.textContent = usuario.correo;
        menuLogin.classList.add("d-none");
        menuRegistro.classList.add("d-none");
        menuLogout.classList.remove("d-none");
    } else {
        console.log("🚫 No hay sesión activa.");
        usuarioInfo.textContent = "Cuenta";
        menuLogin.classList.remove("d-none");
        menuRegistro.classList.remove("d-none");
        menuLogout.classList.add("d-none");
    }

    // 🔓 Evento cerrar sesión
    btnCerrar.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        localStorage.removeItem("carrito");
        alert("Sesión cerrada exitosamente.");
        window.location.href = "login.html";
    });
}
//Menus dinámicos
function insertarMenusDinamicos() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const permisos = usuario?.permisos || {};
    if (!usuario || !usuario.rol) return;

    const navList = document.querySelector(".navbar-nav");
    const menuSesion = document.querySelector("#usuarioMenu")?.parentElement;

    if (!navList || !menuSesion) {
        console.warn("⚠️ No se pudo encontrar el contenedor de navegación.");
        return;
    }

    const crearMenu = (html) => {
        const item = document.createElement("li");
        item.className = "nav-item";
        item.innerHTML = html;
        navList.insertBefore(item, menuSesion);
    };

    const crearDropdown = (icono, titulo, items) => {
        const dropdown = document.createElement("li");
        dropdown.className = "nav-item dropdown";
        dropdown.innerHTML = `
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="${icono}"></i> ${titulo}
            </a>
            <ul class="dropdown-menu">${items}</ul>
        `;
        navList.insertBefore(dropdown, menuSesion);
    };

    // 🛍️ Menú de productos
    if (permisos.productos?.leer || permisos.productos?.crear) {
        crearDropdown("fas fa-box-open", "Productos", `
            ${permisos.productos?.leer ? '<li><a class="dropdown-item" href="productos.html"><i class="fas fa-eye"></i> Ver productos</a></li>' : ''}
            ${permisos.productos?.crear ? '<li><a class="dropdown-item" href="agregarProducto.html"><i class="fas fa-plus-circle"></i> Agregar producto</a></li>' : ''}
        `);
    }

    // 👥 Menú de usuarios
    if (permisos.usuarios?.leer) {
        crearMenu(`<a class="nav-link" href="#" onclick="mostrarSeccion('usuarios')"><i class="fas fa-users-cog"></i> Usuarios</a>`);
    }

    // 📦 Menú de pedidos
    if (permisos.pedidos?.leer) {
        crearMenu(`<a class="nav-link" href="#" onclick="mostrarSeccion('pedidos')"><i class="fas fa-receipt"></i> Pedidos</a>`);
    }

    // ⚙️ Configuración
    if (permisos.configuracion?.leer) {
        crearMenu(`<a class="nav-link" href="#" onclick="mostrarSeccion('configuracion')"><i class="fas fa-cogs"></i> Configuración</a>`);
    }

    // 📊 Métricas / reportes
    if (permisos.reportes?.exportar) {
        crearMenu(`<a class="nav-link" href="#" onclick="mostrarSeccion('metricas')"><i class="fas fa-chart-line"></i> Métricas</a>`);
    }

    // 🛠️ Acceso al panel general
    if (
        permisos.usuarios?.leer ||
        permisos.productos?.leer ||
        permisos.configuracion?.leer ||
        permisos.reportes?.exportar
    ) {
        crearMenu(`<a class="nav-link" href="adminPanel.html"><i class="fas fa-tools"></i> Panel Admin</a>`);
    }
}

