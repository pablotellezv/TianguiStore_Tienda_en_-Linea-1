document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Cargar Navbar
        const navbarContainer = document.getElementById("navbar-container");
        if (navbarContainer) {
            const navbarResponse = await fetch("./componentes/navbar.html");
            navbarContainer.innerHTML = await navbarResponse.text();
        }

        // Cargar Footer
        const footerContainer = document.getElementById("footer-container");
        if (footerContainer) {
            const footerResponse = await fetch("./componentes/footer.html");
            footerContainer.innerHTML = await footerResponse.text();
        }

        // Verificar sesión después de cargar los componentes
        verificarSesion();
    } catch (error) {
        console.error("⚠️ Error al cargar componentes:", error);
    }
});

// **📌 Verificar sesión del usuario**
async function verificarSesion() {
    try {
        const response = await fetch("http://localhost:3000/auth/sesion");
        const data = await response.json();

        // Obtener elementos del Navbar
        const usuarioInfo = document.getElementById("usuario-info");
        const menuLogin = document.getElementById("menu-login");
        const menuRegistro = document.getElementById("menu-registro");
        const menuLogout = document.getElementById("menu-logout");
        const btnCerrarSesion = document.getElementById("btnCerrarSesion");

        if (!usuarioInfo || !menuLogin || !menuRegistro || !menuLogout || !btnCerrarSesion) {
            console.warn("⚠️ Elementos del navbar no encontrados en el DOM.");
            return;
        }

        if (data.autenticado && data.usuario) {
            console.log(`✅ Sesión activa para: ${data.usuario.correo}`);
            usuarioInfo.innerHTML = ` ${data.usuario.correo}`;
            menuLogin.classList.add("d-none");
            menuRegistro.classList.add("d-none");
            menuLogout.classList.remove("d-none");
        } else {
            console.log("🚫 No hay sesión activa.");
            usuarioInfo.innerHTML = "Cuenta";
            menuLogin.classList.remove("d-none");
            menuRegistro.classList.remove("d-none");
            menuLogout.classList.add("d-none");
        }

        // **Evento para cerrar sesión**
        btnCerrarSesion.addEventListener("click", async function () {
            try {
                const logoutResponse = await fetch("http://localhost:3000/auth/logout", { method: "POST" });
                const logoutData = await logoutResponse.json();
                console.log("🔒 Sesión cerrada:", logoutData.mensaje);

                // Mostrar mensaje y redirigir
                alert("Sesión cerrada exitosamente.");
                window.location.href = "login.html";
            } catch (error) {
                console.error("⚠️ Error al cerrar sesión:", error);
                alert("Error al cerrar sesión.");
            }
        });

    } catch (error) {
        console.error("⚠️ Error al verificar sesión:", error);
    }
}
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Cargar Navbar
        const navbarContainer = document.getElementById("navbar-container");
        if (navbarContainer) {
            const navbarResponse = await fetch("./componentes/navbar.html");
            navbarContainer.innerHTML = await navbarResponse.text();
        }

        // Cargar Footer
        const footerContainer = document.getElementById("footer-container");
        if (footerContainer) {
            const footerResponse = await fetch("./componentes/footer.html");
            footerContainer.innerHTML = await footerResponse.text();
        }

        // **Actualizar contador del carrito al cargar la página**
        actualizarContadorCarrito();

        // Verificar sesión después de cargar los componentes
        verificarSesion();
    } catch (error) {
        console.error("⚠️ Error al cargar componentes:", error);
    }
});

// **📌 Actualizar contador del carrito globalmente**
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    document.getElementById("contador-carrito").textContent = totalItems;
}

