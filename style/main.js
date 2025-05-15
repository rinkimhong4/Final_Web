let product_list = JSON.parse(localStorage.getItem("product_list")) || [];
let products = [];
for (let i = 0; i < product_list.length; i++) {
  let p = product_list[i];
  products.push({
    name: p.title,
    image: p.qrImageUrl,
    discount: parseFloat(p.discount) || 0,
    price: parseFloat(p.price),
    taxes: parseFloat(p.taxes),
    total: parseFloat(p.total),
    newPrice: parseFloat(p.price),
    oldPrice: parseFloat(p.price) + parseFloat(p.taxes),
    rating: 4.5,
    colors: ["creme", "red", "blue"],
    sizes: ["S", "M", "L"],
    brand: p.brand,
    count: parseInt(p.count) || 1,
    category: p.category || "all",
  });
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wish_listProduct = JSON.parse(localStorage.getItem("wishlist")) || [];
let displayed_Products = products;

let newCart = [];
for (let i = 0; i < cart.length; i++) {
  let item = cart[i];
  let product = products.find((p) => p.name === item.name);
  if (product) {
    newCart.push({
      name: item.name,
      image: product.image,
      total: product.total,
      count: product.count,
      brand: product.brand,
      sizes: product.sizes,
      quantity: Math.min(item.quantity, product.count),
    });
  }
}
cart = newCart;
localStorage.setItem("cart", JSON.stringify(cart));

function showProducts() {
  let productList = document.getElementById("product-list");
  productList.innerHTML = "";
  if (displayed_Products.length === 0) {
    productList.innerHTML =
      '<div class="col-12 text-center text-gray-600 py-4">No products found.</div>';
    return;
  }
  for (let i = 0; i < displayed_Products.length; i++) {
    let product = displayed_Products[i];
    let cartItem = cart.find((item) => item.name === product.name);
    let quantity = cartItem ? cartItem.quantity : 0;
    let inWishlist = wish_listProduct.some(
      (item) => item.name === product.name
    );
    let cardHtml = `
      <div class="col">
        <div class="card h-100 border-0 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1" onclick="cardClicked(${i}, event)">
          <div class="image-container relative">
            <img src="${product.image}" class="card-img-top" alt="${
      product.name
    }" onerror="this.src='https://via.placeholder.com/300x400'">
            <div class="absolute top-2 right-2">
              <span class="wishlist cursor-pointer" onclick="toggleWishlist(${i}); event.stopPropagation()" aria-label="Toggle wishlist for ${
      product.name
    }">
                <i class="fa fa-heart${
                  inWishlist ? "" : "-o"
                } text-red-500"></i>
              </span>
            </div>
            ${
              product.discount > 0
                ? `<span class="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">-${product.discount}%</span>`
                : ""
            }
          </div>
          <div class="card-body p-4">
            <h5 class="card-title text-gray-800 font-semibold">${
              product.name
            }</h5>
            <div class="flex justify-between items-center">
              <div>
                <span class="new-price text-gray-800 font-semibold">$${product.newPrice.toFixed(
                  2
                )}</span>
                <small class="old-price text-gray-500 line-through ml-2">$${product.oldPrice.toFixed(
                  2
                )}</small>
              </div>
              <div class="flex items-center">
                <i class="fa fa-star text-yellow-400"></i>
                <span class="rating-number text-gray-600 ml-1">${
                  product.rating
                }</span>
              </div>
            </div>
            <div class="flex justify-between items-center mt-2">
              <div class="color-select flex">
                ${product.colors
                  .map(
                    (color) =>
                      `<button type="button" class="btn color-btn ${color} w-6 h-6 rounded-full mr-1" aria-label="Select ${color} color" onclick="toggleColor(this); event.stopPropagation()"></button>`
                  )
                  .join("")}
              </div>
              <div class="flex">
                ${product.sizes
                  .map(
                    (size) =>
                      `<span class="item-size px-2 py-1 border rounded text-sm mr-1 cursor-pointer" onclick="toggleSize(this); event.stopPropagation()" aria-label="Select size ${size}">${size}</span>`
                  )
                  .join("")}
              </div>
            </div>
            <div class="flex justify-between items-center mt-3">
              <div class="quantity-selector flex items-center">
                <button class="btn btn-outline-secondary btn-sm" onclick="decreaseQuantity(${i}); event.stopPropagation()" aria-label="Decrease quantity of ${
      product.name
    }">-</button>
                <span class="quantity mx-2">${quantity}</span>
                <button class="btn btn-outline-secondary btn-sm" onclick="increaseQuantity(${i}); event.stopPropagation()" aria-label="Increase quantity of ${
      product.name
    }">+</button>
              </div>
            </div>
            ${
              product.count <= 5
                ? `<div class="stock-warning mt-2 text-red-500 text-sm">Only ${product.count} left in stock!</div>`
                : ""
            }
          </div>
        </div>
      </div>
    `;
    productList.innerHTML += cardHtml;
  }
}

function showCart() {
  let cartItems = document.getElementById("cartItems");
  let cartCount = document.getElementById("cartCount");
  if (cart.length === 0) {
    cartItems.innerHTML =
      '<tr><td colspan="4" class="text-center py-4">Your cart is empty.</td></tr>';
    updateCartSummary();
    cartCount.textContent = "0";
    return;
  }
  cartItems.innerHTML = "";
  for (let i = 0; i < cart.length; i++) {
    let item = cart[i];
    let product = products.find((p) => p.name === item.name);
    let maxQuantity = product ? product.count : item.count;
    let rowHtml = `
      <tr>
        <td>
          <figure class="itemside align-items-center">
            <div class="aside">
              <img src="${item.image}" class="img-sm rounded" alt="${
      item.name
    }" onerror="this.src='https://via.placeholder.com/60'">
            </div>
            <figcaption class="info ml-3">
              <a href="#" class="title text-dark font-semibold">${item.name}</a>
              <p class="text-muted small">SIZE: ${item.sizes[0]}<br>Brand: ${
      item.brand
    }</p>
              ${
                item.quantity >= maxQuantity
                  ? `<p class="stock-warning text-red-500 text-sm">Max stock reached (${maxQuantity})</p>`
                  : ""
              }
            </figcaption>
          </figure>
        </td>
        <td>
          <select class="form-control" onchange="changeQuantity(${i}, this.value)" aria-label="Select quantity for ${
      item.name
    }">
            ${Array.from(
              { length: maxQuantity },
              (_, num) =>
                `<option value="${num + 1}" ${
                  num + 1 === item.quantity ? "selected" : ""
                }>${num + 1}</option>`
            ).join("")}
          </select>
        </td>
        <td>
          <div class="price-wrap">
            <var class="price font-semibold">$${(
              item.total * item.quantity
            ).toFixed(2)}</var>
            <small class="text-muted block">$${item.total.toFixed(
              2
            )} each</small>
          </div>
        </td>
        <td class="text-right">
          <button class="btn btn-danger btn-sm" onclick="removeFromCart(${i})" aria-label="Remove ${
      item.name
    } from cart">Remove</button>
        </td>
      </tr>
    `;
    cartItems.innerHTML += rowHtml;
  }
  updateCartSummary();
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartSummary() {
  let cartSummary = document.getElementById("cartSummary");
  let totalPrice = 0;
  for (let i = 0; i < cart.length; i++) {
    totalPrice += cart[i].total * cart[i].quantity;
  }
  cartSummary.innerHTML = `
    <dl class="dlist-align">
      <dt class="text-gray-800 font-semibold">Total:</dt>
      <dd class="text-right ml-3 text-gray-800 font-semibold">$${totalPrice.toFixed(
        2
      )}</dd>
    </dl>
    <hr class="my-3">
    <button class="btn bg-blue-500 text-white w-full hover:bg-blue-600 transition" onclick="makePurchase()" aria-label="Proceed to checkout">Make Purchase</button>
    <button class="btn bg-green-500 text-white w-full mt-2 hover:bg-green-600 transition" data-bs-dismiss="modal" aria-label="Continue shopping">Continue Shopping</button>
  `;
}

function cardClicked(index, event) {
  if (
    event.target.closest(".wishlist") ||
    event.target.closest(".color-btn") ||
    event.target.closest(".item-size") ||
    event.target.closest(".quantity-selector") ||
    event.target.closest(".btn")
  ) {
    return;
  }
  let product = displayed_Products[index];
  let cartItem = cart.find((item) => item.name === product.name);
  if (!cartItem || cartItem.quantity === 0) {
    increaseQuantity(index);
  }
  $("#cartModal").modal("show");
}

function increaseQuantity(index) {
  let product = displayed_Products[index];
  let cartItem = cart.find((item) => item.name === product.name);
  if (cartItem) {
    if (cartItem.quantity >= product.count) {
      alert(`Sorry, only ${product.count} in stock.`);
      return;
    }
    cartItem.quantity += 1;
  } else {
    cart.push({
      name: product.name,
      image: product.image,
      total: product.total,
      count: product.count,
      brand: product.brand,
      sizes: product.sizes,
      quantity: 1,
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  showProducts();
  showCart();
}

function decreaseQuantity(index) {
  let product = displayed_Products[index];
  let cartItem = cart.find((item) => item.name === product.name);
  if (cartItem && cartItem.quantity > 0) {
    cartItem.quantity -= 1;
    if (cartItem.quantity === 0) {
      cart = cart.filter((item) => item.name !== product.name);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    showProducts();
    showCart();
  }
}

function changeQuantity(index, value) {
  let newQuantity = parseInt(value);
  let product = products.find((p) => p.name === cart[index].name);
  if (newQuantity > product.count) {
    alert(`Sorry, only ${product.count} in stock.`);
    cart[index].quantity = product.count;
  } else {
    cart[index].quantity = newQuantity;
    if (cart[index].quantity === 0) {
      cart.splice(index, 1);
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  showProducts();
  showCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  showProducts();
  showCart();
}

function toggleWishlist(index) {
  let product = displayed_Products[index];
  let inWishlist = wish_listProduct.some((item) => item.name === product.name);
  if (inWishlist) {
    wish_listProduct = wish_listProduct.filter(
      (item) => item.name !== product.name
    );
  } else {
    wish_listProduct.push({
      name: product.name,
      image: product.image,
      price: product.price,
      taxes: product.taxes,
      discount: product.discount,
      total: product.total,
      count: product.count,
      brand: product.brand,
      rating: product.rating,
      colors: product.colors,
      sizes: product.sizes,
    });
  }
  localStorage.setItem("wishlist", JSON.stringify(wish_listProduct));
  showProducts();
}

function toggleColor(button) {
  button.classList.toggle("active");
}

function toggleSize(element) {
  element.classList.toggle("active");
}

function searchProducts(event) {
  event.preventDefault();
  let query = event.target.querySelector("input").value.trim().toLowerCase();
  displayed_Products = products.filter((p) =>
    p.name.toLowerCase().includes(query)
  );
  showProducts();
}

function filterProducts(category) {
  displayed_Products =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);
  showProducts();
}

function makePurchase() {
  alert("Thank you for your purchase!");
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  showProducts();
  showCart();
  $("#cartModal").modal("hide");
}

// Initial render
showProducts();
showCart();
