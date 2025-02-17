document.addEventListener("DOMContentLoaded", async () => {
    await cargarProductos();
    actualizarContadorCarrito(); // Asegurar que el contador del carrito se mantenga actualizado
});

// **📌 Cargar productos desde el backend**
async function cargarProductos() {
    try {
        const response = await fetch("http://localhost:3000/productos");
        if (!response.ok) throw new Error("No se pudieron obtener los productos.");

        const productos = await response.json();
        const productosContainer = document.getElementById("productos-container");
        productosContainer.innerHTML = ""; // Limpiar contenedor antes de insertar

        productos.forEach(producto => {
            // Asegurar que el precio es un número
            const precioNumerico = parseFloat(producto.producto_precio) || 0;

            const productoHTML = `
                <div class="col">
                    <div class="card h-100 shadow-sm animate-fade-in">
                        <img src="./imagenes/productos/${producto.id}.png" class="card-img-top" alt="${producto.producto_nombre}" onerror="this.src='./imagenes/default.png'">
                        <div class="card-body">
                            <h5 class="card-title">${producto.producto_nombre}</h5>
                            <p class="card-text"><i class="fas fa-tag"></i> Precio: $${precioNumerico.toFixed(2)}</p>
                            <p class="card-text"><i class="fas fa-warehouse"></i> Existencias: ${producto.producto_existencias}</p>
                        </div>
                        <div class="card-footer text-center">
                            <button class="btn btn-primary agregar-carrito" data-id="${producto.id}" data-nombre="${producto.producto_nombre}" data-precio="${precioNumerico}">
                                <i class="fas fa-cart-plus"></i> Agregar
                            </button>
                        </div>
                    </div>
                </div>
            `;
            productosContainer.innerHTML += productoHTML;
        });

        // Enlazar eventos después de insertar productos
        asignarEventosAgregar();
    } catch (error) {
        console.error("⚠️ Error al cargar productos:", error);
        document.getElementById("productos-container").innerHTML = "<p class='text-center text-danger'>❌ Error al cargar los productos.</p>";
    }
}

// **📌 Asignar eventos a los botones "Agregar al carrito"**
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

// **📌 Agregar producto al carrito (almacenado en `localStorage`)**
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

// **📌 Actualizar contador del carrito en el navbar**
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    document.querySelectorAll("#contador-carrito").forEach(el => el.textContent = totalItems);
}

// **📌 Mostrar toast de confirmación**
function mostrarToast(mensaje, tipo) {
    const toastContainer = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-white bg-${tipo} border-0 show`;
    toast.setAttribute("role", "alert");
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${mensaje}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
