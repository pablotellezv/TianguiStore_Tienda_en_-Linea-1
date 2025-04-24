
// carrito-verificacion.js

async function obtenerCarritoDesdeSession() {
    const res = await fetch("/carrito", { credentials: "include" });
    if (!res.ok) throw new Error("No se pudo obtener el carrito");
    return await res.json();
}

async function verificarStockAntesDeEnviar(carrito) {
    const errores = [];

    for (const item of carrito) {
        try {
            const respuesta = await fetch(`/productos/${item.producto_id}`);
            if (!respuesta.ok) throw new Error("No se pudo obtener producto");

            const producto = await respuesta.json();

            if (item.cantidad > producto.stock) {
                errores.push(
                    `El producto "${producto.nombre}" solo tiene ${producto.stock} unidades disponibles.`
                );
            }
        } catch (error) {
            errores.push(`Error al verificar stock de producto ID ${item.producto_id}`);
        }
    }

    return errores;
}

async function realizarPedidoDesdeCarrito() {
    try {
        const carrito = await obtenerCarritoDesdeSession();
        const errores = await verificarStockAntesDeEnviar(carrito);

        if (errores.length > 0) {
            alert("❌ No se puede procesar el pedido:\n" + errores.join("\n"));
            return;
        }

        const respuesta = await fetch("/pedidos/desde-carrito", {
            method: "POST",
            credentials: "include"
        });

        if (respuesta.ok) {
            alert("✅ Pedido generado con éxito");
            location.reload();
        } else {
            const datos = await respuesta.json();
            alert("❌ Error al procesar pedido:\n" + datos.mensaje);
        }

    } catch (error) {
        console.error("❌ Error en la verificación del pedido:", error);
        alert("Error inesperado al intentar procesar el pedido.");
    }
}

// Ejemplo: conectar a un botón con ID "btnRealizarPedido"
document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("btnRealizarPedido");
    if (boton) {
        boton.addEventListener("click", realizarPedidoDesdeCarrito);
    }
});
