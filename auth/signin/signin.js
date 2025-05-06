let form = document.querySelector("form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let emailInput = document.getElementById("email").value.trim();
  let passwordInput = document.getElementById("password").value;

  let storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser) {
    alert("No user found. Please sign up first.");
    return;
  }
  if (
    emailInput === storedUser.email &&
    passwordInput === storedUser.password
  ) {
    window.location.href = "/products/product.html";
  } else {
    alert("Invalid email or password.");
  }
});
