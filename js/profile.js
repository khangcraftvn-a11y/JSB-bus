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

    if (fullUserData.image && fullUserData.image.trim() !== "") {
        document.getElementById("profileAvatar").src = fullUserData.image;
        document.getElementById("avatarUrl").value = fullUserData.image;
    } else {
        document.getElementById("profileAvatar").src = "https://via.placeholder.com/170/222222/F1BF02?text=No+Identity";
    }

    document.getElementById("avatarUrl").addEventListener("input", function(e) {
        const newImageUrl = e.target.value.trim();

        if (newImageUrl !== "") {
            document.getElementById("profileAvatar").src = newImageUrl;
        } else {
            document.getElementById("profileAvatar").src = "https://via.placeholder.com/170/222222/F1BF02?text=No+Identity";
        }

        fullUserData.image = newImageUrl;
        const userIndex = users.findIndex(u => u.username === fullUserData.username);
        if (userIndex !== -1) {
            users[userIndex] = fullUserData;
            localStorage.setItem("users", JSON.stringify(users));
        }

        currentUser.image = newImageUrl;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
    });
});