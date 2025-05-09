let rawProducts = JSON.parse(localStorage.getItem("product_list")) || [];
let products = [];
for (let i = 0; i < rawProducts.length; i++) {
  let p = rawProducts[i];
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
  });
}

// Load cart and wishlist from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let displayedProducts = products; // For search

// Update cart to match current products
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
  if (displayedProducts.length === 0) {
    productList.innerHTML =
      '<div class="col-12 text-center">No products found.</div>';
    return;
  }
  for (let i = 0; i < displayedProducts.length; i++) {
    let product = displayedProducts[i];
    let cartItem = cart.find((item) => item.name === product.name);
    let quantity = cartItem ? cartItem.quantity : 0;
    let cardHtml = `
          <div class="col-12 col-sm-6 col-md-3 mb-4">
            <div class="card" onclick="cardClicked(${i}, event)">
              <div class="image-container">
                <div class="first">
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="discount">-${product.discount}%</span>
                    <span class="wishlist" onclick="toggleWishlist(${i})" aria-label="Toggle wishlist for ${
      product.name
    }">
                      <i class="fa fa-heart${
                        wishlist.some((item) => item.name === product.name)
                          ? ""
                          : "-o"
                      }"></i>
                    </span>
                  </div>
                </div>
                <img src="${product.image}" class="thumbnail-image" alt="${
      product.name
    }" onerror="this.src='https://via.placeholder.com/300x400'">
              </div>
              <div class="product-detail-container p-3">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="dress-name">${product.name}</h5>
                  <div class="d-flex flex-column">
                    <span class="new-price">$${product.newPrice.toFixed(
                      2
                    )}</span>
                    <small class="old-price">$${product.oldPrice.toFixed(
                      2
                    )}</small>
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center pt-2">
                  <div class="color-select d-flex">
                    <button type="button" class="btn color-btn creme mr-1" aria-label="Select creme color" onclick="toggleColor(this)"></button>
                    <button type="button" class="btn color-btn red mr-1" aria-label="Select red color" onclick="toggleColor(this)"></button>
                    <button type="button" class="btn color-btn blue mr-1" aria-label="Select blue color" onclick="toggleColor(this)"></button>
                  </div>
                  <div class="d-flex">
                    <span class="item-size mr-1" onclick="toggleSize(this)" aria-label="Select size S">S</span>
                    <span class="item-size mr-1" onclick="toggleSize(this)" aria-label="Select size M">M</span>
                    <span class="item-size mr-1" onclick="toggleSize(this)" aria-label="Select size L">L</span>
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center pt-2">
                  <div>
                    <i class="fa fa-star rating-star"></i>
                    <span class="rating-number">${product.rating}</span>
                  </div>
                  <div class="quantity-selector">
                    <button class="btn btn-outline-secondary btn-sm" onclick="decreaseQuantity(${i}); event.stopPropagation()" aria-label="Decrease quantity of ${
      product.name
    }">-</button>
                    <span class="quantity">${quantity}</span>
                    <button class="btn btn-outline-secondary btn-sm" onclick="increaseQuantity(${i}); event.stopPropagation()" aria-label="Increase quantity of ${
      product.name
    }">+</button>
                  </div>
                </div>
                ${
                  product.count <= 5
                    ? `<div class="stock-warning mt-1">Only ${product.count} left in stock!</div>`
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
  if (cart.length === 0) {
    cartItems.innerHTML = '<tr><td colspan="4">Your cart is empty.</td></tr>';
    updateCartSummary();
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
                  <img src="${item.image}" class="img-sm" alt="${
      item.name
    }" onerror="this.src='https://via.placeholder.com/60'">
                </div>
                <figcaption class="info">
                  <a href="#" class="title text-dark">${item.name}</a>
                  <p class="text-muted small">SIZE: ${
                    item.sizes[0]
                  }<br>Brand: ${item.brand}</p>
                  ${
                    item.quantity >= maxQuantity
                      ? `<p class="stock-warning">Max stock reached (${maxQuantity})</p>`
                      : ""
                  }
                </figcaption>
              </figure>
            </td>
            <td>
              <select class="form-control" onchange="changeQuantity(${i}, this.value)" aria-label="Select quantity for ${
      item.name
    }">
        `;
    for (let num = 1; num <= maxQuantity; num++) {
      rowHtml += `<option value="${num}" ${
        num === item.quantity ? "selected" : ""
      }>${num}</option>`;
    }
    rowHtml += `
              </select>
            </td>
            <td>
              <div class="price-wrap">
                <var class="price">$${(item.total * item.quantity).toFixed(
                  2
                )}</var>
                <small class="text-muted">$${item.total.toFixed(2)} each</small>
              </div>
            </td>
            <td class="text-right d-none d-md-block">
              <button class="btn btn-light" onclick="removeFromCart(${i})" aria-label="Remove ${
      item.name
    } from cart">Remove</button>
            </td>
          </tr>
        `;
    cartItems.innerHTML += rowHtml;
  }
  updateCartSummary();
}

function updateCartSummary() {
  let cartSummary = document.getElementById("cartSummary");
  let totalPrice = 0;
  for (let i = 0; i < cart.length; i++) {
    totalPrice += cart[i].total * cart[i].quantity;
  }
  cartSummary.innerHTML = `
        <dl class="dlist-align">
          <dt>Total:</dt>
          <dd class="text-right ml-3"><strong>$${totalPrice.toFixed(
            2
          )}</strong></dd>
        </dl>
        <hr>
        <button class="btn btn-primary btn-main" onclick="makePurchase()" aria-label="Proceed to checkout">Make Purchase</button>
        <button class="btn btn-success btn-main" data-dismiss="modal" aria-label="Continue shopping">Continue Shopping</button>
      `;
}

function cardClicked(index, event) {
  if (
    event.target.closest(".wishlist") ||
    event.target.closest(".color-btn") ||
    event.target.closest(".item-size") ||
    event.target.closest(".quantity-selector")
  ) {
    return;
  }
  let product = displayedProducts[index];
  let cartItem = cart.find((item) => item.name === product.name);
  if (!cartItem || cartItem.quantity === 0) {
    increaseQuantity(index);
  }
  $("#cartModal").modal("show");
}

function increaseQuantity(index) {
  let product = displayedProducts[index];
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
  let product = displayedProducts[index];
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
  let product = displayedProducts[index];
  let inWishlist = wishlist.some((item) => item.name === product.name);
  if (inWishlist) {
    wishlist = wishlist.filter((item) => item.name !== product.name);
  } else {
    wishlist.push({
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
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
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
  displayedProducts = [];
  for (let i = 0; i < products.length; i++) {
    if (products[i].name.toLowerCase().includes(query)) {
      displayedProducts.push(products[i]);
    }
  }
  showProducts();
}

function makePurchase() {
  alert("Thank you for your purchase!");
}

showProducts();
