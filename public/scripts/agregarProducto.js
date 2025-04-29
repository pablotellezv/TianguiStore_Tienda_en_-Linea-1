document.addEventListener("DOMContentLoaded", async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || !["admin", "vendedor"].includes(usuario.rol)) {
      window.location.href = "/index.html"; // No autorizado
      return;
    }
  
    await cargarSelects(); // Cargar marcas y categorías
  
    const form = document.getElementById("form-agregar-producto");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const datos = {
        nombre: document.getElementById("nombre").value.trim(),
        descripcion: document.getElementById("descripcion").value.trim(),
        precio: parseFloat(document.getElementById("precio").value),
        stock: parseInt(document.getElementById("stock").value),
        imagen_url: document.getElementById("imagen_url").value.trim(),
        categoria_id: parseInt(document.getElementById("categoria_id").value),
        marca_id: parseInt(document.getElementById("marca_id").value),
        publicado: document.getElementById("publicado").checked,
        meses_sin_intereses: document.getElementById("meses_sin_intereses").checked,
        tipo_pago: document.getElementById("tipo_pago").value,
      };
  
      // Validación básica
      if (!datos.nombre || !datos.descripcion || isNaN(datos.precio) || isNaN(datos.stock)) {
        mostrarToast("⚠️ Por favor completa todos los campos correctamente.");
        return;
      }
      if (datos.precio <= 0 || datos.stock < 0) {
        mostrarToast("❌ Precio o stock inválido.");
        return;
      }
  
      try {
        const res = await fetch("/productos/agregar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${usuario.token}`,
          },
          body: JSON.stringify(datos),
        });
  
        const respuesta = await res.json();
        if (res.ok) {
          mostrarToast("✅ Producto agregado correctamente.");
          form.reset();
        } else {
          mostrarToast("❌ " + (respuesta.message || "Error al agregar producto."));
        }
      } catch (error) {
        console.error("Error:", error);
        mostrarToast("❌ Error de red o del servidor.");
      }
    });
  });
  
  // 🔄 Cargar categorías y marcas desde backend
  async function cargarSelects() {
    try {
      const [categoriasRes, marcasRes] = await Promise.all([
        fetch("/categorias"),
        fetch("/marcas"),
      ]);
  
      const categorias = await categoriasRes.json();
      const marcas = await marcasRes.json();
  
      const catSelect = document.getElementById("categoria_id");
      categorias.forEach((cat) => {
        catSelect.innerHTML += `<option value="${cat.categoria_id}">${cat.nombre_categoria}</option>`;
      });
  
      const marcaSelect = document.getElementById("marca_id");
      marcas.forEach((marca) => {
        marcaSelect.innerHTML += `<option value="${marca.marca_id}">${marca.nombre_marca}</option>`;
      });
    } catch (err) {
      console.error("Error al cargar categorías o marcas:", err);
      mostrarToast("⚠️ Error al cargar categorías o marcas.");
    }
  }
  
  // 🔔 Mostrar toast
  function mostrarToast(mensaje) {
    const toastContainer = document.getElementById("toast-container");
    toastContainer.innerHTML = `
      <div class="toast align-items-center text-bg-dark border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">${mensaje}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    `;
  }
  