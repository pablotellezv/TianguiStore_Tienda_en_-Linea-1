document.addEventListener("DOMContentLoaded", async () => {
    await cargarProductos();
    actualizarContadorCarrito(); // Asegurar que el contador del carrito se mantenga actualizado
});

// 📌 Cargar productos desde el backend
async function cargarProductos() {
    try {
        const response = await fetch("/productos");
        if (!response.ok) throw new Error("No se pudieron obtener los productos.");

        const productos = await response.json();
        const productosContainer = document.getElementById("productos-container");
        productosContainer.innerHTML = "";

        productos.forEach(producto => {
            const id = producto.producto_id;
            const nombre = producto.nombre || "Sin nombre";
            const precioNumerico = parseFloat(producto.precio) || 0;
            const existencias = producto.stock || 0;

            // ✅ Normalizar URL de imagen
            let imagenURL = (producto.imagen_url || "").replace(/\\/g, "/").replace(/^public/, "");
            if (!imagenURL.startsWith("/")) imagenURL = "/" + imagenURL;

            const productoHTML = `
                <div class="col">
                    <div class="card h-100 shadow-sm animate-fade-in">
                        <img src="${imagenURL}" class="card-img-top" alt="${nombre}" onerror="this.src='/imagenes/default.png'">
                        <div class="card-body">
                            <h5 class="card-title">${nombre}</h5>
                            <p class="card-text"><i class="fas fa-tag"></i> Precio: $${precioNumerico.toFixed(2)}</p>
                            <p class="card-text"><i class="fas fa-warehouse"></i> Existencias: ${existencias}</p>
                        </div>
                        <div class="card-footer text-center">
                            <button class="btn btn-primary agregar-carrito" data-id="${id}" data-nombre="${nombre}" data-precio="${precioNumerico}">
                                <i class="fas fa-cart-plus"></i> Agregar
                            </button>
                        </div>
                    </div>
                </div>
            `;
            productosContainer.innerHTML += productoHTML;
        });

        asignarEventosAgregar();
    } catch (error) {
        console.error("⚠️ Error al cargar productos:", error);
        document.getElementById("productos-container").innerHTML = "<p class='text-center text-danger'>❌ Error al cargar los productos.</p>";
    }
}

// 📌 Asignar eventos a los botones "Agregar al carrito"
function asignarEventosAgregar() {
    document.querySelectorAll(".agregar-carrito").forEach(boton => {
        boton.addEventListener("click", (event) => {
            const button = event.currentTarget;
            const id = button.dataset.id;
            const nombre = button.dataset.nombre;
            const precio = parseFloat(button.dataset.precio);

            agregarAlCarrito(id, nombre, precio);
        });
    });
}

// 📌 Agregar producto al carrito (almacenado en localStorage)
function agregarAlCarrito(id, nombre, precio) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const productoExistente = carrito.find(p => p.id === id);
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    mostrarToast(`🛒 ${nombre} agregado al carrito.`, "success");
}

// 📌 Actualizar contador del carrito
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    document.querySelectorAll("#contador-carrito").forEach(el => el.textContent = totalItems);
}

// 📌 Mostrar toast visual
function mostrarToast(mensaje, tipo) {
    const toastContainer = document.getElementById("toast-container") || crearContenedorToasts();
    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-white bg-${tipo} border-0 show`;
    toast.setAttribute("role", "alert");
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body fw-bold">${mensaje}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function crearContenedorToasts() {
    const div = document.createElement("div");
    div.id = "toast-container";
    div.className = "position-fixed bottom-0 end-0 p-3";
    div.style.zIndex = 1056;
    document.body.appendChild(div);
    return div;
}
