document.addEventListener("DOMContentLoaded", async () => {
    await cargarProductos();
    actualizarContadorCarrito();
});

// 📦 Cargar productos desde la API
async function cargarProductos() {
    const contenedor = document.getElementById("productos-container");
    if (!contenedor) return;

    try {
        const response = await fetch("/productos");
        if (!response.ok) throw new Error("No se pudo obtener el listado de productos.");

        const productos = await response.json();
        contenedor.innerHTML = "";

        productos.forEach(producto => {
            const id = producto.producto_id;
            const nombre = producto.nombre || "Producto sin nombre";
            const precio = parseFloat(producto.precio) || 0;
            const stock = producto.stock ?? 0;

            let imagen = (producto.imagen_url || "").replace(/\\/g, "/").replace(/^public/, "");
            if (!imagen.startsWith("/")) imagen = "/" + imagen;

            const html = `
                <div class="col">
                    <div class="card h-100 shadow-sm animate-fade-in">
                        <img src="${imagen}" alt="${nombre}" class="card-img-top"
                             onerror="this.onerror=null; this.src='/imagenes/default.png';">
                        <div class="card-body">
                            <h5 class="card-title">${nombre}</h5>
                            <p class="card-text"><i class="fas fa-tag"></i> Precio: $${precio.toFixed(2)}</p>
                            <p class="card-text"><i class="fas fa-warehouse"></i> Stock: ${stock}</p>
                        </div>
                        <div class="card-footer text-center">
                            <button class="btn btn-primary agregar-carrito"
                                data-id="${id}"
                                data-nombre="${nombre}"
                                data-precio="${precio}"
                                data-imagen="${imagen}">
                                <i class="fas fa-cart-plus"></i> Agregar
                            </button>
                        </div>
                    </div>
                </div>
            `;

            contenedor.insertAdjacentHTML("beforeend", html);
        });

        asignarEventosAgregar();
    } catch (error) {
        console.error("❌ Error al cargar productos:", error);
        contenedor.innerHTML = `<p class="text-danger text-center">No se pudieron cargar los productos.</p>`;
    }
}

// ➕ Agregar al carrito
function asignarEventosAgregar() {
    document.querySelectorAll(".agregar-carrito").forEach(btn => {
        btn.addEventListener("click", () => {
            const { id, nombre, precio, imagen } = btn.dataset;
            agregarAlCarrito(id, nombre, parseFloat(precio), imagen);
        });
    });
}

// 🛒 Agregar producto al carrito (localStorage)
function agregarAlCarrito(id, nombre, precio, imagen_url) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const producto = carrito.find(p => p.id === id);
    if (producto) {
        producto.cantidad++;
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1, imagen_url });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    mostrarToast(`🛒 ${nombre} agregado al carrito`, "success");
}

// 🔢 Actualiza el número en el icono del carrito
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((suma, p) => suma + p.cantidad, 0);
    document.querySelectorAll("#contador-carrito").forEach(el => el.textContent = total);
}

// 🔔 Toast personalizado
function mostrarToast(mensaje, tipo = "success") {
    const contenedor = document.getElementById("toast-container") || crearContenedorToasts();

    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-white bg-${tipo} border-0 show shadow mb-2`;
    toast.setAttribute("role", "alert");
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${mensaje}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
        </div>
    `;
    contenedor.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// 🧱 Contenedor de toasts (si no existe)
function crearContenedorToasts() {
    const div = document.createElement("div");
    div.id = "toast-container";
    div.className = "position-fixed bottom-0 end-0 p-3";
    div.style.zIndex = 1056;
    document.body.appendChild(div);
    return div;
}
