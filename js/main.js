        function playSound(audioId) {
            const audio = document.getElementById(audioId);
            document.querySelectorAll("audio").forEach(a => {
                a.pause();
                a.currentTime = 0;
            });
            audio.currentTime = 0;
            audio.play();
            audio.volume = 0.3;
        }
        document.getElementById("don").addEventListener("click", () => {
            playSound("sound1");
        });
        document.getElementById("susu").addEventListener("click", () => {
            playSound("sound2");
        });
        document.getElementById("rod").addEventListener("click", () => {
            playSound("sound3");
        });
        window.addEventListener("scroll", function () {
            const header = document.getElementById("header");
            const scrollY = window.scrollY;
            console.log("Scroll position:", scrollY);

            try {
                if (scrollY === 0) {
                    header.classList.add("hidden");
                    console.log("Navbar hidden at top");
                } else {
                    header.classList.remove("hidden");
                    console.log("Navbar visible when scrolling");
                }
            } catch (error) {
                console.log("Error toggling navbar:", error);
            }
        });

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('video');
}
document.getElementById("toggleSound").addEventListener("click", function () {
    if (player.isMuted()) {
        player.unMute();
    } else {
        player.mute();
    }
});

function playSound(audioId) {
    const audio = document.getElementById(audioId);
    document.querySelectorAll("audio").forEach(a => {
        a.pause();
        a.currentTime = 0;
    });
    audio.currentTime = 0;
    audio.play();
}
document.getElementById("don").addEventListener("click", () => {
    playSound("sound1");
});
document.getElementById("susu").addEventListener("click", () => {
    playSound("sound2");
});
document.getElementById("rod").addEventListener("click", () => {
    playSound("sound3");
});