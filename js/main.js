// Form elements
let shirtForm = document.getElementById("shirtForm");
let editForm = document.getElementById("editForm");
// inputs controller
let inputs = {
  title: document.getElementById("title"),
  price: document.getElementById("price"),
  taxes: document.getElementById("taxes"),
  discount: document.getElementById("discount"),
  qrImageUrl: document.getElementById("qrImageUrl"),
  total: document.getElementById("total"),
  count: document.getElementById("count"),
  category: document.getElementById("category"),
  brand: document.getElementById("brand"),
};

// edit input controller
let editInputs = {
  id: document.getElementById("editId"),
  title: document.getElementById("editTitle"),
  price: document.getElementById("editPrice"),
  discount: document.getElementById("editDiscount"),
  count: document.getElementById("editCount"),
  category: document.getElementById("editCategory"),
  brand: document.getElementById("editBrand"),
  qrImageUrl: document.getElementById("editQrImageUrl"),
};

// button controller
let buttons = {
  add: document.getElementById("btnAdd"),
  cancel: document.getElementById("btnCancel"),
  saveEdit: document.getElementById("btnSaveEdit"),
};
let tbody = document.getElementById("tbody");

// save data to localStorage
let data = JSON.parse(localStorage.getItem("product_list")) || [];
console.log(data);

// Utility functions
let showToast = (type, message) => {
  let toast = document.getElementById(`${type}Toast`);
  let messageElement = document.getElementById(`${type}Message`);
  messageElement.textContent = message;
  toast.classList.remove("d-none");
  setTimeout(() => toast.classList.add("d-none"), 3000);
};
// calculate tax
// Price: $100
// Discount: 10% → $10
// Tax: 10%
// Discounted Price = $100 - $10 = $90
// Tax = 10% of $90 = $9
//  Final Price = $90 + $9 = $99
let calculateTaxesAndTotal = () => {
  let basePrice = parseFloat(inputs.price.value) || 0;
  let discountPercent = parseFloat(inputs.discount.value) || 0;

  let taxValue = +(basePrice * 0.1).toFixed(2);
  inputs.taxes.value = taxValue.toFixed(2);

  let priceWithTax = basePrice + taxValue;
  let discountValue = (priceWithTax * discountPercent) / 100;

  let totalValue = priceWithTax - discountValue;
  inputs.total.textContent = `$${totalValue.toFixed(2)}`;
};

// Clears all input => inputs controller
let clearForm = () => {
  shirtForm.reset();
  inputs.taxes.value = "0.00";
  inputs.total.textContent = "$0.00";
  shirtForm.classList.remove("was-validated");
};

// Function to validate image url
let validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

let renderTable = () => {
  tbody.innerHTML = "";
  data.forEach((item, index) => {
    let row = document.createElement("tr");
    row.innerHTML = `
                  <td class="align-middle">${index + 1}</td>
                  <td class="align-middle">${item.title}</td>
                  <td class="align-middle">$${parseFloat(item.price).toFixed(
                    2
                  )}</td>
                  <td class="align-middle">${item.discount}%</td>
                  <td class="align-middle">${item.count}</td>
                  <td class="align-middle">$${parseFloat(item.taxes).toFixed(
                    2
                  )}</td>
                  <td class="align-middle">$${parseFloat(item.total).toFixed(
                    2
                  )}</td>
                  <td class="align-middle">${item.category}</td>
                  <td class="align-middle">${item.brand}</td>
                  <td class="align-middle">
                      ${
                        item.qrImageUrl
                          ? `<img src="${item.qrImageUrl}" width="50" height="50" onerror="this.src='https://via.placeholder.com/50'" alt="Shirt Image">`
                          : "N/A"
                      }
                  </td>
                  <td class="align-middle">
                      <button class="btn btn-warning btn-sm edit-btn" data-index="${index}">Edit</button>
                  </td>
                  <td class="align-middle">
                      <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Delete</button>
                  </td>
              `;
    tbody.appendChild(row);
  });
};
