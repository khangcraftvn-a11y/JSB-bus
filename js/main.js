document.addEventListener("DOMContentLoaded", () => {
    // Check if a user is logged in via localStorage
    const savedUser = localStorage.getItem("currentUser");
    const authLink = document.querySelector("#auth-link");

    if (savedUser && authLink) {
        authLink.href = "./profile.html";

        const currentUser = JSON.parse(savedUser);

        // Reads the corrected '.image' session key from your signup object
        const userImage = (currentUser.image && String(currentUser.image).trim() !== "")
            ? currentUser.image
            : "./img/limbusUser.png"; // Fallback if image is null
            
        // Renders the user profile image inside the navbar
        authLink.innerHTML = `<img src="${userImage}" alt="Profile" class="nav-user-icon">`;
    }
});

// === CHARACTER AUDIO SYSTEM ===
function playSound(audioId) {
    const audio = document.getElementById(audioId);
    if (!audio) return;

    // Pause all other playing audio files
    document.querySelectorAll("audio").forEach(a => {
        a.pause();
        a.currentTime = 0;
    });

    // Reset and play the selected audio
    audio.currentTime = 0;
    audio.volume = 0.3; // Keeps the volume balanced
    audio.play();
}

// Audio Click Listeners
document.getElementById("don").addEventListener("click", () => {
    playSound("sound1");
});
document.getElementById("susu").addEventListener("click", () => {
    playSound("sound2");
});
document.getElementById("rod").addEventListener("click", () => {
    playSound("sound3");
});

// === HEADER/NAVBAR SCROLL SYSTEM ===
window.addEventListener("scroll", function () {
    const header = document.getElementById("header");
    const scrollY = window.scrollY;

    try {
        if (scrollY === 0) {
            header.classList.add("hidden");
        } else {
            header.classList.remove("hidden");
        }
    } catch (error) {
        console.error("Error toggling navbar:", error);
    }
});

// === YOUTUBE IFRAME BACKGROUND API ===
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('video');
}

// Toggle Sound Button for Youtube Video
document.getElementById("toggleSound").addEventListener("click", function () {
    if (player && typeof player.isMuted === "function") {
        if (player.isMuted()) {
            player.unMute();
        } else {
            player.mute();
        }
    }
});