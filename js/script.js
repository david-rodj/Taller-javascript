// Array para almacenar los productos del carrito
let carritoCompras = [];
let cartVisible = false;
let hoverTimeout;

/**
 * Inicializa todos los eventos cuando el DOM está cargado
 */
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM cargado, inicializando aplicación...");
  inicializarEventos();
});

/**
 * Inicializa todos los eventos de la aplicación
 */
function inicializarEventos() {
  // Eventos del carrito
  inicializarEventosCarrito();

  // Eventos de los productos
  inicializarEventosProductos();

  // Eventos del formulario
  inicializarEventosFormulario();

  console.log("Todos los eventos inicializados correctamente");
}

/**
 * Inicializa los eventos relacionados con el carrito
 */
function inicializarEventosCarrito() {
  const cartIcon = document.getElementById("cart-icon");
  const cartDropdown = document.getElementById("cart-dropdown");
  const cartOverlay = document.getElementById("cart-overlay");
  const emptyCartBtn = document.getElementById("empty-cart-btn");

  if (!cartIcon || !cartDropdown) {
    console.error("Elementos del carrito no encontrados");
    return;
  }

  // Evento hover para mostrar carrito
  cartIcon.addEventListener("mouseenter", function () {
    console.log("Mouse entró al ícono del carrito");
    if (carritoCompras.length > 0) {
      clearTimeout(hoverTimeout);
      mostrarCarrito();
    }
  });

  cartIcon.addEventListener("mouseleave", function () {
    console.log("Mouse salió del ícono del carrito");
    hoverTimeout = setTimeout(() => {
      if (!cartDropdown.matches(":hover")) {
        ocultarCarrito();
      }
    }, 600);
  });

  // Evento click para alternar carrito
  cartIcon.addEventListener("click", function (e) {
    e.preventDefault();
    console.log("Click en ícono del carrito");
    if (carritoCompras.length > 0) {
      if (cartVisible) {
        ocultarCarrito();
      } else {
        mostrarCarrito();
      }
    }
  });

  // Mantener carrito visible en hover
  cartDropdown.addEventListener("mouseenter", function () {
    clearTimeout(hoverTimeout);
  });

  cartDropdown.addEventListener("mouseleave", function () {
    hoverTimeout = setTimeout(() => {
      ocultarCarrito();
    }, 1000);
  });

  // Cerrar carrito al hacer click en overlay
  cartOverlay.addEventListener("click", function () {
    ocultarCarrito();
  });

  // Botón vaciar carrito
  if (emptyCartBtn) {
    emptyCartBtn.addEventListener("click", vaciarCarritoCompras);
  }

  console.log("Eventos del carrito configurados");
}

/**
 * Inicializa los eventos de los productos existentes
 */
function inicializarEventosProductos() {
  const botonesCompra = document.querySelectorAll(".add-to-cart");
  console.log(`Configurando ${botonesCompra.length} botones de compra`);

  botonesCompra.forEach((boton, index) => {
    boton.addEventListener("click", function (e) {
      e.preventDefault();
      console.log(`Botón ${index + 1} clickeado`);
      agregarArticuloAlCarrito(this);
    });
  });
}

/**
 * Inicializa los eventos del formulario
 */
function inicializarEventosFormulario() {
  const formulario = document.getElementById("product-form");

  if (formulario) {
    formulario.addEventListener("submit", function (e) {
      e.preventDefault();
      procesarNuevoProducto(this);
    });
    console.log("Eventos del formulario configurados");
  }
}

/**
 * Muestra el carrito de compras
 */
function mostrarCarrito() {
  const cartDropdown = document.getElementById("cart-dropdown");
  const cartOverlay = document.getElementById("cart-overlay");

  cartDropdown.classList.add("show");
  cartOverlay.classList.add("show");
  cartVisible = true;
  console.log("Carrito mostrado");
}

/**
 * Oculta el carrito de compras
 */
function ocultarCarrito() {
  const cartDropdown = document.getElementById("cart-dropdown");
  const cartOverlay = document.getElementById("cart-overlay");

  cartDropdown.classList.remove("show");
  cartOverlay.classList.remove("show");
  cartVisible = false;
  console.log("Carrito ocultado");
}

/**
 * Agrega un artículo al carrito de compras
 */
