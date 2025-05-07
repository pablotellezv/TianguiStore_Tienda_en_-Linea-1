document.addEventListener("DOMContentLoaded", () => {
  cargarCategorias();
  cargarMarcas();
  configurarVistaPreviaImagenes();
  configurarVistaPreviaModelo3D();

  const form = document.getElementById("form-agregar-producto");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // 📦 Campos simples
    formData.append("nombre", document.getElementById("nombre").value.trim());
    formData.append("descripcion", document.getElementById("descripcion").value.trim());
    formData.append("precio", document.getElementById("precio").value);
    formData.append("stock", document.getElementById("stock").value);
    formData.append("categoria_id", document.getElementById("categoria_id").value);
    formData.append("marca_id", document.getElementById("marca_id").value);
    formData.append("tipo_pago", document.getElementById("tipo_pago").value);
    formData.append("publicado", document.getElementById("publicado").checked);
    formData.append("meses_sin_intereses", document.getElementById("meses_sin_intereses").checked);

    // 🖼️ Imágenes múltiples
    const imagenes = document.getElementById("imagenes").files;
    for (let i = 0; i < imagenes.length; i++) {
      formData.append("imagenes", imagenes[i]);
    }

    // 🧩 Modelo 3D (opcional)
    const modelo3d = document.getElementById("modelo3d").files[0];
    if (modelo3d) {
      formData.append("modelo3d", modelo3d);
    }

    try {
      const res = await fetch("/productos", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        mostrarToast("❌ Error: " + (data.message || "No se pudo guardar el producto."), "danger");
        return;
      }

      mostrarToast("✅ Producto guardado exitosamente.", "success");
      form.reset();
      document.getElementById("preview-imagenes").innerHTML = "";
      document.getElementById("preview-modelo3d").innerHTML = "";

    } catch (error) {
      console.error("Error al guardar producto:", error);
      mostrarToast("❌ Error de red o servidor.", "danger");
    }
  });
});

// 🔄 Cargar categorías desde API
async function cargarCategorias() {
  try {
    const res = await fetch("/categorias");
    const categorias = await res.json();
    const select = document.getElementById("categoria_id");
    select.innerHTML = '<option value="">Selecciona una categoría</option>';
    categorias.forEach(c => {
      const option = document.createElement("option");
      option.value = c.categoria_id;
      option.textContent = c.nombre;
      select.appendChild(option);
    });
  } catch {
    mostrarToast("⚠️ Error al cargar categorías.", "warning");
  }
}

// 🔄 Cargar marcas desde API
async function cargarMarcas() {
  try {
    const res = await fetch("/marcas");
    const marcas = await res.json();
    const select = document.getElementById("marca_id");
    select.innerHTML = '<option value="">Selecciona una marca</option>';
    marcas.forEach(m => {
      const option = document.createElement("option");
      option.value = m.marca_id;
      option.textContent = m.nombre;
      select.appendChild(option);
    });
  } catch {
    mostrarToast("⚠️ Error al cargar marcas.", "warning");
  }
}

// 🖼️ Vista previa de imágenes
function configurarVistaPreviaImagenes() {
  const input = document.getElementById("imagenes");
  const preview = document.getElementById("preview-imagenes");

  input.addEventListener("change", () => {
    preview.innerHTML = "";
    const archivos = input.files;
    for (let i = 0; i < archivos.length; i++) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.className = "img-thumbnail";
        img.style.height = "80px";
        img.style.marginRight = "10px";
        preview.appendChild(img);
      };
      reader.readAsDataURL(archivos[i]);
    }
  });
}

// 🔍 Vista previa de modelo 3D
function configurarVistaPreviaModelo3D() {
  const input = document.getElementById("modelo3d");
  const preview = document.getElementById("preview-modelo3d");

  input.addEventListener("change", () => {
    preview.innerHTML = "";
    const archivo = input.files[0];
    if (archivo && /\.(glb|gltf)$/i.test(archivo.name)) {
      const url = URL.createObjectURL(archivo);
      const modelViewer = document.createElement("model-viewer");
      modelViewer.setAttribute("src", url);
      modelViewer.setAttribute("camera-controls", "");
      modelViewer.setAttribute("auto-rotate", "");
      modelViewer.setAttribute("style", "width: 100%; height: 300px;");
      preview.appendChild(modelViewer);
    } else {
      preview.innerHTML = "<small class='text-muted'>Modelo no compatible para vista previa.</small>";
    }
  });
}

// 🔔 Toast visual reutilizable
function mostrarToast(mensaje, tipo = "success") {
  const toastContainer = document.getElementById("toast-container");
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
  setTimeout(() => toast.remove(), 4000);
}
