// Array para almacenar los productos del carrito
let carritoCompras = [];

// Función para inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    inicializarEventosCarrito();
    inicializarFormularioAgregarProducto();
});

/**
 * Inicializa los eventos relacionados con el carrito de compras
 */
function inicializarEventosCarrito() {
    // Agregar event listeners a todos los botones de compra existentes
    const botonesCompra = document.querySelectorAll('.btn-primary');
    botonesCompra.forEach(boton => {
        // Solo agregar listener a los botones que dicen "Comprar"
        if (boton.textContent.trim() === 'Comprar') {
            boton.addEventListener('click', function(evento) {
                evento.preventDefault();
                agregarArticuloAlCarrito(this);
            });
        }
    });

    // Configurar eventos del ícono del carrito
    configurarEventosCarrito();
    
    // Configurar botón de vaciar carrito
    const botonVaciarCarrito = document.getElementById('empty-cart-btn');
    if (botonVaciarCarrito) {
        botonVaciarCarrito.addEventListener('click', vaciarCarritoCompras);
    }
}

/**
 * Agrega un artículo al carrito de compras
 * @param {HTMLElement} botonCompra - El botón de compra clickeado
 */
function agregarArticuloAlCarrito(botonCompra) {
    // Obtener la tarjeta del producto que contiene este botón
    const tarjetaProducto = botonCompra.closest('.card');
    
    // Extraer información del producto de la tarjeta
    const informacionProducto = extraerInformacionProducto(tarjetaProducto);
    
    // Buscar si el artículo ya existe en el carrito
    const articuloExistente = carritoCompras.find(articulo => 
        articulo.nombre === informacionProducto.nombre
    );
    
    if (articuloExistente) {
        // Si ya existe, incrementar la cantidad
        articuloExistente.cantidad += 1;
    } else {
        // Si no existe, agregarlo con cantidad 1
        carritoCompras.push({
            ...informacionProducto,
            cantidad: 1
        });
    }
    
    // Actualizar la visualización del carrito
    actualizarVisualizacionCarrito();
}

/**
 * Extrae la información del producto de una tarjeta HTML
 * @param {HTMLElement} tarjeta - La tarjeta del producto
 * @returns {Object} Objeto con la información del producto
 */
function extraerInformacionProducto(tarjeta) {
    const nombre = tarjeta.querySelector('.card-title').textContent.trim();
    const imagenElemento = tarjeta.querySelector('.card-img-top');
    const imagen = imagenElemento.src;
    
    // Extraer precio del texto que contiene "Precio:"
    const textosPrecio = tarjeta.querySelectorAll('.card-text');
    let precio = '';
    
    textosPrecio.forEach(texto => {
        if (texto.textContent.includes('Precio:')) {
            // Extraer solo los números del precio
            const coincidenciaPrecio = texto.textContent.match(/\$?([\d,.]+)/);
            if (coincidenciaPrecio) {
                precio = coincidenciaPrecio[1].replace(/[,.]/g, '');
            }
        }
    });
    
    return {
        nombre: nombre,
        precio: precio,
        imagen: imagen
    };
}

/**
 * Configura los eventos de hover para mostrar/ocultar el carrito
 */
function configurarEventosCarrito() {
    const iconoCarrito = document.querySelector('a[href="..."] img[alt="Carrito de compras"]').parentElement;
    const desplegableCarrito = document.getElementById('cart-dropdown');
    
    if (iconoCarrito && desplegableCarrito) {
        // Mostrar carrito al hacer hover sobre el ícono
        iconoCarrito.addEventListener('mouseenter', function() {
            if (carritoCompras.length > 0) {
                desplegableCarrito.style.display = 'block';
            }
        });
        
        // Ocultar carrito al salir del ícono (con delay para permitir moverse al dropdown)
        iconoCarrito.addEventListener('mouseleave', function() {
            setTimeout(() => {
                if (!desplegableCarrito.matches(':hover')) {
                    desplegableCarrito.style.display = 'none';
                }
            }, 100);
        });
        
        // Mantener carrito visible cuando el mouse esté sobre él
        desplegableCarrito.addEventListener('mouseenter', function() {
            this.style.display = 'block';
        });
        
        // Ocultar carrito al salir del dropdown
        desplegableCarrito.addEventListener('mouseleave', function() {
            this.style.display = 'none';
        });
    }
}

/**
 * Actualiza la visualización del carrito de compras
 */
