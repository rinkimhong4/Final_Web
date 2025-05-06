let form = document.querySelector("form");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirmPassword").value;

  if (!name || !email || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  let user = {
    name: name,
    email: email,
    password: password,
  };

  localStorage.setItem("user", JSON.stringify(user));

  alert("Account created successfully!");

  window.location.href = "/auth/signin/login.html";
});
