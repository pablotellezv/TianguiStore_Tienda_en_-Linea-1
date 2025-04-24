document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito();
    actualizarContadorCarrito();

    const btnPagar = document.getElementById("btnRealizarPedido");
    if (btnPagar) {
        btnPagar.addEventListener("click", realizarPedidoDesdeLocalStorage);
    }
});

// 📌 Mostrar productos en el carrito
function mostrarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const listaCarrito = document.getElementById("lista-carrito");
    const totalEtiqueta = document.getElementById("total_etiqueta");

    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<p class='text-center text-muted'>🛒 Tu carrito está vacío.</p>";
        totalEtiqueta.textContent = "Total: $0.00";
        return;
    }

    let total = 0;

    carrito.forEach(producto => {
        const precioNumerico = parseFloat(producto.precio) || 0;
        const subtotal = precioNumerico * producto.cantidad;
        total += subtotal;

        const itemHTML = `
            <li class="list-group-item d-flex align-items-center shadow-sm p-3 rounded">
                <img src="./imagenes/productos/${producto.id}.png" alt="${producto.nombre}" class="img-thumbnail me-3 rounded-circle" style="width: 60px; height: 60px; object-fit: cover;">
                <div class="flex-grow-1">
                    <h6 class="mb-1 text-primary fw-bold">${producto.nombre}</h6>
                    <small class="text-muted">Precio: <span class="text-dark fw-bold">$${precioNumerico.toFixed(2)}</span></small> |
                    <small class="text-muted">Subtotal: <span class="text-success fw-bold">$${subtotal.toFixed(2)}</span></small>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-outline-danger btn-sm disminuir-cantidad rounded-circle me-2" data-id="${producto.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="mx-2 cantidad-producto fw-bold text-dark">${producto.cantidad}</span>
                    <button class="btn btn-outline-success btn-sm aumentar-cantidad rounded-circle ms-2" data-id="${producto.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="btn btn-outline-danger btn-sm eliminar-producto ms-3 px-3 rounded-pill" data-id="${producto.id}">
                    <i class="fas fa-trash-alt"></i> Eliminar
                </button>
            </li>
        `;
        listaCarrito.innerHTML += itemHTML;
    });

    totalEtiqueta.textContent = `Total: $${total.toFixed(2)}`;

    // Eventos dinámicos
    document.querySelectorAll(".aumentar-cantidad").forEach(btn =>
        btn.addEventListener("click", e => modificarCantidad(e.currentTarget.dataset.id, 1)));

    document.querySelectorAll(".disminuir-cantidad").forEach(btn =>
        btn.addEventListener("click", e => modificarCantidad(e.currentTarget.dataset.id, -1)));

    document.querySelectorAll(".eliminar-producto").forEach(btn =>
        btn.addEventListener("click", e => eliminarProducto(e.currentTarget.dataset.id)));
}

// 📌 Modificar cantidad
function modificarCantidad(id, cambio) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const index = carrito.findIndex(p => p.id === id);
    if (index !== -1) {
        carrito[index].cantidad += cambio;
        if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
        actualizarContadorCarrito();
    }
}

// 📌 Eliminar producto
function eliminarProducto(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito = carrito.filter(p => p.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    actualizarContadorCarrito();
    mostrarToast("Producto eliminado del carrito.", "danger");
}

// 📌 Vaciar todo el carrito
document.getElementById("vaciar-carrito").addEventListener("click", () => {
    localStorage.removeItem("carrito");
    mostrarCarrito();
    actualizarContadorCarrito();
    mostrarToast("Carrito vaciado.", "warning");
});

// 📌 Actualizar contador visual del carrito
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    document.querySelectorAll("#contador-carrito").forEach(el => el.textContent = totalItems);
}

// 📌 Toast visual
function mostrarToast(mensaje, tipo = "success") {
    const toastContainer = document.getElementById("toast-container") || crearContenedorToasts();
    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-white bg-${tipo} border-0 show shadow`;
    toast.setAttribute("role", "alert");
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body fw-bold">${mensaje}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

function crearContenedorToasts() {
    const div = document.createElement("div");
    div.id = "toast-container";
    div.className = "position-fixed bottom-0 end-0 p-3";
    div.style.zIndex = 1056;
    document.body.appendChild(div);
    return div;
}

// 📌 Verificar stock antes de pagar
async function realizarPedidoDesdeLocalStorage() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const errores = [];

    for (const item of carrito) {
        try {
            const res = await fetch(`/productos/${item.id}`);
            if (!res.ok) throw new Error("No se pudo obtener producto");

            const producto = await res.json();
            if (item.cantidad > producto.stock) {
                errores.push(`"${producto.nombre}" tiene solo ${producto.stock} unidades disponibles.`);
            }
        } catch (error) {
            errores.push(`Error al verificar producto ID ${item.id}`);
        }
    }

    if (errores.length > 0) {
        alert("❌ No se puede procesar el pedido:\n" + errores.join("\n"));
        return;
    }

    const payload = {
        productos: carrito.map(p => ({
            producto_id: p.id,
            cantidad: p.cantidad,
            precio_unitario: parseFloat(p.precio)
        }))
    };

    try {
        const res = await fetch("/pedidos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.removeItem("carrito");
            mostrarCarrito();
            actualizarContadorCarrito();
            alert("✅ Pedido generado correctamente.");
        } else {
            alert("❌ Error al procesar pedido: " + data.mensaje);
        }

    } catch (error) {
        alert("❌ Error inesperado al generar pedido.");
        console.error(error);
    }
}