function actualizarVisualizacionCarrito() {
    const contenedorArticulos = document.getElementById('cart-items');
    
    if (carritoCompras.length === 0) {
        contenedorArticulos.innerHTML = '<p class="text-muted mb-0">El carrito está vacío</p>';
        return;
    }
    
    // Construir HTML de la tabla del carrito
    let htmlCarrito = `
        <table class="table table-sm mb-0">
            <thead>
                <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    carritoCompras.forEach(articulo => {
        htmlCarrito += `
            <tr>
                <td>
                    <img src="${articulo.imagen}" 
                         alt="${articulo.nombre}" 
                         style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                </td>
                <td class="align-middle">${articulo.nombre}</td>
                <td class="align-middle">$${parseInt(articulo.precio).toLocaleString()}</td>
                <td class="align-middle">${articulo.cantidad}</td>
            </tr>
        `;
    });
    
    htmlCarrito += `
            </tbody>
        </table>
    `;
    
    contenedorArticulos.innerHTML = htmlCarrito;
}

/**
 * Vacía completamente el carrito de compras
 */
function vaciarCarritoCompras() {
    carritoCompras = [];
    actualizarVisualizacionCarrito();
    
    // Ocultar el dropdown del carrito
    const desplegableCarrito = document.getElementById('cart-dropdown');
    if (desplegableCarrito) {
        desplegableCarrito.style.display = 'none';
    }
}

/**
 * Inicializa el formulario para agregar nuevos productos
 */
function inicializarFormularioAgregarProducto() {
    const formularioAgregar = document.querySelector('form.form');
    
    if (formularioAgregar) {
        formularioAgregar.addEventListener('submit', function(evento) {
            evento.preventDefault();
            procesarNuevoProducto(this);
        });
    }
}

/**
 * Procesa la adición de un nuevo producto desde el formulario
 * @param {HTMLFormElement} formulario - El formulario con los datos del producto
 */
function procesarNuevoProducto(formulario) {
    // Obtener los valores de los campos del formulario
    const datosProducto = {
        nombre: formulario.querySelector('#inputNombre').value.trim(),
        precio: parseInt(formulario.querySelector('#inputPrecio').value),
        talla: formulario.querySelector('#inputTalla').value.trim(),
        color: formulario.querySelector('#inputColor').value.trim(),
        material: formulario.querySelector('#inputMaterial').value.trim(),
        imagen: formulario.querySelector('#inputImagen').value.trim()
    };
    
    // Validar que todos los campos estén completos
    if (!validarDatosProducto(datosProducto)) {
        alert('Por favor, complete todos los campos del formulario.');
        return;
    }
    
    // Validar que el precio sea mayor a 1.000
    if (datosProducto.precio < 1000) {
        alert('El precio del artículo debe ser mayor a $1.000');
        return;
    }
    
    // Crear la nueva tarjeta de producto
    crearTarjetaProducto(datosProducto);
    
    // Limpiar el formulario después de agregar el producto
    formulario.reset();
    
    // Mostrar mensaje de confirmación
    alert('Producto agregado exitosamente a la tienda.');
}

/**
 * Valida que todos los campos del producto estén completos
 * @param {Object} datos - Los datos del producto a validar
 * @returns {boolean} True si todos los datos son válidos
 */
function validarDatosProducto(datos) {
    return datos.nombre && 
           !isNaN(datos.precio) && 
           datos.precio > 0 &&
           datos.talla && 
           datos.color && 
           datos.material && 
           datos.imagen;
}

/**
 * Crea una nueva tarjeta de producto y la agrega a la sección de productos
 * @param {Object} datosProducto - Los datos del nuevo producto
 */
function crearTarjetaProducto(datosProducto) {
    const seccionProductos = document.querySelector('#products .row');
    
    // Crear el HTML de la nueva tarjeta
    const nuevaTarjeta = document.createElement('div');
    nuevaTarjeta.className = 'col-sm-6 col-md-4 col-lg-3 py-5 d-flex justify-content-center';
    
    nuevaTarjeta.innerHTML = `
        <div class="card" style="width: 18rem">
            <img src="${datosProducto.imagen}" 
                 class="card-img-top" 
                 alt="${datosProducto.nombre}"
                 onerror="this.src='https://via.placeholder.com/300x300?text=Imagen+no+disponible'">
            <div class="card-body">
                <h5 class="card-title">${datosProducto.nombre}</h5>
                <p class="card-text mb-1"><strong>Precio:</strong> $${datosProducto.precio.toLocaleString()}</p>
                <p class="card-text mb-1"><strong>Talla:</strong> ${datosProducto.talla}</p>
                <p class="card-text mb-1"><strong>Color:</strong> ${datosProducto.color}</p>
                <p class="card-text mb-1"><strong>Material:</strong> ${datosProducto.material}</p>
                <a href="#" 
                   class="btn btn-primary" 
                   style="background-color: #5a1a1a">Comprar</a>
            </div>
        </div>
    `;
    
    // Agregar la nueva tarjeta a la sección de productos
    seccionProductos.appendChild(nuevaTarjeta);
    
    // Agregar event listener al nuevo botón de compra
    const nuevoBotonCompra = nuevaTarjeta.querySelector('.btn-primary');
    nuevoBotonCompra.addEventListener('click', function(evento) {
        evento.preventDefault();
        agregarArticuloAlCarrito(this);
    });
}