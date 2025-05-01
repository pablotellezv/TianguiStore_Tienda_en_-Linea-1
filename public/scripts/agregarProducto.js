document.addEventListener("DOMContentLoaded", async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario || !["admin", "vendedor"].includes(usuario.rol)) {
    window.location.href = "/index.html";
    return;
  }

  await cargarSelects();

  const form = document.getElementById("form-agregar-producto");
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", document.getElementById("nombre").value.trim());
    formData.append("descripcion", document.getElementById("descripcion").value.trim());
    formData.append("precio", document.getElementById("precio").value);
    formData.append("stock", document.getElementById("stock").value);
    formData.append("categoria_id", document.getElementById("categoria_id").value);
    formData.append("marca_id", document.getElementById("marca_id").value);
    formData.append("tipo_pago", document.getElementById("tipo_pago").value);
    formData.append("publicado", document.getElementById("publicado").checked);
    formData.append("meses_sin_intereses", document.getElementById("meses_sin_intereses").checked);

    // Imágenes
    const imagenes = document.getElementById("imagenes").files;
    if (imagenes.length === 0) {
      mostrarToast("⚠️ Debes seleccionar al menos una imagen del producto.", "warning");
      return;
    }

    for (let i = 0; i < imagenes.length; i++) {
      const archivo = imagenes[i];
      if (!archivo.type.startsWith("image/")) {
        mostrarToast("❌ Solo se permiten archivos de imagen.", "danger");
        return;
      }
      formData.append("imagenes", archivo);
    }

    // Modelo 3D (opcional)
    const modelo3d = document.getElementById("modelo3d").files[0];
    if (modelo3d) {
      formData.append("modelo3d", modelo3d);
    }

    bloquearFormulario(true, submitBtn);

    try {
      const res = await fetch("/productos/agregar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${usuario.token}`,
        },
        body: formData,
      });

      const respuesta = await res.json();

      if (res.ok) {
        mostrarToast("✅ Producto agregado correctamente.", "success");
        form.reset();
        document.getElementById("preview-imagenes").innerHTML = "";
        document.getElementById("preview-modelo3d").innerHTML = "";
      } else {
        mostrarToast(`❌ ${respuesta.message || "Error al agregar producto."}`, "danger");
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      mostrarToast("❌ Error de red o del servidor.", "danger");
    } finally {
      bloquearFormulario(false, submitBtn);
    }
  });

  // Previsualizar imágenes seleccionadas
  document.getElementById("imagenes").addEventListener("change", () => {
    const preview = document.getElementById("preview-imagenes");
    preview.innerHTML = "";
    const archivos = [...document.getElementById("imagenes").files];

    archivos.forEach(file => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = e => {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.style.width = "80px";
        img.style.height = "80px";
        img.classList.add("rounded", "border");
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  });

  // Previsualizar modelo 3D
  document.getElementById("modelo3d").addEventListener("change", () => {
    const file = document.getElementById("modelo3d").files[0];
    const preview = document.getElementById("preview-modelo3d");
    preview.innerHTML = "";

    if (file && /\.(glb|gltf)$/i.test(file.name)) {
      const url = URL.createObjectURL(file);
      preview.innerHTML = `
        <model-viewer src="${url}" alt="Modelo 3D" camera-controls auto-rotate ar style="width: 300px; height: 300px;"></model-viewer>
      `;
    } else if (file) {
      preview.textContent = "⚠️ Este formato no se puede previsualizar aquí. Usa .glb o .gltf si deseas vista previa.";
    }
  });
});

// 🔒 Bloquear/desbloquear todos los campos del formulario
function bloquearFormulario(bloquear, btn) {
  const inputs = document.querySelectorAll("#form-agregar-producto input, textarea, select, button");
  inputs.forEach(el => el.disabled = bloquear);
  btn.innerHTML = bloquear
    ? `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Guardando...`
    : `<i class="fas fa-save me-2"></i>Guardar Producto`;
}

// 🔄 Cargar select de categorías y marcas
async function cargarSelects() {
  try {
    const [resCategorias, resMarcas] = await Promise.all([
      fetch("/categorias"),
      fetch("/marcas"),
    ]);

    const categorias = await resCategorias.json();
    const marcas = await resMarcas.json();

    const catSelect = document.getElementById("categoria_id");
    const marcaSelect = document.getElementById("marca_id");

    catSelect.innerHTML = '<option value="" disabled selected>Selecciona una categoría</option>';
    categorias.sort((a, b) => a.nombre_categoria.localeCompare(b.nombre_categoria)).forEach(c =>
      catSelect.innerHTML += `<option value="${c.categoria_id}">${c.nombre_categoria}</option>`
    );

    marcaSelect.innerHTML = '<option value="" disabled selected>Selecciona una marca</option>';
    marcas.sort((a, b) => a.nombre_marca.localeCompare(b.nombre_marca)).forEach(m =>
      marcaSelect.innerHTML += `<option value="${m.marca_id}">${m.nombre_marca}</option>`
    );

  } catch (error) {
    console.error("Error al cargar categorías o marcas:", error);
    mostrarToast("⚠️ Error al cargar categorías o marcas.", "warning");
  }
}

// 🔔 Mostrar toast mejorado con animación
function mostrarToast(mensaje, tipo = "info") {
  const toastContainer = document.getElementById("toast-container");
  const tipoClase = {
    success: "bg-success",
    danger: "bg-danger",
    warning: "bg-warning text-dark",
    info: "bg-dark",
  }[tipo] || "bg-dark";

  const toastId = `toast-${Date.now()}`;

  const toastHTML = `
    <div id="${toastId}" class="toast align-items-center ${tipoClase} text-white border-0 fade show mb-2" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">${mensaje}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
      </div>
    </div>
  `;

  toastContainer.insertAdjacentHTML("beforeend", toastHTML);

  setTimeout(() => {
    const toast = document.getElementById(toastId);
    if (toast) toast.classList.remove("show");
  }, 3500);
}
