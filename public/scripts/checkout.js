document.addEventListener("DOMContentLoaded", () => {
  const formEnvio = document.getElementById("form-envio");

  if (!formEnvio) return;

  formEnvio.addEventListener("submit", async (event) => {
    event.preventDefault();

    const direccion = document.getElementById("direccion").value.trim();
    const metodo_pago = document.getElementById("metodo_pago").value;
    const comentarios = document.getElementById("comentarios").value.trim();

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const token = localStorage.getItem("token");
    const validado = localStorage.getItem("checkout_validado");

    // Validaciones
    if (!direccion || direccion.length < 5) {
      M.toast({ html: "📍 Ingresa una dirección válida.", classes: "orange darken-2" });
      return;
    }

    if (!metodo_pago) {
      M.toast({ html: "💳 Selecciona un método de pago.", classes: "orange darken-2" });
      return;
    }

    if (carrito.length === 0) {
      M.toast({ html: "🛒 Tu carrito está vacío.", classes: "red darken-2" });
      return;
    }

    if (!token) {
      M.toast({ html: "🔒 Debes iniciar sesión.", classes: "red darken-2" });
      return;
    }

    if (validado !== "true") {
      M.toast({ html: "⚠️ No se ha validado el stock. Vuelve al carrito y verifica antes de continuar.", classes: "orange darken-4" });
      return;
    }

    // Calcular total
    const total = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);

    // Preparar productos
    const productos = carrito.map(p => ({
      producto_id: p.id || p.producto_id,
      cantidad: p.cantidad,
      precio_unitario: parseFloat(p.precio)
    }));

    // Validación interna
    if (productos.some(p => !p.producto_id || !p.cantidad || isNaN(p.precio_unitario))) {
      M.toast({ html: "❌ El carrito contiene productos inválidos.", classes: "red darken-3" });
      return;
    }

    try {
      const respuesta = await fetch("/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          direccion_envio: direccion,
          metodo_pago,
          comentarios,
          total,
          productos
        })
      });

      const resultado = await respuesta.json();

      if (respuesta.ok) {
        M.toast({ html: "✅ Pedido realizado correctamente", classes: "teal darken-2" });
        localStorage.removeItem("carrito");
        localStorage.removeItem("checkout_validado");

        setTimeout(() => {
          window.location.href = "/misPedidos.html";
        }, 1500);
      } else {
        const msg = resultado?.mensaje || "❌ Error inesperado del servidor.";
        M.toast({ html: msg, classes: "red darken-3" });
      }

    } catch (error) {
      console.error("❌ Error al enviar pedido:", error);
      M.toast({ html: "❌ No se pudo conectar con el servidor.", classes: "red darken-3" });
    }
  });
});
