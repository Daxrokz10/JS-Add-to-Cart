let products = [];
let cart = [];
let product_grid = document.querySelector('.tab-content .product-grid')
let cartSection = document.querySelector('.offcanvas .offcanvas-body .list-group')
let counter = document.querySelector('.offcanvas .offcanvas-body .badge');
let totalPrice = document.querySelector('.cart .cart-total');
let totalPrice2 = document.querySelector('.offcanvas .offcanvas-body .list-group strong');

async function getProducts() {
    let res = await fetch('js/products.json');
    let data = await res.json();

    products = data;
    displayProducts();
}

let displayProducts = (() => {
    product_grid.innerHTML = '';
    products.forEach(product => {
        let { id, name, price, rating, image } = product;
        let col = document.createElement('div');
        col.classList.add('col');

        col.innerHTML =
            `
                    <div class="product-item">
                        <span class="badge bg-success position-absolute m-3">-30%</span>
                        <a href="#" class="btn-wishlist"><svg width="24" height="24"><use xlink:href="#heart"></use></svg></a>
                        <figure>
                          <a href="index.html" title="Product Title">
                            <img src="${image}"  class="tab-image">
                          </a>
                        </figure>
                        <h3>${name}</h3>
                        <span class="qty">1 Unit</span><span class="rating"><svg width="24" height="24" class="text-primary"><use xlink:href="#star-solid"></use></svg> ${rating}</span>
                        <span class="price">$${price}</span>
                        <div class="d-flex align-items-center justify-content-between">
                          <div class="input-group product-qty">
                              <span class="input-group-btn">
                                  <button type="button" class="quantity-left-minus btn btn-danger btn-number" data-type="minus">
                                    <svg width="16" height="16"><use xlink:href="#minus"></use></svg>
                                  </button>
                              </span>
                              <input type="text" id="quantity" name="quantity" class="form-control input-number" value="1">
                              <span class="input-group-btn">
                                  <button type="button" class="quantity-right-plus btn btn-success btn-number" data-type="plus">
                                      <svg width="16" height="16"><use xlink:href="#plus"></use></svg>
                                  </button>
                              </span>
                          </div>
                          <button class="nav-link add-to-cart-btn" data-id="${id}">Add to Cart <iconify-icon icon="uil:shopping-cart"></button>
                        </div>
                      </div>
        `
        product_grid.appendChild(col);
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const prodId = parseInt(this.getAttribute('data-id'));
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let prod = products.find(p => p.id === prodId);
        let currentName = prod.name;

        let found = cart.find(item => item.id === prodId);
        if (found) {
          found.qty += 1;
        } else {
          cart.push({
            id: prod.id,
            name: prod.name,
            price: prod.price,
            image: prod.image,
            qty: 1
          });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        alert(`Added ${currentName} to cart`);
      });
    });

    // Add event listeners for quantity plus/minus buttons
    document.querySelectorAll('.product-item').forEach(item => {
      const plusBtn = item.querySelector('.quantity-right-plus');
      const minusBtn = item.querySelector('.quantity-left-minus');
      const qtyInput = item.querySelector('input[name="quantity"]');
      const addToCartBtn = item.querySelector('.add-to-cart-btn');
      if (!plusBtn || !minusBtn || !qtyInput || !addToCartBtn) return;
      const prodId = parseInt(addToCartBtn.getAttribute('data-id'));

      plusBtn.addEventListener('click', function() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let found = cart.find(item => item.id === prodId);
        if (found) {
          found.qty += 1;
        } else {
          let prod = products.find(p => p.id === prodId);
          cart.push({
            id: prod.id,
            name: prod.name,
            price: prod.price,
            image: prod.image,
            qty: 1
          });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        // Update input field
        let updated = cart.find(item => item.id === prodId);
        qtyInput.value = updated ? updated.qty : 1;
      });

      minusBtn.addEventListener('click', function() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let found = cart.find(item => item.id === prodId);
        if (found) {
          found.qty -= 1;
          if (found.qty <= 0) {
            cart = cart.filter(item => item.id !== prodId);
            qtyInput.value = 1;
          } else {
            qtyInput.value = found.qty;
          }
        } else {
          qtyInput.value = 1;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });
    });
    renderCart();
});

let renderCart = () => {
  // Clear previous cart items
  cartSection.innerHTML = '';
  let count = 0;
  let total = 0;
  // Get latest cart from localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.forEach(item => {
    let { id, price, name, qty } = item;
    count += qty;
    total += price*qty;
    let li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lh-sm', 'align-items-center');
    li.innerHTML = `
      <div>
        <h6 class="my-0">${name} <span class="badge bg-secondary">${qty}</span></h6>
        <small class="text-body-secondary">x${qty}</small>
      </div>
      <span class="text-body-secondary">$${(price * qty).toFixed(2)}</span>
      <button class="btn btn-sm btn-outline-danger ms-2 remove-cart-item" data-id="${id}" title="Remove"><svg width="16" height="16"><use xlink:href="#trash"></use></svg></button>
    `;
    cartSection.appendChild(li);
  });

  // Add event listeners for remove buttons
  cartSection.querySelectorAll('.remove-cart-item').forEach(btn => {
    btn.addEventListener('click', function() {
      const prodId = parseInt(this.getAttribute('data-id'));
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart = cart.filter(item => item.id !== prodId);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    });
  });

  //adding the total price inside cart
  let li = document.createElement('li');
  li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lh-sm');
  li.innerHTML = `
    <span>Total (USD)</span>
    <strong>$${total}</strong>
  `
  cartSection.appendChild(li);

  counter.textContent = count;
  totalPrice.textContent = `$${total}`;
  if (totalPrice2) totalPrice2.textContent = `$${total}`;
};

getProducts();