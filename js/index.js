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

window.addEventListener('scroll', function () {
    const header = document.getElementById('header');
    const targetDiv = document.getElementById('main-content');

    if (targetDiv) {
        const divTop = targetDiv.offsetTop;
        const divBottom = divTop + targetDiv.offsetHeight;
        const scrollPos = window.scrollY;

        if (scrollPos >= divTop && scrollPos <= divBottom) {
            header.classList.add('in-view');
        } else {
            header.classList.remove('in-view');
        }
    }
});

window.addEventListener("scroll", function () {
    const header = document.getElementById("header");

    if (window.scrollY === 0) {
        header.classList.add("in-view");
    } else {
        header.classList.remove("in-view");
    }
});