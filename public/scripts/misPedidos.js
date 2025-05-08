/**
 * 📦 misPedidos.js
 * 
 * Descripción:
 * Este archivo maneja la visualización de los pedidos de un usuario autenticado en TianguiStore. 
 * Permite cargar y mostrar los pedidos realizados por el usuario, con la opción de cancelar pedidos 
 * si se encuentran en un estado adecuado. Además, permite ver los productos asociados a cada pedido.
 * 
 * Funciones:
 * - Cargar y mostrar los pedidos del usuario.
 * - Ver productos de cada pedido.
 * - Permitir la cancelación de pedidos en estados específicos.
 * 
 * Autor: I.S.C. Erick Renato Vega Ceron
 * Fecha de Creación: Mayo 2025
 */

document.addEventListener("DOMContentLoaded", () => {
    cargarPedidosUsuario();
});

/**
 * 🛒 Función principal para cargar los pedidos del usuario desde la API
 * Esta función obtiene los pedidos del usuario y los muestra en una tabla.
 */
async function cargarPedidosUsuario() {
    const tabla = document.getElementById("tabla-pedidos");
    if (!tabla) return;

    try {
        const response = await fetch("/pedidos/mis", { credentials: "include" });
        if (!response.ok) throw new Error("No se pudieron obtener los pedidos.");
        
        const pedidos = await response.json();

        // Si no hay pedidos, mostrar mensaje
        if (pedidos.length === 0) {
            tabla.innerHTML = `<tr><td colspan="6" class="text-center text-muted">🛒 No tienes pedidos aún.</td></tr>`;
            return;
        }

        // Para cada pedido, se obtiene y muestra la información relevante
        for (const pedido of pedidos) {
            const productosHTML = await obtenerProductosHTML(pedido.pedido_id);
            const puedeCancelar = pedido.estado_id === 1 || pedido.estado_id === 2;

            const filaHTML = `
                <tr>
                    <td>#${pedido.pedido_id}</td>
                    <td>${new Date(pedido.fecha_pedido).toLocaleDateString()}</td>
                    <td>${pedido.estado_nombre}</td>
                    <td>${pedido.notas || "Sin notas"}</td>
                    <td>
                        <ul class="list-unstyled small">${productosHTML}</ul>
                    </td>
                    <td>
                        ${puedeCancelar
                            ? `<button class="btn btn-sm btn-danger" onclick="cancelarPedido(${pedido.pedido_id})">Cancelar</button>`
                            : `<span class="text-muted">No cancelable</span>`
                        }
                    </td>
                </tr>`;
                
            tabla.insertAdjacentHTML("beforeend", filaHTML);
        }
    } catch (error) {
        console.error("❌ Error al cargar pedidos:", error);
        tabla.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error al cargar tus pedidos. Intenta más tarde.</td></tr>`;
    }
}

/**
 * 🔍 Obtiene y muestra los productos asociados a un pedido.
 * Esta función se llama dentro de la función principal para mostrar la lista de productos por cada pedido.
 * 
 * @param {number} pedidoId - El ID del pedido cuyo listado de productos se quiere obtener.
 * @returns {string} - HTML con la lista de productos.
 */
async function obtenerProductosHTML(pedidoId) {
    try {
        const response = await fetch(`/pedidos/${pedidoId}/productos`, { credentials: "include" });
        if (!response.ok) throw new Error("No se pudieron obtener los productos.");

        const productos = await response.json();
        return productos.map(p => `<li>${p.nombre} (${p.cantidad})</li>`).join("");
    } catch (error) {
        console.error(`❌ Error al obtener productos del pedido ${pedidoId}:`, error);
        return `<li class="text-danger">Error al cargar productos</li>`;
    }
}

/**
 * 🚫 Función para cancelar un pedido, solo si se encuentra en un estado adecuado (estado_id 1 o 2).
 * Muestra un cuadro de confirmación antes de proceder con la cancelación del pedido.
 * 
 * @param {number} pedidoId - El ID del pedido que se desea cancelar.
 */
async function cancelarPedido(pedidoId) {
    const confirmar = confirm("¿Deseas cancelar este pedido?");
    if (!confirmar) return;

    try {
        const response = await fetch(`/pedidos/${pedidoId}/cancelar`, {
            method: "PUT",
            credentials: "include"
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Pedido cancelado correctamente.");
            location.reload();
        } else {
            alert(`❌ No se pudo cancelar el pedido: ${data.mensaje}`);
        }
    } catch (error) {
        console.error("❌ Error al cancelar pedido:", error);
        alert("Error inesperado al cancelar el pedido.");
    }
}
