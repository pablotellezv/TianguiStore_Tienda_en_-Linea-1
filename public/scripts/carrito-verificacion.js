// carrito-verificacion.js

const token = localStorage.getItem("token");

// 🔐 Función para obtener carrito desde el backend usando JWT
async function obtenerCarritoDesdeAPI() {
    const res = await fetch("http://localhost:3000/carrito", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error("No se pudo obtener el carrito");
    return await res.json();
}

// 🔍 Verificar disponibilidad de stock antes de enviar pedido
async function verificarStockAntesDeEnviar(carrito) {
    const errores = [];

    for (const item of carrito) {
        try {
            const respuesta = await fetch(`http://localhost:3000/productos/${item.producto_id}`);
            if (!respuesta.ok) throw new Error("No se pudo obtener producto");

            const producto = await respuesta.json();

            if (item.cantidad > producto.stock) {
                errores.push(`El producto "${producto.nombre}" solo tiene ${producto.stock} unidades disponibles.`);
            }
        } catch (error) {
            errores.push(`Error al verificar stock del producto ID ${item.producto_id}`);
        }
    }

    return errores;
}

// 🚀 Crear pedido desde el carrito si todo está en orden
async function realizarPedidoDesdeCarrito() {
    try {
        const carrito = await obtenerCarritoDesdeAPI();
        const errores = await verificarStockAntesDeEnviar(carrito);

        if (errores.length > 0) {
            alert("❌ No se puede procesar el pedido:\n" + errores.join("\n"));
            return;
        }

        const respuesta = await fetch("http://localhost:3000/pedidos/desde-carrito", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (respuesta.ok) {
            alert("✅ Pedido generado con éxito");
            window.location.reload();
        } else {
            const datos = await respuesta.json();
            alert("❌ Error al procesar pedido:\n" + datos.mensaje);
        }

    } catch (error) {
        console.error("❌ Error en la verificación del pedido:", error);
        alert("Error inesperado al intentar procesar el pedido.");
    }
}

// 🧩 Asociar evento al botón
document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("btnRealizarPedido");
    if (boton) {
        boton.addEventListener("click", realizarPedidoDesdeCarrito);
    }
});
