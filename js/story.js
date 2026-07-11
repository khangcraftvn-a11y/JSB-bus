document.addEventListener("DOMContentLoaded", () => {
    // Check if a user is logged in via localStorage
    const savedUser = localStorage.getItem("currentUser");
    const authLink = document.querySelector("#auth-link");

    if (savedUser && authLink) {
        authLink.href = "./profile.html";

        const currentUser = JSON.parse(savedUser);

        const userImage = (currentUser.image && currentUser.image.trim() !== "")
            ? currentUser.image
            : "./img/limbusUser.png";
        authLink.innerHTML = `<img src="${userImage}" alt="Profile" class="nav-user-icon">`;
    }
});