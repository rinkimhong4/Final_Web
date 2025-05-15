let shirtForm = document.getElementById("shirtForm");
let editForm = document.getElementById("editForm");

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

let buttons = {
  add: document.getElementById("btnAdd"),
  cancel: document.getElementById("btnCancel"),
  saveEdit: document.getElementById("btnSaveEdit"),
};
let tbody = document.getElementById("tbody");

let data = [];
try {
  let storedData = localStorage.getItem("product_list");
  if (storedData) {
    data = JSON.parse(storedData);
    if (!Array.isArray(data)) throw new Error("Invalid product_list format");
  }
} catch (error) {
  console.error("Error loading localStorage:", error);
  showToast("error", "Failed to load product data. Starting with empty list.");
}

let showToast = (type, message) => {
  let toast = document.getElementById(`${type}Toast`);
  let messageElement = document.getElementById(`${type}Message`);
  if (!toast || !messageElement) {
    console.error(`Toast element not found: ${type}Toast`);
    return;
  }
  messageElement.textContent = message;
  toast.classList.remove("d-none");
  setTimeout(() => toast.classList.add("d-none"), 3000);
};

let calculateTaxesAndTotal = () => {
  let basePrice = parseFloat(inputs.price.value) || 0;
  let discountPercent = parseFloat(inputs.discount.value) || 0;

  if (basePrice <= 0) {
    inputs.taxes.value = "0.00";
    inputs.total.textContent = "$0.00";
    return;
  }

  if (discountPercent < 0 || discountPercent > 100) {
    showToast("error", "Discount must be between 0 and 100%.");
    inputs.discount.value = "";
    return;
  }

  let taxValue = basePrice * 0.2;
  inputs.taxes.value = taxValue.toFixed(2);

  let priceWithTax = basePrice + taxValue;
  let discountValue = (priceWithTax * discountPercent) / 100;
  let totalValue = priceWithTax - discountValue;
  inputs.total.textContent = `$${totalValue.toFixed(2)}`;
};

let clearForm = () => {
  shirtForm.reset();
  inputs.taxes.value = "0.00";
  inputs.total.textContent = "$0.00";
  shirtForm.classList.remove("was-validated");
};

