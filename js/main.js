let shirtForm = document.getElementById("shirtForm");
let titleInput = document.getElementById("title");
let priceInput = document.getElementById("price");
let taxesInput = document.getElementById("taxes");
let discountInput = document.getElementById("discount");
let qrImageUrlInput = document.getElementById("qrImageUrl");
let countInput = document.getElementById("count");
let categoryInput = document.getElementById("category");
let totalSpan = document.getElementById("total");
let brandInput = document.getElementById("brand");

let tbody = document.getElementById("tbody");

let btnAdd = document.getElementById("btnAdd");
let btnCancel = document.getElementById("btnCancel");

let editModal = new bootstrap.Modal(document.getElementById("editModal"));
let editForm = document.getElementById("editForm");
let editIdInput = document.getElementById("editId");
let editTitleInput = document.getElementById("editTitle");
let editPriceInput = document.getElementById("editPrice");
let editDiscountInput = document.getElementById("editDiscount");
let editCountInput = document.getElementById("editCount");
let editCategoryInput = document.getElementById("editCategory");
let editQrImageUrlInput = document.getElementById("editQrImageUrl");
let btnSaveEdit = document.getElementById("btnSaveEdit");

let successToast = new bootstrap.Toast(document.getElementById("successToast"));
let errorToast = new bootstrap.Toast(document.getElementById("errorToast"));
