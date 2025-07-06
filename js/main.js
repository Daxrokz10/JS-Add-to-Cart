let products = [];
let cart = [];
let product_grid = document.querySelector('.tab-content .product-grid')
let cartSection = document.querySelector('.offcanvas .offcanvas-body .list-group')

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
    })
    renderCart();
});

let renderCart = () => {
  // Clear previous cart items
  cartSection.innerHTML = '';
  // Get latest cart from localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.forEach(item => {
    let { price, name, qty } = item;
    let li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lh-sm');
    li.innerHTML = `
      <div>
        <h6 class="my-0">${name} <span class="badge bg-secondary">${qty}</span></h6>
        <small class="text-body-secondary">x${qty}</small>
      </div>
      <span class="text-body-secondary">$${(price * qty).toFixed(2)}</span>
    `;
    cartSection.appendChild(li);
  });
};

getProducts();