function agregarArticuloAlCarrito(botonCompra) {
  console.log("Agregando artículo al carrito...");

  const tarjetaProducto = botonCompra.closest(".card");
  const informacionProducto = extraerInformacionProducto(tarjetaProducto);

  // Buscar si el artículo ya existe en el carrito
  const articuloExistente = carritoCompras.find(
    (articulo) => articulo.nombre === informacionProducto.nombre
  );

  if (articuloExistente) {
    articuloExistente.cantidad += 1;
    console.log(
      "Producto existente, nueva cantidad:",
      articuloExistente.cantidad
    );
  } else {
    carritoCompras.push({
      ...informacionProducto,
      cantidad: 1,
    });
    console.log("Nuevo producto agregado al carrito");
  }

  console.log("Estado actual del carrito:", carritoCompras);
  actualizarVisualizacionCarrito();

  // Mostrar feedback visual
  mostrarFeedbackAgregado(botonCompra);
}

/**
 * Extrae información del producto de la tarjeta HTML
 */
function extraerInformacionProducto(tarjeta) {
  const nombre = tarjeta.querySelector(".card-title").textContent.trim();
  const imagenElemento = tarjeta.querySelector(".card-img-top");
  const imagen = imagenElemento.src;

  const elementosPrecio = tarjeta.querySelectorAll(".card-text");
  let precio = 0;

  for (let elemento of elementosPrecio) {
    if (elemento.textContent.includes("Precio:")) {
      const textoCompleto = elemento.textContent;
      const coincidenciaPrecio = textoCompleto.match(/\$(\d+)/);
      if (coincidenciaPrecio) {
        precio = parseInt(coincidenciaPrecio[1]);
      }
      break;
    }
  }

  return { nombre, precio, imagen };
}

/**
 * Actualiza la visualización del carrito
 */
function actualizarVisualizacionCarrito() {
  console.log("Actualizando visualización del carrito...");

  const contenedorArticulos = document.getElementById("cart-items");
  const cartBadge = document.getElementById("cart-badge");
  const cartTotal = document.getElementById("cart-total");

  if (!contenedorArticulos) return;

  // Actualizar badge
  const totalItems = carritoCompras.reduce(
    (sum, item) => sum + item.cantidad,
    0
  );
  if (cartBadge) {
    if (totalItems > 0) {
      cartBadge.textContent = totalItems;
      cartBadge.style.display = "flex";
    } else {
      cartBadge.style.display = "none";
    }
  }

  if (carritoCompras.length === 0) {
    contenedorArticulos.innerHTML =
      '<p class="text-muted mb-0">El carrito está vacío</p>';
    if (cartTotal) cartTotal.textContent = "$0";
    return;
  }

  // Construir tabla del carrito
  let htmlCarrito = `
              <table class="table table-sm mb-0">
                  <thead>
                      <tr>
                          <th style="width: 60px;">Imagen</th>
                          <th>Nombre</th>
                          <th>Precio</th>
                          <th style="width: 80px;">Cantidad</th>
                          <th style="width: 40px;"></th>
                      </tr>
                  </thead>
                  <tbody>
          `;

  let total = 0;
  carritoCompras.forEach((articulo, index) => {
    const subtotal = articulo.precio * articulo.cantidad;
    total += subtotal;

    htmlCarrito += `
                  <tr>
                      <td>
                          <img src="${articulo.imagen}" 
                               alt="${articulo.nombre}" 
                               style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;"
                               onerror="this.src='https://via.placeholder.com/40x40?text=?'">
                      </td>
                      <td class="align-middle" style="font-size: 0.85rem;">${
                        articulo.nombre
                      }</td>
                      <td class="align-middle" style="font-size: 0.85rem;">${articulo.precio.toLocaleString()}</td>
                      <td class="align-middle text-center" style="font-size: 0.85rem;">
                          <div class="d-flex align-items-center justify-content-center gap-1">
                              <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${index}, -1)" style="width: 25px; height: 25px; padding: 0; font-size: 12px;">-</button>
                              <span>${articulo.cantidad}</span>
                              <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${index}, 1)" style="width: 25px; height: 25px; padding: 0; font-size: 12px;">+</button>
                          </div>
                      </td>
                      <td class="align-middle">
                          <button class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito(${index})" style="width: 25px; height: 25px; padding: 0; font-size: 12px;">×</button>
                      </td>
                  </tr>
              `;
  });

  htmlCarrito += "</tbody></table>";
  contenedorArticulos.innerHTML = htmlCarrito;

  // Actualizar total
  if (cartTotal) {
    cartTotal.textContent = `${total.toLocaleString()}`;
  }

  console.log("Carrito actualizado con", carritoCompras.length, "productos");
}

/**
 * Cambia la cantidad de un producto en el carrito
 */
