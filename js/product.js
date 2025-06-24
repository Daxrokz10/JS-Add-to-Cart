let prodSec = document.querySelector("#prodSec .row");
let products = JSON.parse(localStorage.getItem("products")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function getProduct() {
    prodSec.innerHTML = "";
    products.forEach((prod, index) => {
        // Find cart item by id (always compare as string)
        let cartItem = cart.find(item => String(item.id) === String(prod.index));
        let quantity = cartItem ? cartItem.qty : 0;
        let card = document.createElement("div");
        card.className = "col-md-4 mb-3 mt-3";
        card.innerHTML = `
        <div class="card shadow-lg border-0 h-100">
            <img src="${prod.pimage}" class="card-img-top object-fit-cover" alt="${prod.pname}" style="height: 220px; object-fit: cover; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem;">
            <div class="card-body d-flex flex-column justify-content-between">
                <h5 class="card-title fw-bold text-primary mb-2">${prod.pname}</h5>
                <p class="card-text mb-1"><span class="fw-semibold">Price:</span> <span class="text-success">₹${prod.price}</span></p>
                <p class="card-text mb-1"><span class="fw-semibold">Stock:</span> <span class="${prod.stock > 0 ? 'text-success' : 'text-danger'}">${prod.stock > 0 ? prod.stock : 'Out of Stock'}</span></p>
                <p class="card-text mb-3"><span class="fw-semibold">Type:</span> ${prod.type}</p>
                <div class="d-flex align-items-center gap-2 mt-auto">
                    <span class="cart-qty" id="cart-qty-${index}">${quantity}</span>
                    <button class="btn btn-gradient-primary ms-auto add-cart-btn" 
                        data-id="${prod.index}" 
                        data-name="${prod.pname}" 
                        data-price="${prod.price}" 
                        data-image="${prod.pimage}" 
                        ${prod.stock === 0 ? "disabled" : ""}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>`
        prodSec.appendChild(card);
    });

    // Add to Cart button logic
    document.querySelectorAll(".add-cart-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const image = this.getAttribute('data-image');
            const prod = products.find(p => String(p.index) === String(id));
            const stock = parseInt(prod.stock);

            let found = cart.find(item => String(item.id) === String(id));
            if (found) {
                if (found.qty < stock) {
                    found.qty++;
                }
            } else {
                cart.push({ id, name, price, image, qty: 1 });
            }
            updateCartStorage();
            getProduct();
            // Optional: show a toast or notification instead of alert
            // alert("Product added to cart!");
        });
    });
}

// Only run getProduct if prodSec exists (not on cart page)
if (prodSec) {
    getProduct();
}

// Cart page logic
if (window.location.pathname.includes('cart.html')) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let tbody = document.querySelector('.cart-table tbody');
    let subtotal = 0;
    if (cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">Cart is empty.</td></tr>';
    } else {
        tbody.innerHTML = '';
        cart.forEach(item => {
            let total = item.price * item.qty;
            subtotal += total;
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td><button class="remove-btn" data-id="${item.id}">x</button></td>
                <td><img src="${item.image}" width="50"></td>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td>
                    <input type="number" min="1" value="${item.qty}" class="qty-input" data-id="${item.id}" style="width:50px;">
                </td>
                <td>$${total}</td>
            `;
            tbody.appendChild(tr);
        });
    }
    // Update totals
    document.querySelectorAll('.total-data')[0].children[1].textContent = '$' + subtotal;
    document.querySelectorAll('.total-data')[2].children[1].textContent = '$' + (subtotal + 45);

    // Remove item
    tbody.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-btn')) {
            let id = e.target.getAttribute('data-id');
            cart = cart.filter(item => String(item.id) !== String(id));
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload();
        }
    });

    // Update quantity
    tbody.addEventListener('change', function(e) {
        if (e.target.classList.contains('qty-input')) {
            let id = e.target.getAttribute('data-id');
            let qty = parseInt(e.target.value);
            cart.forEach(item => {
                if (String(item.id) === String(id)) item.qty = qty;
            });
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload();
        }
    });
}
