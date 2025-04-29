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

// 🛒 Insertar menú de Productos para admin/vendedor
function insertarMenuProductos() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || !["admin", "vendedor"].includes(usuario.rol)) {
        return; // No autorizado
    }

    const navList = document.querySelector(".navbar-nav");
    if (!navList) {
        console.warn("⚠️ No se encontró .navbar-nav para insertar menú de productos.");
        return;
    }

    const menuProductos = document.createElement("li");
    menuProductos.className = "nav-item dropdown";
    menuProductos.innerHTML = `
        <a class="nav-link dropdown-toggle" href="#" id="navbarProductos" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="fas fa-box-open"></i> Productos
        </a>
        <ul class="dropdown-menu" aria-labelledby="navbarProductos">
            <li><a class="dropdown-item" href="productos.html"><i class="fas fa-eye"></i> Ver Productos</a></li>
            <li><a class="dropdown-item" href="agregarProducto.html"><i class="fas fa-plus-circle"></i> Agregar Producto</a></li>
        </ul>
    `;

    // Insertar el menú de Productos antes del menú de usuario ("Cuenta")
    const menuSesion = document.querySelector("#usuarioMenu")?.parentElement;
    if (menuSesion) {
        navList.insertBefore(menuProductos, menuSesion);
    } else {
        navList.appendChild(menuProductos); // fallback
    }
}
