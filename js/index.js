let loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let email = loginForm.email.value.trim().toLowerCase();
    let password = loginForm.password.value.trim();
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(u => u.email === email && u.password === password);

    if (user) {
        if (user.isBanned) {
            alert("This account has been terminated.");
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify({
            email: user.email,
            username: user.username,
            equippedTag: user.equippedTag || null
        }));

        alert("Welcome back, Manager.");
        window.location.href = "./main.html";
    } else {
        alert("Check your password or email.");
    }
});