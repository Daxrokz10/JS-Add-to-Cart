let pname = document.getElementById("pname");
let price = document.getElementById("price");
let stock = document.getElementById("stock");
let type = document.getElementById("type");
let pimage = document.getElementById("pimage");
let addBtn = document.getElementById("addBtn");
let form = document.getElementById("form");

let products = JSON.parse(localStorage.getItem("products")) || [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let prod = {
    pname: pname.value,
    price: price.value,
    stock: stock.value,
    type: type.value,
    pimage: pimage.value,
  };
  products.push(prod);
  localStorage.setItem("products", JSON.stringify(products));
  
  form.reset();
  alert("Product added successfully!");

  getProduct();
});