let validateUrl = (url) => {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

let validateInputs = (inputSet, isEdit = false) => {
  let errors = [];
  if (!inputSet.title.value.trim()) errors.push("Shirt name is required.");
  let price = parseFloat(inputSet.price.value);
  if (isNaN(price) || price <= 0)
    errors.push("Price must be a positive number.");
  let discount = parseFloat(inputSet.discount.value) || 0;
  if (discount < 0 || discount > 100)
    errors.push("Discount must be between 0 and 100%.");
  let count = parseInt(inputSet.count.value);
  if (isNaN(count) || count <= 0)
    errors.push("Quantity must be a positive integer.");
  if (!inputSet.category.value.trim()) errors.push("Category is required.");
  if (!inputSet.brand.value.trim()) errors.push("Brand is required.");
  if (inputSet.qrImageUrl.value && !validateUrl(inputSet.qrImageUrl.value)) {
    errors.push("Invalid image URL.");
  }
  return errors;
};

let renderTable = () => {
  tbody.innerHTML = "";
  data.forEach((item, index) => {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td class="align-middle text-center">${index + 1}</td>
      <td class="align-middle">${item.title}</td>
      <td class="align-middle text-center">$${parseFloat(item.price).toFixed(
        2
      )}</td>
      <td class="align-middle text-center">${item.discount}%</td>
      <td class="align-middle text-center">${item.count}</td>
      <td class="align-middle text-center">$${parseFloat(item.taxes).toFixed(
        2
      )}</td>
      <td class="align-middle text-center">$${parseFloat(item.total).toFixed(
        2
      )}</td>
      <td class="align-middle">${item.category}</td>
      <td class="align-middle">${item.brand}</td>
      <td class="align-middle text-center">
        ${
          item.qrImageUrl
            ? `<img src="${item.qrImageUrl}" width="50" height="50" onerror="this.src='https://via.placeholder.com/50'" alt="${item.title}">`
            : "N/A"
        }
      </td>
      <td class="align-middle text-center">
        <button class="btn btn-primary btn-sm edit-btn" data-index="${index}"><i class="fas fa-edit"></i></button>
      </td>
      <td class="align-middle text-center">
        <button class="btn btn-danger btn-sm delete-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(row);
  });
};

let handleSubmit = (e) => {
  e.preventDefault();
  if (!shirtForm.checkValidity()) {
    shirtForm.classList.add("was-validated");
    return;
  }

  let errors = validateInputs(inputs);
  if (errors.length > 0) {
    showToast("error", errors[0]);
    return;
  }

  try {
    let price = parseFloat(inputs.price.value);
    let discount = parseFloat(inputs.discount.value) || 0;
    let taxes = price * 0.2;
    let priceWithTax = price + taxes;
    let total = priceWithTax - (priceWithTax * discount) / 100;

    let shirtItem = {
      title: inputs.title.value.trim(),
      price: price.toFixed(2),
      taxes: taxes.toFixed(2),
      discount: discount,
      qrImageUrl: inputs.qrImageUrl.value,
      count: parseInt(inputs.count.value),
      category: inputs.category.value.trim(),
      brand: inputs.brand.value.trim(),
      total: total.toFixed(2),
    };

    data.push(shirtItem);
    localStorage.setItem("product_list", JSON.stringify(data));
    renderTable();
    clearForm();
    showToast("success", "Shirt added successfully!");
  } catch (error) {
    showToast("error", "Failed to add shirt. Please try again.");
    console.error("Add shirt error:", error);
  }
};

let handleEdit = (index) => {
  console.log("handleEdit called with index:", index);
  if (index < 0 || index >= data.length) {
    showToast("error", "Invalid product index.");
    console.error("Invalid index:", index);
    return;
  }
  try {
    let item = data[index];
    editInputs.id.value = index;
    editInputs.title.value = item.title || "";
    editInputs.price.value = parseFloat(item.price) || 0;
    editInputs.discount.value = item.discount || 0;
    editInputs.count.value = item.count || 1;
    editInputs.category.value = item.category || "";
    editInputs.brand.value = item.brand || "";
    editInputs.qrImageUrl.value = item.qrImageUrl || "";
    console.log("Populating edit modal with:", item);
    if (typeof $ === "undefined") {
      showToast("error", "jQuery not loaded. Cannot open modal.");
      console.error("jQuery is undefined");
      return;
    }
    $("#editModal").modal("show");
  } catch (error) {
    showToast("error", "Failed to load edit modal. Please try again.");
    console.error("Edit error:", error);
  }
};

let handleSaveEdit = () => {
  console.log("handleSaveEdit called");
  if (!editForm.checkValidity()) {
    editForm.classList.add("was-validated");
    console.log("Edit form validation failed");
    return;
  }

  let errors = validateInputs(editInputs, true);
  if (errors.length > 0) {
    showToast("error", errors[0]);
    console.log("Validation errors:", errors);
    return;
  }

  try {
    let index = parseInt(editInputs.id.value);
    if (index < 0 || index >= data.length) {
      throw new Error("Invalid product index");
    }

    let price = parseFloat(editInputs.price.value);
    let discount = parseFloat(editInputs.discount.value) || 0;
    let taxes = price * 0.2;
    let priceWithTax = price + taxes;
    let total = priceWithTax - (priceWithTax * discount) / 100;

    data[index] = {
      title: editInputs.title.value.trim(),
      price: price.toFixed(2),
      taxes: taxes.toFixed(2),
      discount: discount,
      qrImageUrl: editInputs.qrImageUrl.value,
      count: parseInt(editInputs.count.value),
      category: editInputs.category.value.trim(),
      brand: editInputs.brand.value.trim(),
      total: total.toFixed(2),
    };

    localStorage.setItem("product_list", JSON.stringify(data));
    renderTable();
    $("#editModal").modal("hide");
    editForm.classList.remove("was-validated");
    showToast("success", "Shirt updated successfully!");
    console.log("Shirt updated:", data[index]);
  } catch (error) {
    showToast("error", "Failed to update shirt. Please try again.");
    console.error("Update shirt error:", error);
  }
};

let handleDelete = (index) => {
  console.log("handleDelete called with index:", index);
  if (index < 0 || index >= data.length) {
    showToast("error", "Invalid product index.");
    console.error("Invalid index:", index);
    return;
  }
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3b82f6",
    cancelButtonColor: "#ef4444",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      try {
        data.splice(index, 1);
        localStorage.setItem("product_list", JSON.stringify(data));
        renderTable();
        showToast("success", "Shirt deleted successfully!");
        console.log("Shirt deleted at index:", index);
      } catch (error) {
        showToast("error", "Failed to delete shirt. Please try again.");
        console.error("Delete shirt error:", error);
      }
    }
  });
};

// Event listeners
inputs.price.addEventListener("input", calculateTaxesAndTotal);
inputs.discount.addEventListener("input", calculateTaxesAndTotal);
shirtForm.addEventListener("submit", handleSubmit);
buttons.cancel.addEventListener("click", clearForm);
buttons.saveEdit.addEventListener("click", handleSaveEdit);

tbody.addEventListener("click", (e) => {
  let target = e.target.closest(".edit-btn, .delete-btn");
  if (!target) return;
  let index = parseInt(target.dataset.index);
  if (isNaN(index)) {
    console.error("Invalid index from button:", target.dataset.index);
    return;
  }
  if (target.classList.contains("edit-btn")) {
    handleEdit(index);
  } else if (target.classList.contains("delete-btn")) {
    handleDelete(index);
  }
});

// Initial render
renderTable();
