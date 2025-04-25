document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Cargar pedidos del usuario
        const response = await fetch("/pedidos/mis", { credentials: "include" });
        const pedidos = await response.json();

        // Obtener contenedor de pedidos
        const tablaPedidos = document.getElementById("tabla-pedidos");

        if (pedidos.length === 0) {
            tablaPedidos.innerHTML = "<tr><td colspan='6' class='text-center'>No tienes pedidos aún.</td></tr>";
            return;
        }

        pedidos.forEach(async (pedido) => {
            // Cargar productos del pedido
            const productosResponse = await fetch(`/pedidos/${pedido.pedido_id}/productos`, { credentials: "include" });
            const productos = await productosResponse.json();

            let productosHTML = "";
            productos.forEach(producto => {
                productosHTML += `<li>${producto.nombre} - ${producto.cantidad} unidades</li>`;
            });

            // Insertar fila en la tabla
            const filaHTML = `
                <tr>
                    <td>${pedido.pedido_id}</td>
                    <td>${new Date(pedido.fecha_pedido).toLocaleDateString()}</td>
                    <td>${pedido.estado_nombre}</td>
                    <td>${pedido.notas || "N/A"}</td>
                    <td>
                        <ul class="list-unstyled">
                            ${productosHTML}
                        </ul>
                    </td>
                    <td>
                        ${pedido.estado_id === 1 || pedido.estado_id === 2 ? 
                            `<button class="btn btn-danger btn-sm" onclick="cancelarPedido(${pedido.pedido_id})">Cancelar</button>` : 
                            '<span class="text-muted">No se puede cancelar</span>'}
                    </td>
                </tr>
            `;
            tablaPedidos.innerHTML += filaHTML;
        });
    } catch (error) {
        console.error("Error al cargar los pedidos:", error);
        document.getElementById("tabla-pedidos").innerHTML = "<tr><td colspan='6' class='text-center text-danger'>Error al cargar los pedidos.</td></tr>";
    }
});

// Función para cancelar un pedido
async function cancelarPedido(pedidoId) {
    if (!confirm("¿Estás seguro de que deseas cancelar este pedido?")) return;

    try {
        const response = await fetch(`/pedidos/${pedidoId}/cancelar`, {
            method: "PUT",
            credentials: "include"
        });
        const data = await response.json();

        if (response.ok) {
            alert("✅ Pedido cancelado con éxito.");
            location.reload();
        } else {
            alert("❌ Error al cancelar el pedido: " + data.mensaje);
        }
    } catch (error) {
        console.error("Error al cancelar el pedido:", error);
        alert("❌ Error inesperado al intentar cancelar el pedido.");
    }
}
