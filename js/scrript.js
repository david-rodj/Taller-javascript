  // Carrito vacío
  let cart = [];

  // Selecciona todas las cards de productos
  document.querySelectorAll('#products .card').forEach(card => {
    card.addEventListener('click', () => {
      const nombre = card.querySelector('.card-title').textContent;
      const precio = card.querySelector('.card-text').textContent.match(/\d[\d\.]*/)[0];
      const imagen = card.querySelector('.card-img-top').src;

      // Buscar si ya está en el carrito
      const found = cart.find(item => item.nombre === nombre);
      if (found) {
        found.cantidad += 1;
      } else {
        cart.push({
          nombre,
          precio,
          imagen,
          cantidad: 1
        });
      }
      renderCart();
    });
  });

  // Mostrar carrito al hacer hover sobre el icono
  const cartIcon = document.querySelector('.nav-item img[alt="Carrito de compras"]');
  const cartDropdown = document.getElementById('cart-dropdown');

  cartIcon.addEventListener('mouseenter', () => {
    if (cart.length > 0) {
      cartDropdown.style.display = 'block';
    }
  });
  cartIcon.addEventListener('mouseleave', () => {
    setTimeout(() => { cartDropdown.style.display = 'none'; }, 300);
  });
  cartDropdown.addEventListener('mouseenter', () => {
    cartDropdown.style.display = 'block';
  });
  cartDropdown.addEventListener('mouseleave', () => {
    cartDropdown.style.display = 'none';
  });

  // Vaciar carrito
  document.getElementById('empty-cart-btn').addEventListener('click', () => {
    cart = [];
    renderCart();
    cartDropdown.style.display = 'none';
  });

  // Renderizar carrito
  function renderCart() {
    const cartItems = document.getElementById('cart-items');
    if (cart.length === 0) {
      cartItems.innerHTML = '<span class="text-muted">El carrito está vacío.</span>';
      cartDropdown.style.display = 'none';
      return;
    }
    let html = `<table class="table table-sm mb-0"><thead>
      <tr>
        <th>Imagen</th>
        <th>Nombre</th>
        <th>Precio</th>
        <th>Cantidad</th>
      </tr>
    </thead><tbody>`;
    cart.forEach(item => {
      html += `<tr>
        <td><img src="${item.imagen}" alt="${item.nombre}" style="width:40px;height:40px;object-fit:cover;"></td>
        <td>${item.nombre}</td>
        <td>$${item.precio}</td>
        <td>${item.cantidad}</td>
      </tr>`;
    });
    html += '</tbody></table>';
    cartItems.innerHTML = html;
  }