/**
 * 📦 productos.js
 * 
 * Descripción:
 * Este archivo contiene la lógica para mostrar los productos en TianguiStore. 
 * Carga los productos desde la API y los muestra en una tarjeta para que el usuario pueda ver la información del producto y agregarlo al carrito.
 * También maneja el almacenamiento del carrito en el localStorage y actualiza el contador del carrito.
 * 
 * Funciones:
 * - Cargar los productos desde la API.
 * - Mostrar los productos en tarjetas con su información.
 * - Agregar productos al carrito (almacenados en localStorage).
 * - Actualizar el contador del carrito globalmente.
 * 
 * Autor: I.S.C. Erick Renato Vega Ceron
 * Fecha de Creación: Mayo 2025
 */

document.addEventListener("DOMContentLoaded", async () => {
    await cargarProductos();
    actualizarContadorCarrito();
});

/**
 * 📦 Cargar productos desde la API y mostrarlos en la interfaz
 * Esta función obtiene los productos desde el backend y los agrega a la interfaz en forma de tarjetas.
 */
async function cargarProductos() {
    const contenedor = document.getElementById("productos-container");
    if (!contenedor) return;

    try {
        const response = await fetch("/productos");
        if (!response.ok) throw new Error("No se pudo obtener el listado de productos.");

        const productos = await response.json();
        contenedor.innerHTML = "";

        // Mostrar cada producto en una tarjeta
        productos.forEach(producto => {
            const id = producto.producto_id;
            const nombre = producto.nombre || "Producto sin nombre";
            const precio = parseFloat(producto.precio) || 0;
            const stock = producto.stock ?? 0;

            // Manejo de imagen del producto
            let imagen = (producto.imagen_url || "").replace(/\\/g, "/").replace(/^public/, "");
            if (!imagen.startsWith("/")) imagen = "/" + imagen;

            // HTML para la tarjeta del producto
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

        // Asignar eventos para los botones de "Agregar al carrito"
        asignarEventosAgregar();
    } catch (error) {
        console.error("❌ Error al cargar productos:", error);
        contenedor.innerHTML = `<p class="text-danger text-center">No se pudieron cargar los productos.</p>`;
    }
}

/**
 * ➕ Asigna eventos a los botones de "Agregar al carrito"
 * Esta función asigna un evento a cada botón "Agregar al carrito" para que al hacer clic se agregue el producto correspondiente.
 */
function asignarEventosAgregar() {
    document.querySelectorAll(".agregar-carrito").forEach(btn => {
        btn.addEventListener("click", () => {
            const { id, nombre, precio, imagen } = btn.dataset;
            agregarAlCarrito(id, nombre, parseFloat(precio), imagen);
        });
    });
}

/**
 * 🛒 Agregar producto al carrito (localStorage)
 * Esta función agrega un producto al carrito en el almacenamiento local, aumentando su cantidad si ya existe en el carrito.
 * 
 * @param {string} id - El ID del producto.
 * @param {string} nombre - El nombre del producto.
 * @param {number} precio - El precio del producto.
 * @param {string} imagen_url - La URL de la imagen del producto.
 */
function agregarAlCarrito(id, nombre, precio, imagen_url) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Buscar si el producto ya está en el carrito
    const producto = carrito.find(p => p.id === id);
    if (producto) {
        producto.cantidad++; // Si ya está en el carrito, incrementar la cantidad
    } else {
        // Si no está en el carrito, agregarlo con cantidad 1
        carrito.push({ id, nombre, precio, cantidad: 1, imagen_url });
    }

    // Guardar el carrito actualizado en el localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Actualizar el contador del carrito en la interfaz
    actualizarContadorCarrito();

    // Mostrar un mensaje de éxito (Toast)
    mostrarToast(`🛒 ${nombre} agregado al carrito`, "success");
}

/**
 * 🔢 Actualiza el número en el icono del carrito
 * Esta función se encarga de actualizar el contador global del carrito en la interfaz.
 */
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((suma, p) => suma + p.cantidad, 0); // Contar la cantidad total de productos
    document.querySelectorAll("#contador-carrito").forEach(el => el.textContent = total); // Actualizar el contador
}

/**
 * 🔔 Muestra un mensaje de toast personalizado
 * Esta función muestra un toast flotante en la pantalla con un mensaje.
 * 
 * @param {string} mensaje - El mensaje que se desea mostrar.
 * @param {string} tipo - El tipo de toast ("success", "danger", etc.).
 */
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
    setTimeout(() => toast.remove(), 3000); // Eliminar el toast después de 3 segundos
}

/**
 * 🧱 Crea el contenedor para los toasts si no existe.
 * Esta función crea un contenedor para los toasts flotantes si aún no ha sido creado.
 * 
 * @returns {HTMLElement} - El contenedor de los toasts.
 */
function crearContenedorToasts() {
    const div = document.createElement("div");
    div.id = "toast-container";
    div.className = "position-fixed bottom-0 end-0 p-3";
    div.style.zIndex = 1056;
    document.body.appendChild(div);
    return div;
}
