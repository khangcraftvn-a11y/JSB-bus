const form = document.querySelector("#register-form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.querySelector("#fullName").value.trim();
    const email = document.querySelector("#email").value.trim().toLowerCase(); // Convert to lowercase for safety
    const password = document.querySelector("#password").value.trim();
    const confirmPassword = document.querySelector("#confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const emailExists = users.some(u => u.email === email);

    if (emailExists) {
        alert("This email is already signed up!");
        return;
    }
    const newUser = {
        username: name,
        email: email,
        password: password,
        lunacy: 0,
        inventory: {},
        equippedTag: null,
        equippedId: "The Lord of Hongyuan Hong Lu"
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    alert("Yippeee!!! Account created successfully.");
    window.location.href = "./index.html";
});