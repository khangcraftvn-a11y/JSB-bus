document.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        alert("Access Denied! Manager data not found. Please log in first.");
        window.location.href = "./index.html"; 
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    let fullUserData = users.find(u => u.email === currentUser.email);

    if (!fullUserData) {
        alert("Sinner data out of sync. Please contact system admin.");
        return;
    }

    if (fullUserData.username) document.getElementById("profileName").value = fullUserData.username;
    if (fullUserData.email) document.getElementById("profileEmail").value = fullUserData.email;
    
    if (fullUserData.password) {
        document.getElementById("profilePasswordDisplay").value = "*".repeat(fullUserData.password.length);
    } else {
        document.getElementById("profilePasswordDisplay").value = "********";
    }

    // FIXED: Changed default avatar to use your local file directly for total design synergy
    const defaultAvatar = "./img/limbusUser.png"; 
    const profileAvatarImg = document.getElementById("profileAvatar");
    const avatarUrlInput = document.getElementById("avatarUrl");
    const fileInput = document.getElementById("fileInput");
    const authLink = document.getElementById("auth-link");

    // Converts the login button to the profile image 
    function updateNavbarIcon(imgSrc) {
        if (authLink) {
            authLink.href = "./profile.html";
            authLink.innerHTML = `<img src="${imgSrc}" alt="User Profile" class="nav-user-icon" />`;
        }
    }

    // Check session data (using the 'image' property matching your signup configuration)
    if (fullUserData.image && String(fullUserData.image).trim() !== "") {
        profileAvatarImg.src = fullUserData.image;
        avatarUrlInput.value = fullUserData.image;
        updateNavbarIcon(fullUserData.image);
    } else {
        profileAvatarImg.src = defaultAvatar;
        avatarUrlInput.value = "";
        updateNavbarIcon(defaultAvatar); // Converts login button to default asset on initial signup state
    }

    avatarUrlInput.addEventListener("click", function() {
        fileInput.click();
    });

    fileInput.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            const base64Image = event.target.result;

            profileAvatarImg.src = base64Image;
            avatarUrlInput.value = base64Image; 
            updateNavbarIcon(base64Image);

            // Saves directly to the 'image' session key created at signup
            fullUserData.image = base64Image;
            const userIndex = users.findIndex(u => u.email === fullUserData.email);
            if (userIndex !== -1) {
                users[userIndex] = fullUserData;
                localStorage.setItem("users", JSON.stringify(users));
            }

            currentUser.image = base64Image;
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
        };

        reader.readAsDataURL(file);
    });

    avatarUrlInput.addEventListener("paste", function(e) {
        e.preventDefault(); 
        
        const pastedText = (e.clipboardData || window.clipboardData).getData("text").trim();
        if (!pastedText) return;

        let finalImgPath = pastedText;

        if (!pastedText.startsWith("./") && !pastedText.startsWith("http") && !pastedText.startsWith("data:")) {
            finalImgPath = `./img/${pastedText}`;
        }

        avatarUrlInput.value = finalImgPath;
        if (profileAvatarImg) profileAvatarImg.src = finalImgPath;
        updateNavbarIcon(finalImgPath);

        fullUserData.image = finalImgPath;
        const userIndex = users.findIndex(u => u.email === fullUserData.email);
        if (userIndex !== -1) {
            users[userIndex] = fullUserData;
            localStorage.setItem("users", JSON.stringify(users));
        }

        currentUser.image = finalImgPath;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
    });
});