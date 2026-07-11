document.addEventListener("DOMContentLoaded", () => {
    // 1. Check if a user is logged in via localStorage
    const savedUser = localStorage.getItem("currentUser");
    const authLink = document.querySelector("#auth-link");
    const profileAvatarImg = document.querySelector("#profileAvatar"); // Large avatar on profile page
    const avatarUrlInput = document.querySelector("#avatarUrl");       // Input field on profile page

    if (savedUser) {
        const currentUser = JSON.parse(savedUser);

        // 2. Safe check: fallback to default if image session is null or empty
        const userImage = (currentUser.image && String(currentUser.image).trim() !== "")
            ? currentUser.image
            : "./img/limbusUser.png";
            
        // 3. Update the navbar conversion icon (Runs on ALL pages)
        if (authLink) {
            authLink.href = "./profile.html";
            authLink.innerHTML = `<img src="${userImage}" alt="Profile" class="nav-user-icon">`;
        }

        // 4. Update the profile page elements (ONLY runs if the user is on the profile page)
        if (profileAvatarImg) {
            profileAvatarImg.src = userImage;
        }
        if (avatarUrlInput && currentUser.image) {
            // Only fill the input field if they have an actual custom upload string saved
            avatarUrlInput.value = currentUser.image;
        }
    }
});