function cambiarCantidad(index, cambio) {
  if (index >= 0 && index < carritoCompras.length) {
    carritoCompras[index].cantidad += cambio;

    if (carritoCompras[index].cantidad <= 0) {
      carritoCompras.splice(index, 1);
    }

    actualizarVisualizacionCarrito();

    if (carritoCompras.length === 0) {
      ocultarCarrito();
    }
  }
}

/**
 * Elimina un producto del carrito
 */
function eliminarDelCarrito(index) {
  if (index >= 0 && index < carritoCompras.length) {
    carritoCompras.splice(index, 1);
    actualizarVisualizacionCarrito();

    if (carritoCompras.length === 0) {
      ocultarCarrito();
    }
  }
}

/**
 * Vacía completamente el carrito
 */
function vaciarCarritoCompras() {
  console.log("Vaciando carrito...");
  carritoCompras = [];
  actualizarVisualizacionCarrito();
  ocultarCarrito();
}

/**
 * Muestra feedback visual cuando se agrega un producto
 */
function mostrarFeedbackAgregado(boton) {
  const textoOriginal = boton.textContent;
  boton.textContent = "¡Agregado!";
  boton.classList.add("btn-success");
  boton.classList.remove("btn-primary");
  boton.disabled = true;

  setTimeout(() => {
    boton.textContent = textoOriginal;
    boton.classList.remove("btn-success");
    boton.classList.add("btn-primary");
    boton.disabled = false;
  }, 1000);
}

/**
 * Procesa el formulario para agregar nuevos productos
 */
function procesarNuevoProducto(formulario) {
  const datosProducto = {
    nombre: formulario.querySelector("#inputNombre").value.trim(),
    precio: formulario.querySelector("#inputPrecio").value.trim(),
    talla: formulario.querySelector("#inputTalla").value.trim(),
    color: formulario.querySelector("#inputColor").value.trim(),
    material: formulario.querySelector("#inputMaterial").value.trim(),
    imagen: formulario.querySelector("#inputImagen").value.trim(),
  };

  if (!validarDatosProducto(datosProducto)) {
    alert("Por favor, complete todos los campos del formulario.");
    return;
  }

  if (datosProducto.precio < 1000) {
    alert("El precio del artículo debe ser mayor a $1.000");
    return;
  }

  crearTarjetaProducto(datosProducto);
  formulario.reset();
  alert("Producto agregado exitosamente a la tienda.");

  // Scroll hacia el nuevo producto
  setTimeout(() => {
    const productos = document.querySelectorAll("#products-container .card");
    const ultimoProducto = productos[productos.length - 1];
    ultimoProducto.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 100);
}

/**
 * Valida los datos del producto
 */
function validarDatosProducto(datos) {
  return (
    datos.nombre &&
    !isNaN(datos.precio) &&
    datos.precio > 0 &&
    datos.talla &&
    datos.color &&
    datos.material &&
    datos.imagen
  );
}

/**
 * Crea una nueva tarjeta de producto
 */
function crearTarjetaProducto(datosProducto) {
  const contenedorProductos = document.getElementById("products-container");

  const nuevaTarjeta = document.createElement("div");
  nuevaTarjeta.className =
    "col-sm-6 col-md-4 col-lg-3 py-5 d-flex justify-content-center";

  nuevaTarjeta.innerHTML = `
              <div class="card" style="width: 18rem">
                  <img src="${datosProducto.imagen}" 
                       class="card-img-top" 
                       alt="${datosProducto.nombre}"
                       onerror="this.src='https://via.placeholder.com/300x300?text=Imagen+no+disponible'">
                  <div class="card-body">
                      <h5 class="card-title">${datosProducto.nombre}</h5>
                      <p class="card-text mb-1"><strong>Precio:</strong> ${'$' + datosProducto.precio.toLocaleString()}</p>
                      <p class="card-text mb-1"><strong>Talla:</strong> ${
                        datosProducto.talla
                      }</p>
                      <p class="card-text mb-1"><strong>Color:</strong> ${
                        datosProducto.color
                      }</p>
                      <p class="card-text mb-1"><strong>Material:</strong> ${
                        datosProducto.material
                      }</p>
                      <button class="btn btn-primary add-to-cart">Comprar</button>
                  </div>
              </div>
          `;

  contenedorProductos.appendChild(nuevaTarjeta);

  // Agregar evento al nuevo botón
  const nuevoBoton = nuevaTarjeta.querySelector(".add-to-cart");
  nuevoBoton.addEventListener("click", function (e) {
    e.preventDefault();
    agregarArticuloAlCarrito(this);
  });

  console.log("Nuevo producto creado:", datosProducto.nombre);
}
