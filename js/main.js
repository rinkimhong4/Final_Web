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

// Event handlers validated
let handleSubmit = (e) => {
  e.preventDefault();
  if (!shirtForm.checkValidity()) {
    shirtForm.classList.add("was-validated");
    return;
  }

  if (inputs.qrImageUrl.value && !validateUrl(inputs.qrImageUrl.value)) {
    showToast("error", "Please enter a valid Image URL");
    return;
  }

  try {
    let shirtItem = {
      title: inputs.title.value.trim(),
      price: parseFloat(inputs.price.value).toFixed(2),
      taxes: parseFloat(inputs.taxes.value).toFixed(2),
      discount: parseFloat(inputs.discount.value) || 0,
      qrImageUrl: inputs.qrImageUrl.value,
      count: parseInt(inputs.count.value),
      category: inputs.category.value.trim(),
      brand: inputs.brand.value.trim(),
      total: (
        parseFloat(inputs.price.value) +
        parseFloat(inputs.taxes.value) -
        (parseFloat(inputs.price.value) *
          (parseFloat(inputs.discount.value) || 0)) /
          100
      ).toFixed(2),
    };

    data.push(shirtItem);
    localStorage.setItem("product_list", JSON.stringify(data));
    renderTable();
    clearForm();
  } catch (error) {
    showToast("error", "An error occurred while adding the shirt");
    console.error("Add shirt error:", error);
  }
};
// text fields when edit , controller => edit product
let handleEdit = (index) => {
  let item = data[index];
  editInputs.id.value = index;
  editInputs.title.value = item.title;
  editInputs.price.value = item.price;
  editInputs.discount.value = item.discount;
  editInputs.count.value = item.count;
  editInputs.category.value = item.category;
  editInputs.brand.value = item.brand;
  editInputs.qrImageUrl.value = item.qrImageUrl;
  $("#editModal").modal("show");
};

// calculate when edit product
let handleSaveEdit = () => {
  if (!editForm.checkValidity()) {
    editForm.classList.add("was-validated");
    return;
  }

  if (
    editInputs.qrImageUrl.value &&
    !validateUrl(editInputs.qrImageUrl.value)
  ) {
    showToast("error", "Please enter a valid Image URL");
    return;
  }

  try {
    let index = parseInt(editInputs.id.value);
    data[index] = {
      title: editInputs.title.value.trim(),
      price: parseFloat(editInputs.price.value).toFixed(2),
      taxes: (parseFloat(editInputs.price.value) * 0.1).toFixed(2),
      discount: parseFloat(editInputs.discount.value) || 0,
      qrImageUrl: editInputs.qrImageUrl.value,
      count: parseInt(editInputs.count.value),
      category: editInputs.category.value.trim(),
      brand: editInputs.brand.value.trim(),
      total: (
        parseFloat(editInputs.price.value) +
        parseFloat(editInputs.price.value) * 0.1 -
        (parseFloat(editInputs.price.value) *
          (parseFloat(editInputs.discount.value) || 0)) /
          100
      ).toFixed(2),
    };

    localStorage.setItem("product_list", JSON.stringify(data));
    renderTable();
    $("#editModal").modal("hide");
    editForm.classList.remove("was-validated");
  } catch (error) {
    showToast("error", "An error occurred while updating the shirt");
    console.error("Update shirt error:", error);
  }
};

// delete product
function handleDelete(index) {
  Swal.fire({
    icon: "question",
    title: "Do you want to delete ?",
    showDenyButton: false,
    showCancelButton: true,
    confirmButtonText: "Delete",
    denyButtonText: `Cancel`,
  }).then((result) => {
    if (result.isConfirmed) {
      try {
        data.splice(index, 1);
        localStorage.setItem("product_list", JSON.stringify(data));
        renderTable();
      } catch (error) {
        showToast("error", "An error occurred while deleting the shirt");
        console.error("Delete shirt error:", error);
      }
    }
  });
}
// Event listener
inputs.price.addEventListener("input", calculateTaxesAndTotal);
inputs.discount.addEventListener("input", calculateTaxesAndTotal);
shirtForm.addEventListener("submit", handleSubmit);
buttons.cancel.addEventListener("click", clearForm);
buttons.saveEdit.addEventListener("click", handleSaveEdit);

// Event  for table buttons
tbody.addEventListener("click", (e) => {
  let index = e.target.dataset.index;
  if (e.target.classList.contains("edit-btn")) {
    handleEdit(index);
  } else if (e.target.classList.contains("delete-btn")) {
    handleDelete(index);
  }
});

renderTable();
