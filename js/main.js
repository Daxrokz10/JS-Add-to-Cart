let products = [];
let product_grid = document.querySelector('.tab-content .product-grid')

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
                          <a href="#" class="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart"></a>
                        </div>
                      </div>
        `
        product_grid.appendChild(col);
    });
});

getProducts();