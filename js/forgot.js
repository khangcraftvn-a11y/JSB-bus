const forgotForm = document.querySelector("#forgot-password-form");

forgotForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.querySelector("#reset-email").value.trim();
    const newPassword = document.querySelector("#new-password").value.trim();
    const confirmPassword = document.querySelector("#confirm-new-password").value.trim();
    if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem("users", JSON.stringify(users));
        alert("Password updated successfully, Manager.");
        window.location.href = "./index.html";
    } else {
        alert("Email not found in our records!");
    }
});