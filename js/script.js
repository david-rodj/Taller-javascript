// Array para almacenar los productos del carrito
let carritoCompras = [];

// Función para inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando eventos...');
    inicializarEventosCarrito();
    inicializarFormularioAgregarProducto();
});

/**
 * Inicializa los eventos relacionados con el carrito de compras
 */
function inicializarEventosCarrito() {
    // Agregar event listeners a todos los botones de compra existentes
    const botonesCompra = document.querySelectorAll('button.btn-primary');
    console.log('Botones encontrados:', botonesCompra.length);
    
    botonesCompra.forEach((boton, index) => {
        // Solo agregar listener a los botones que dicen "Comprar"
        if (boton.textContent.trim() === 'Comprar') {
            console.log(`Agregando listener al botón ${index + 1}`);
            boton.addEventListener('click', function(evento) {
                evento.preventDefault();
                console.log('Botón clickeado');
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
    console.log('Agregando artículo al carrito...');
    
    // Obtener la tarjeta del producto que contiene este botón
    const tarjetaProducto = botonCompra.closest('.card');
    console.log('Tarjeta encontrada:', tarjetaProducto);
    
    // Extraer información del producto de la tarjeta
    const informacionProducto = extraerInformacionProducto(tarjetaProducto);
    console.log('Información del producto:', informacionProducto);
    
    // Buscar si el artículo ya existe en el carrito
    const articuloExistente = carritoCompras.find(articulo => 
        articulo.nombre === informacionProducto.nombre
    );
    
    if (articuloExistente) {
        // Si ya existe, incrementar la cantidad
        articuloExistente.cantidad += 1;
        console.log('Producto existente, nueva cantidad:', articuloExistente.cantidad);
    } else {
        // Si no existe, agregarlo con cantidad 1
        carritoCompras.push({
            ...informacionProducto,
            cantidad: 1
        });
        console.log('Nuevo producto agregado al carrito');
    }
    
    console.log('Estado actual del carrito:', carritoCompras);
    
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
    
    // Buscar el elemento que contiene el precio
    const elementosPrecio = tarjeta.querySelectorAll('.card-text');
    let precio = '';
    
    for (let elemento of elementosPrecio) {
        if (elemento.textContent.includes('Precio:')) {
            // Extraer solo los números del precio
            const textoCompleto = elemento.textContent;
            console.log('Texto del precio:', textoCompleto);
            const coincidenciaPrecio = textoCompleto.match(/\$(\d+)/);
            if (coincidenciaPrecio) {
                precio = coincidenciaPrecio[1];
                console.log('Precio extraído:', precio);
            }
            break;
        }
    }
    
    const producto = {
        nombre: nombre,
        precio: precio,
        imagen: imagen
    };
    
    console.log('Producto extraído:', producto);
    return producto;
}

/**
 * Configura los eventos de hover para mostrar/ocultar el carrito
 */
function configurarEventosCarrito() {
    // Buscar el ícono del carrito de manera más específica
    const iconoCarrito = document.querySelector('a.cart-icon');
    const desplegableCarrito = document.getElementById('cart-dropdown');
    
    console.log('Ícono del carrito:', iconoCarrito);
    console.log('Dropdown del carrito:', desplegableCarrito);
    
    if (!iconoCarrito) {
        console.error('No se encontró el ícono del carrito. Verificando elementos...');
        // Buscar de manera alternativa
        const iconoAlternativo = document.querySelector('img[alt="Carrito de compras"]');
        if (iconoAlternativo) {
            console.log('Ícono encontrado de manera alternativa:', iconoAlternativo.parentElement);
            configurarEventosCarritoElemento(iconoAlternativo.parentElement, desplegableCarrito);
        }
        return;
    }
    
    if (!desplegableCarrito) {
        console.error('No se encontró el dropdown del carrito');
        return;
    }
    
    configurarEventosCarritoElemento(iconoCarrito, desplegableCarrito);
}

/**
 * Configura los eventos de un elemento específico del carrito
 */
function configurarEventosCarritoElemento(elemento, desplegableCarrito) {
    if (elemento && desplegableCarrito) {
        // Mostrar carrito al hacer hover sobre el ícono
        elemento.addEventListener('mouseenter', function() {
            console.log('Mouse entró al ícono del carrito');
            if (carritoCompras.length > 0) {
                console.log('Mostrando carrito con', carritoCompras.length, 'productos');
                desplegableCarrito.style.display = 'block';
            } else {
                console.log('Carrito vacío, no se muestra');
            }
        });
        
        // Ocultar carrito al salir del ícono (con delay para permitir moverse al dropdown)
        elemento.addEventListener('mouseleave', function() {
            console.log('Mouse salió del ícono del carrito');
            setTimeout(() => {
                if (!desplegableCarrito.matches(':hover')) {
                    desplegableCarrito.style.display = 'none';
                }
            }, 200);
        });
        
        // Mantener carrito visible cuando el mouse esté sobre él
        desplegableCarrito.addEventListener('mouseenter', function() {
            console.log('Mouse entró al dropdown del carrito');
            this.style.display = 'block';
        });
        
        // Ocultar carrito al salir del dropdown
        desplegableCarrito.addEventListener('mouseleave', function() {
            console.log('Mouse salió del dropdown del carrito');
            this.style.display = 'none';
        });
        
        console.log('Eventos del carrito configurados correctamente');
    } else {
        console.error('No se pudieron configurar los eventos del carrito');
    }
}

/**
 * Actualiza la visualización del carrito de compras
 */
function actualizarVisualizacionCarrito() {
    console.log('Actualizando visualización del carrito...');
    const contenedorArticulos = document.getElementById('cart-items');
    
    if (!contenedorArticulos) {
        console.error('No se encontró el contenedor de artículos del carrito');
        return;
    }
    
    if (carritoCompras.length === 0) {
        contenedorArticulos.innerHTML = '<p class="text-muted mb-0">El carrito está vacío</p>';
        console.log('Carrito vacío, ocultando dropdown');
        return;
    }
    
    console.log('Generando HTML para', carritoCompras.length, 'productos');
    
    // Construir HTML de la tabla del carrito
    let htmlCarrito = `
        <table class="table table-sm mb-0">
            <thead>
                <tr>
                    <th style="width: 60px;">Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th style="width: 80px;">Cantidad</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    carritoCompras.forEach(articulo => {
        const precioFormateado = parseInt(articulo.precio).toLocaleString('es-CO');
        htmlCarrito += `
            <tr>
                <td>
                    <img src="${articulo.imagen}" 
                         alt="${articulo.nombre}" 
                         style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;"
                         onerror="this.src='https://via.placeholder.com/40x40?text=?'">
                </td>
                <td class="align-middle" style="font-size: 0.85rem;">${articulo.nombre}</td>
                <td class="align-middle" style="font-size: 0.85rem;">${precioFormateado}</td>
                <td class="align-middle text-center" style="font-size: 0.85rem;">${articulo.cantidad}</td>
            </tr>
        `;
    });
    
    htmlCarrito += `
            </tbody>
        </table>
    `;
    
    contenedorArticulos.innerHTML = htmlCarrito;
    console.log('HTML del carrito actualizado');
}

/**
 * Vacía completamente el carrito de compras
 */
function vaciarCarritoCompras() {
    console.log('Vaciando carrito de compras...');
    carritoCompras = [];
    actualizarVisualizacionCarrito();
    
    // Ocultar el dropdown del carrito
    const desplegableCarrito = document.getElementById('cart-dropdown');
    if (desplegableCarrito) {
        desplegableCarrito.style.display = 'none';
    }
    
    console.log('Carrito vaciado y ocultado');
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