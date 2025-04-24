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

        // 🧮 Actualizar contador de carrito
        actualizarContadorCarrito();

        // 🔐 Verificar sesión después de cargar componentes
        verificarSesion();
    } catch (error) {
        console.error("⚠️ Error al cargar componentes:", error);
    }
});

// 📌 Actualizar el contador del carrito desde localStorage
function actualizarContadorCarrito() {
    try {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        document.querySelectorAll("#contador-carrito").forEach(el => el.textContent = totalItems);
    } catch (error) {
        console.error("⚠️ Error al actualizar el contador del carrito:", error);
    }
}

// 📌 Verificar sesión del usuario (y gestionar UI del navbar)
async function verificarSesion() {
    try {
        const response = await fetch("/auth/sesion", { credentials: "include" });
        const data = await response.json();

        const usuarioInfo   = document.getElementById("usuario-info");
        const menuLogin     = document.getElementById("menu-login");
        const menuRegistro  = document.getElementById("menu-registro");
        const menuLogout    = document.getElementById("menu-logout");
        const btnCerrar     = document.getElementById("btnCerrarSesion");

        if (!usuarioInfo || !menuLogin || !menuRegistro || !menuLogout || !btnCerrar) {
            console.warn("⚠️ Elementos del navbar no encontrados.");
            return;
        }

        if (data.autenticado && data.usuario) {
            console.log(`✅ Sesión activa para: ${data.usuario.correo}`);
            usuarioInfo.textContent = data.usuario.correo;
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

        // 🔓 Evento para cerrar sesión
        btnCerrar.addEventListener("click", async () => {
            try {
                const res = await fetch("/auth/logout", { method: "POST", credentials: "include" });
                const data = await res.json();
                console.log("🔒 Sesión cerrada:", data.mensaje);

                alert("Sesión cerrada exitosamente.");
                localStorage.removeItem("carrito");
                window.location.href = "login.html";
            } catch (err) {
                console.error("⚠️ Error al cerrar sesión:", err);
                alert("No se pudo cerrar sesión.");
            }
        });

    } catch (error) {
        console.error("⚠️ Error al verificar sesión:", error);
    }
}
