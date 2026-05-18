const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const SOUND_GUIDANCE = new Audio("./sound/index.mp3");
const SOUND_SUCCESS = new Audio("./sound/index.mp3");
const SOUND_FAILED = new Audio("./sound/index.mp3");
const SOUND_WARNING = new Audio("./sound/index.mp3");
const BGM = new Audio("./sound/certainSinclairTheme.mp3");
let hasUndyingTriggered = false;
let undyingTurnsLeft = 0;
const lordUndyingSound = new Audio('./sound/lordUndying.wav');
lordUndyingSound.volume = 1;

const lordDeadSound = new Audio('./sound/lordDead.wav');
lordDeadSound.volume = 1;

const lordStartSound = new Audio('./sound/lordStart.wav');
lordStartSound.volume = 1;

const lordS2Sound = new Audio('./sound/lordS2.wav');
lordS2Sound.volume = 1;

const lordS3Sound = new Audio('./sound/lordS3.wav');
lordS3Sound.volume = 1;

const lordS4Sound = new Audio('./sound/lordS4.wav');
lordS4Sound.volume = 1;

const lordS5Sound = new Audio('./sound/lordS5.wav');
lordS5Sound.volume = 1;

const youStartSound = new Audio('./sound/youStart.wav');
youStartSound.volume = 1;

const youS2Sound = new Audio('./sound/youS2.wav');
youS2Sound.volume = 1;

const youS3Sound = new Audio('./sound/youS3.wav');
youS3Sound.volume = 1;

const youS4Sound = new Audio('./sound/youS4.wav');
youS4Sound.volume = 1;

const maoStartSound = new Audio('./sound/maoStart.wav');
maoStartSound.volume = 1;

const maoS3Sound = new Audio('./sound/maoS3.wav');
maoS3Sound.volume = 1;

const allSFX = [lordStartSound, lordDeadSound, lordUndyingSound, lordS2Sound, youStartSound, maoStartSound, maoS3Sound];
BGM.loop = true;
BGM.volume = 0.3;
const musicBtn = document.getElementById('music-toggle');
let isMuted = true;
musicBtn.classList.add('muted');
let userSkillChoices = [];
let awaitingSkillChoice = false;
let isFighting = false;
let canUserAttack = true;
let botCurrentRoll = 0;

let userHearts = 5;
let botHearts = 35;

function stopAllSFX() {
    allSFX.forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });
}

const userSkills = [
    { name: "I Wish to Open the Path", min: 4, max: 12, chance: 0.50 },                           // 50%
    { name: "Tarnished Blood's Absolute Cleaver of Ambitions", min: 4, max: 18, chance: 0.25 }, // 25%
    { name: "Answer Me, Heishou Packs", min: 12, max: 22, chance: 0.15 },                       // 15%
    { name: "Lonesome Stand: Sacrifice to Claim The Garden", min: 14, max: 30, chance: 0.10 }    // 10%
];
const sinclairSkills = [
    { name: "Downward Swing", min: 13, max: 20, chance: 0.50 },
    { name: "Halberd Combo", min: 14, max: 20, chance: 0.25 },
    { name: "Trench-specialized Spear Combat", min: 14, max: 29, chance: 0.25 },
    { name: "True Decapitation Deathblow", min: 14, max: 39, chance: 0.10 }
];

const shopItems = {
    "The Red Mist": { price: 16000, style: "background: linear-gradient(to right, #ff1a1a, #4d0000); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(255, 71, 71, 0.1)" },
    "The Black Silence": { price: 14500, style: "background: linear-gradient(to right, #8e9297, #2c2e33); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(142, 146, 151, 0.1)" },
    "The Wild Hunt": { price: 12500, style: "background: linear-gradient(to right, #A330FF, #32005a); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(163, 48, 255, 0.1)" },
    "Tamamo Cross": { price: 11000, style: "background: linear-gradient(to right, #00afff, #00364d); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(0, 175, 255, 0.1)" },
    "Paradise Lost": { price: 9000, style: "background: linear-gradient(to right, #ff7373, #5a0000); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(255, 115, 115, 0.1)" },
    "Justitia": { price: 7000, style: "background: linear-gradient(to right, #00ffc8, #004d3c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(0, 255, 200, 0.08)" },
    "Walpurgisnacht": { price: 5000, style: "background: linear-gradient(to right, #43b581, #0d2b1d); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(67, 181, 129, 0.1)" },
    "Lament": {
        price: 3000,
        style: "background: linear-gradient(90deg, #4b0082, #000000); -webkit-background-clip: text; -webkit-text-fill-color: transparent;",
        bg: "rgba(75, 0, 130, 0.15)"
    },
    "Catherine": {
        price: 8000,
        style: "background: linear-gradient(90deg, #ff69b4, #ffffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;",
        bg: "rgba(255, 105, 180, 0.15)"
    },
    "Manor Ghost": {
        price: 2500,
        style: "background: linear-gradient(90deg, #a9a9a9, #2f4f4f); -webkit-background-clip: text; -webkit-text-fill-color: transparent;",
        bg: "rgba(169, 169, 169, 0.15)"
    }
};

const allTagStyles = {
    "The Red Mist": { style: "background: linear-gradient(to right, #ff1a1a, #4d0000); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(255, 71, 71, 0.1)" },
    "The Black Silence": { style: "background: linear-gradient(to right, #8e9297, #2c2e33); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(142, 146, 151, 0.1)" },
    "The Wild Hunt": { style: "background: linear-gradient(to right, #A330FF, #32005a); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(163, 48, 255, 0.1)" },
    "Tamamo Cross": { style: "background: linear-gradient(to right, #00afff, #00364d); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(0, 175, 255, 0.1)" },
    "Paradise Lost": { style: "background: linear-gradient(to right, #ff7373, #5a0000); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(255, 115, 115, 0.1)" },
    "Justitia": { style: "background: linear-gradient(to right, #00ffc8, #004d3c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(0, 255, 200, 0.08)" },
    "Walpurgisnacht": { style: "background: linear-gradient(to right, #43b581, #0d2b1d); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(67, 181, 129, 0.1)" },
    "Lament": { style: "background: linear-gradient(90deg, #4b0082, #000000); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(75, 0, 130, 0.15)" },
    "Catherine": { style: "background: linear-gradient(90deg, #ff69b4, #ffffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(255, 105, 180, 0.15)" },
    "Manor Ghost": { style: "background: linear-gradient(90deg, #a9a9a9, #2f4f4f); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(169, 169, 169, 0.15)" }
};

function stopAllSFX() {
    allSFX.forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });
}

const flashOverlay = document.createElement("div");
flashOverlay.id = "flashbang-overlay";
document.body.appendChild(flashOverlay);

const sparkContainer = document.createElement("div");
sparkContainer.id = "spark-container";
document.body.appendChild(sparkContainer);

for (let i = 0; i < 15; i++) {
    const spark = document.createElement("div");
    spark.className = "spark";
    spark.style.left = Math.random() * 100 + "vw";
    spark.style.top = Math.random() * 100 + "vh";
    sparkContainer.appendChild(spark);
}

let audioContext;
let analyser;
let dataArray;
let source;

function analyzeVolume() {
    requestAnimationFrame(analyzeVolume);

    if (!analyser) return;

    analyser.getByteFrequencyData(dataArray);

    let total = 0;
    for (let i = 0; i < dataArray.length; i++) {
        total += dataArray[i];
    }
    const averageVolume = total / dataArray.length;

    const bgVideo = document.querySelector("video") || document.querySelector(".bg-video");

    if (bgVideo) {
        const baseScale = 1.00;

        const zoomIntensity = averageVolume / 800;
        const dynamicScale = baseScale + zoomIntensity;

        bgVideo.style.transform = `translate(-50%, -50%) scale(${dynamicScale})`;

        const volumeThreshold = 1;
        const sparks = document.querySelectorAll(".spark");

        if (averageVolume > volumeThreshold) {
            sparks.forEach(spark => {
                if (Math.random() > 0.1) {
                    spark.classList.add("pop");
                    spark.style.left = Math.random() * 100 + "vw";
                    spark.style.top = Math.random() * 100 + "vh";
                }
            });
        } else {
            sparks.forEach(spark => {
                spark.classList.remove("pop");
            });
        }
    }
}

function initAudioAnalyzer() {
    if (typeof BGM === 'undefined' || !BGM) {
        console.warn("BGM object is not defined yet.");
        return;
    }

    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();

        source = audioContext.createMediaElementSource(BGM);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        analyzeVolume();
    }
}

document.addEventListener("click", () => {
    initAudioAnalyzer();
    if (audioContext && audioContext.state === "suspended") {
        audioContext.resume();
    }
}, { once: true });

// Toggle Sound
musicBtn.addEventListener('click', () => {
    isMuted = !isMuted;

    if (isMuted) {
        BGM.pause();
        musicBtn.classList.add('muted');
        musicBtn.innerText = "TOGGLE MUSIC";
    } else {
        BGM.play().catch(err => {
            console.log("Playback blocked. Try clicking again.");
        });
        musicBtn.classList.remove('muted');
    }
});
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const chatDropdown = document.getElementById('chat-dropdown');
const arrowIcon = document.getElementById('arrow-icon');

chatToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    chatDropdown.classList.toggle('show');
    arrowIcon.classList.toggle('arrow-down');
});
window.onclick = function (event) {
    if (!event.target.matches('#chat-toggle-btn')) {
        if (chatDropdown.classList.contains('show')) {
            chatDropdown.classList.remove('show');
            arrowIcon.classList.remove('arrow-down');
        }
    }
}

let lastGambleTime = 0;
const SANCHO_ICON = "./img/certainSinclair.jpg";
const USER_ICON = "./img/lordHongyuan.png";
const DANTE_ICON = "./img/dante.png";

// Local Storage
let users = JSON.parse(localStorage.getItem("users")) || [];
let loggedInSession = JSON.parse(localStorage.getItem("currentUser"));
let currentUserIndex = users.findIndex(u => u.email === (loggedInSession ? loggedInSession.email : ""));

if (currentUserIndex !== -1 && users[currentUserIndex].email === "khangcraftvn@gmail.com") {
    const admin = users[currentUserIndex];
    if (!admin.hasAdminBonus) {
        admin.lunacy = (admin.lunacy || 0) + 0;
        if (!admin.inventory) admin.inventory = {};
        admin.inventory["10-Pull Extraction Ticket"] = (admin.inventory["10-Pull Extraction Ticket"] || 0) + 0;
        admin.inventory["1-Pull Extraction Ticket"] = (admin.inventory["1-Pull Extraction Ticket"] || 0) + 0;
        admin.hasAdminBonus = true;
        saveUserData();

        console.log("Manager privileges granted.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('.bg-fullscreen-video');

    if (video) {
        video.muted = false;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaElementSource(video);
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 0;
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        let playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                video.muted = true;
                video.play();

                const unmuteAndBoost = () => {
                    audioCtx.resume();
                    video.muted = false;
                    document.removeEventListener('click', unmuteAndBoost);
                };
                document.addEventListener('click', unmuteAndBoost);
            });
        }
    }
});

function saveUserData() {
    localStorage.setItem("users", JSON.stringify(users));
    const updatedUser = users[currentUserIndex];
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    const container = document.getElementById("nametag-container");
    if (container) container.innerHTML = getUsername();
}

function updateStorage(amount) {
    if (currentUserIndex !== -1) {
        users[currentUserIndex].lunacy = Math.max(0, (users[currentUserIndex].lunacy || 0) + amount);
        saveUserData();
    }
}

function addItemToInventory(itemName, amount) {
    if (currentUserIndex === -1) return;
    if (!users[currentUserIndex].inventory) users[currentUserIndex].inventory = {};

    let currentAmount = users[currentUserIndex].inventory[itemName] || 0;
    users[currentUserIndex].inventory[itemName] = Math.max(0, currentAmount + amount);
    saveUserData();
}

function addIdToCollection(idName, sinnerName) {
    if (currentUserIndex === -1) return;
    if (!users[currentUserIndex].collection) users[currentUserIndex].collection = {};
    if (!users[currentUserIndex].collection[sinnerName]) users[currentUserIndex].collection[sinnerName] = [];

    if (!users[currentUserIndex].collection[sinnerName].includes(idName)) {
        users[currentUserIndex].collection[sinnerName].push(idName);
        saveUserData();
    }
}

function getBalance() {
    return currentUserIndex !== -1 ? (users[currentUserIndex].lunacy || 0) : 0;
}

function getUsername() {
    const session = JSON.parse(localStorage.getItem("currentUser"));
    if (!session || !session.username) return "Dante";

    const tagKey = session.equippedTag;
    const tag = allTagStyles[tagKey];

    if (tag) {
        return `
            <div style="background: ${tag.bg}; padding: 2px 10px; border-radius: 4px; display: inline-flex; align-items: center; vertical-align: middle;">
                <span style="${tag.style} font-weight: bold; font-family: 'Courier New', monospace;">${session.username}</span>
            </div>
        `;
    }

    // Default if no tag is found
    return `<span style="color: #ffcc00; font-weight: bold;">${session.username}</span>`;
}

let activeQuest = null;
let questTimer = null;
let messageCounter = 0;

const sinnersList = ["Yi Sang", "Faust", "Don Quixote", "Ryōshū", "Meursault", "Hong Lu", "Heathcliff", "Ishmael", "Rodion", "Sinclair", "Outis", "Gregor"];
const extractionPool = [
    "[LCB Sinner] Yi Sang", "[Seven Assoc. South Section 6] Yi Sang", "[Blade Lineage Salsu] Yi Sang", "[Effloresced E.G.O::Spicebush] Yi Sang", "[Molar Office Fixer] Yi Sang", "[W Corp. L3 Cleanup Agent] Yi Sang", "[The Pequod First Mate] Yi Sang", "[Dieci Assoc. South Section 4] Yi Sang", "[The Ring Pointillist Student] Yi Sang", "[LCE E.G.O::Lantern] Yi Sang", "[Liu Assoc. South Section 3] Yi Sang", "[N Corp. E.G.O::Fell Bullet] Yi Sang", "[Heishou Pack - Wu Branch Adept] Yi Sang", "[The House of Spiders:The Index Nursefather] Yi Sang",
    "[LCB Sinner] Faust", "[W Corp. L2 Cleanup Agent] Faust", "[Lobotomy Corp. Remnant] Faust", "[The One Who Grips] Faust", "[Zwei Assoc. South Section 4] Faust", "[Seven Assoc. South Section 4] Faust", "[Lobotomy E.G.O::Regret] Faust", "[Blade Lineage Salsu] Faust", "[Wuthering Heights Butler] Faust", "[MultiCrack Office Rep] Faust", "[LCE E.G.O::Ardor Blossom Star] Faust", "[Heishou Pack - Mao Branch Adept] Faust", "[Shi Assoc. East Section 3] Faust", "[The Index Proselyte:【Paper Slip】] Faust", "[The House of Spiders:The Ring Apprentice] Faust",
    "[LCB Sinner] Don Quixote", "[W Corp. L3 Cleanup Agent] Don Quixote", "[Shi Assoc. South Section 5 Director] Don Quixote", "[N Corp. Mittelhammer] Don Quixote", "[Cinq Assoc. South Section 5 Director] Don Quixote", "[The Middle Little Sister] Don Quixote", "[Lobotomy E.G.O::Lantern] Don Quixote", "[Blade Lineage Salsu] Don Quixote", "[T Corp. Class 3 Collection Staff] Don Quixote", "[The Manager of La Manchaland] Don Quixote", "[Cinq Assoc. East Section 3] Don Quixote", "[Lobotomy E.G.O::In the Name of Love and Hate] Don Quixote", "[Heishou Pack - Wei Branch] Don Quixote", "[The Index Proxy - Effloresced E.G.O::Procuration] Don Quixote",
    "[LCB Sinner] Ryōshū", "[Seven Assoc. South Section 6] Ryōshū", "[Kurokumo Clan Wakashu] Ryōshū", "[R.B. Chef de Cuisine] Ryōshū", "[W Corp. L3 Cleanup Agent] Ryōshū", "[LCCB Assistant Manager] Ryōshū",
    "[LCB Sinner] Meursault", "[Seven Assoc. South Section 6] Meursault", "[Kurokumo Clan Wakashu] Meursault", "[R.B. Sous-chef] Meursault", "[W Corp. L2 Cleanup Agent] Meursault", "[LCCB Assistant Manager] Meursault",
    "[LCB Sinner] Hong Lu", "[The Lord of Hongyuan] Hong Lu", "[Kurokumo Clan Wakashu] Hong Lu", "[Tingtang Gang Gangleader] Hong Lu", "[W Corp. L3 Cleanup Agent] Hong Lu", "[Dieci Assoc. South Section 4] Hong Lu", "[The Ring Pointillist Student] Hong Lu",
    "[LCB Sinner] Heathcliff", "[Shi Assoc. South Section 5] Heathcliff", "[N Corp. Kleinhammer] Heathcliff", "[Seven Assoc. South Section 4] Heathcliff", "[R Corp. 4th Pack Rabbit] Heathcliff", "[Lobotomy E.G.O::Sunshower] Heathcliff", "[The Pequod Harpooneer] Heathcliff", "[Öufi Assoc. South Section 3] Heathcliff", "[Wild Hunt] Heathcliff",
    "[LCB Sinner] Ishmael", "[Shi Assoc. South Section 5] Ishmael", "[LCCB Assistant Manager] Ishmael", "[Lobotomy E.G.O::Sloshing] Ishmael", "[Edgar Family Butler] Ishmael", "[R Corp. 4th Pack Reindeer] Ishmael", "[Liu Assoc. South Section 4] Ishmael", "[Molar Boatworks Fixer] Ishmael", "[The Pequod Captain] Ishmael",
    "[LCB Sinner] Rodion", "[Kurokumo Clan Wakashu] Rodion", "[Molar Boatworks Fixer] Rodion", "[Rosespanner Workshop] Rodion", "[N Corp. Signhammer] Rodion", "[Dieci Association South Section 4] Rodion",
    "[LCB Sinner] Sinclair", "[Zwei Assoc. South Section 6] Sinclair", "[Blade Lineage Mentor] Sinclair", "[The One Who Grips] Sinclair", "[Molar Boatworks Fixer] Sinclair", "[The Pequod First Mate] Sinclair",
    "[LCB Sinner] Outis", "[Blade Lineage Salsu] Outis", "[Seven Assoc. South Section 4] Outis", "[Cinq Assoc. South Section 4] Outis", "[Kurokumo Clan Captain] Outis",
    "[LCB Sinner] Gregor", "[Liu Assoc. South Section 6] Gregor", "[R.B. Sous-chef] Gregor", "[Rosespanner Workshop Fixer] Gregor", "[Kurokumo Clan Captain] Gregor", "[G Corp. Manager Corporal] Gregor"
];

const prescriptPool = [
    { text: "Attempt to acquire a new <b>Identity</b>.", id: "EXTRACT" },
    { text: "Chat with <b>Sancho</b> for more 30 seconds.", id: "STAY" },
    { text: "Try to earn <b>100 - 150 Lunacy</b>.", id: "GAMBLE_WIN" },
    { text: "Refrain from speaking for 30 seconds. Do not send a message for 30 seconds.", id: "SILENCE" },
    { text: "Nothing happens, feel lucky.", id: "LUCK" },
    { text: "Send 8 messages for <b>Sancho</b>.", id: "MESSAGES" }
];

function highlightNametags(text) {
    let highlightedText = text;
    Object.keys(shopItems).forEach(itemName => {
        const item = shopItems[itemName];
        const styledTag = `
            <div style="background: ${item.bg}; padding: 1px 6px; border-radius: 4px; display: inline-block; vertical-align: middle; line-height: 1.2;">
                <span style="${item.style} font-weight: bold; font-size: 0.95em;">${itemName}</span>
            </div>
        `;
        const regex = new RegExp(`\\b${itemName}\\b`, 'g');
        highlightedText = highlightedText.replace(regex, styledTag);
    });

    return highlightedText;
}

function addMessage(sender, text, side, icon) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${side}-msg`;
    const processedText = highlightNametags(text);

    let finalIcon = icon;
    let themeColor = "#5cada7";

    if (side === "user") {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const currentId = currentUser ? currentUser.equippedId : "The Lord of Hongyuan Hong Lu";

        if (currentId === "The Lord of Hongyuan Hong Lu") {
            finalIcon = "./img/lordHongyuan.png";
            themeColor = "#5cada7";
        } else if (currentId === "Heishou Pack - Mao Branch Adept Faust") {
            finalIcon = "./img/maoFaust.png";
            themeColor = "#a1c738";
        } else if (currentId === "Heishou Pack - You Branch Adept Heathcliff") {
            finalIcon = "./img/youHeathcliff.png";
            themeColor = "#ba2727";
        }
    }

    let nameHtml = (sender === "A Certain Sinclair") ?
        `<div class="sancho-name">${sender}</div>` :
        `<div class="sender-name" style="display: flex; align-items: center;">${sender}</div>`;

    // Inline style adjustments apply custom coloring directly to the user's elements
    msgDiv.innerHTML = `
        <img src="${finalIcon}" class="icon" style="${side === 'user' ? `border-color: ${themeColor}; box-shadow: 0 0 10px ${themeColor};` : ''}">
        <div class="message-content">
            ${nameHtml}
            <div class="bubble" style="${side === 'user' ? `border-right: 4px solid ${themeColor}; border-left: none;` : ''}">
                ${processedText}
            </div>
        </div>
    `;

    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function endQuest(success, reward = true) {
    clearTimeout(questTimer);
    activeQuest = null;
    messageCounter = 0;
    setTimeout(() => {
        if (success) {
            SOUND_SUCCESS.currentTime = 0;
            SOUND_SUCCESS.play().catch(e => console.log("Sound blocked"));

            addMessage("Sancho", "<b>PRESCRIPT COMPLETED.</b>", "bot", SANCHO_ICON);
            if (reward) {
                addMessage("Sancho", "Earn <b>100 Lunacy</b>.", "bot", SANCHO_ICON);
                updateStorage(100);
            }
        } else {
            SOUND_FAILED.currentTime = 0;
            SOUND_FAILED.play().catch(e => console.log("Sound blocked"));

            addMessage("Sancho", "<b>PRESCRIPT FAILED.</b>", "bot", SANCHO_ICON);
        }
    }, 1000);
}

// Main
function handleInput() {
    const text = userInput.value.trim();
    if (!text) return;
    const currentStyledName = getUsername();

    if (activeQuest === "SILENCE") {
        addMessage(currentStyledName, text, "user", USER_ICON);
        userInput.value = "";
        endQuest(false);
        return;
    }

    addMessage(currentStyledName, text, "user", USER_ICON);
    userInput.value = "";
    const command = text.toLowerCase();

    const args = command.split(" ");
    const baseCommand = args[0];
    const choiceArg = args[1];

    if (activeQuest === "MESSAGES" && command !== "?prescript") {
        messageCounter++;
        if (messageCounter >= 8) endQuest(true);
    }

    if (command === "hi" || command === "hello") {
        setTimeout(() => {
            addMessage("A Certain Sinclair", "Though now, I've come to realize that knowledge holds no real answers.", "bot", SANCHO_ICON);
        }, 500);
    }

    else if (command === "?stat sinclair") {
        const currentBotHearts = botHearts > 0 ? "❤️".repeat(botHearts) : "Defeated";

        const statInfo = `
            <b>A Certain Sinclair</b><br>
            ---------------------------<br>
            <b>Level:</b> 80<br>
            <b>HP:</b> ${currentBotHearts}<br>
            <b>Skills:</b><br>
            • Downward Swing [5 - 10]<br>
            • Halberd Combo [8 - 17]<br>
            • Trench-specialized Spear Combat [10 - 25]<br>
            • True Decapitation Deathblow [12 - 30]
        `;

        if (typeof RYOSHU_ICON !== 'undefined') {
            addMessage("Ryōshū", statInfo, "bot", RYOSHU_ICON);
        } else if (typeof WILD_HUNT_ICON !== 'undefined') {
            addMessage("Wild Hunt", statInfo, "bot", WILD_HUNT_ICON);
        } else {
            addMessage("A Certain Sinclair", statInfo, "bot", SANCHO_ICON);
        }
    }
    else if (command.startsWith("?stat")) {
        if (command === "?stat sinclair") {
            const currentBotHearts = botHearts > 0 ? "❤️".repeat(botHearts) : "Defeated";
            const statInfo = `
                <b>A Certain Sinclair</b><br>
                ---------------------------<br>
                <b>Level:</b> 80<br>
                <b>HP:</b> ${currentBotHearts}<br>
                <b>Skills:</b><br>
                • Downward Swing [5 - 10]<br>
                • Halberd Combo [8 - 17]<br>
                • Trench-specialized Spear Combat [10 - 25]<br>
                • True Decapitation Deathblow [12 - 30]
            `;

            if (typeof RYOSHU_ICON !== 'undefined') {
                addMessage("Ryōshū", statInfo, "bot", RYOSHU_ICON);
            } else if (typeof WILD_HUNT_ICON !== 'undefined') {
                addMessage("Wild Hunt", statInfo, "bot", WILD_HUNT_ICON);
            } else {
                addMessage("A Certain Sinclair", statInfo, "bot", SANCHO_ICON);
            }
            return;
        }

        setTimeout(() => {
            let targetInput = command.substring(5).trim().toLowerCase();
            let identityName = "";

            let currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

            if (!targetInput) {
                targetInput = currentUser && currentUser.equippedId ? currentUser.equippedId.toLowerCase() : "hongyuan";
            }

            if (targetInput.includes("hongyuan") || targetInput.includes("hong lu")) {
                identityName = "The Lord of Hongyuan Hong Lu";
            } else if (targetInput.includes("faust") || targetInput.includes("mao")) {
                identityName = "Heishou Pack - Mao Branch Adept Faust";
            } else if (targetInput.includes("heathcliff") || targetInput.includes("you")) {
                identityName = "Heishou Pack - You Branch Adept Heathcliff";
            }

            let currentHearts = "";

            const baseMaxHP = (identityName === "Heishou Pack - Mao Branch Adept Faust") ? 7 : (identityName === "Heishou Pack - You Branch Adept Heathcliff") ? 6 : 5;

            if (typeof isFighting !== 'undefined' && isFighting) {
                let heartCheck = undefined;

                if (currentUser && currentUser.idHealth && currentUser.idHealth[identityName] !== undefined) {
                    heartCheck = currentUser.idHealth[identityName];
                } else if (typeof userHearts !== 'undefined' && currentUser.equippedId === identityName) {
                    heartCheck = userHearts;
                }

                if (heartCheck === undefined || heartCheck === null) {
                    heartCheck = baseMaxHP;
                }

                let validHearts = parseInt(heartCheck);
                if (isNaN(validHearts) || validHearts < 0) {
                    currentHearts = "Defeated";
                } else {
                    currentHearts = validHearts > 0 ? "❤️".repeat(validHearts) : "Defeated";
                }
            } else {
                currentHearts = "❤️".repeat(baseMaxHP);
            }

            let statDisplay = "";

            if (identityName === "Heishou Pack - Mao Branch Adept Faust") {
                statDisplay = `
                    <b>${identityName}</b><br>
                    ---------------------------<br>
                    <b>Level:</b> 60<br>
                    <b>HP:</b> ${currentHearts}<br>
                    <b>Skills:</b><br>
                    • Blinkstep [3 - 13]<br>
                    • Clearing the Path, My Lord. [5 - 18]<br>
                    • Traceless to Sight and Sound Alike. [11 - 23]<br>
                    • Ascendant Heishou - Mao Technique: Cloudsplitting Manifestation [11 - 29]
                `;
            } else if (identityName === "Heishou Pack - You Branch Adept Heathcliff") {
                statDisplay = `
                    <b>${identityName}</b><br>
                    ---------------------------<br>
                    <b>Level:</b> 60<br>
                    <b>HP:</b> ${currentHearts}<br>
                    <b>Skills:</b><br>
                    • Peck 'em [5 - 11]<br>
                    • Mutilating Talons [8 - 16]<br>
                    • Bloodflame Massacre [9 - 25]<br>
                    • Rooster's Rampaging Blades Under the Ensanguined Heaven [9 - 30]
                `;
            } else if (identityName === "The Lord of Hongyuan Hong Lu") {
                statDisplay = `
                    <b>The Lord of Hongyuan Hong Lu</b><br>
                    ---------------------------<br>
                    <b>Level:</b> 60<br>
                    <b>HP:</b> ${currentHearts}<br></br>
                    <b>Combat Passives:</b><br>
                    • <b>Undying Stand:</b> Upon receiving fatal damage, forces health to clamp at 1 HP. Grants a temporary grace period where incoming damage is completely nullified, allowing for one final strategic clash before collapsing.<br>
                    • Using the skill <b>"Answer Me, Heishou Packs" [12 - 22]</b> grants powerful conditional skill pool overrides for the next attack turn:<br>
                    
                    ▪ <b>Heishou Keenclaw (Allies Alive):</b><br>
                    <ul style="margin: 5px 0 10px 15px; padding-left: 15px; font-size: 0.95em;">
                        <li>If your team members are alive, the draw rates for <b>"Traceless to Sight and Sound Alike."</b> (Faust) and <b>"Bloodflame Massacre"</b> (Heathcliff) are forced to <b>100%</b>.</li>
                        <li>The draw chance for <b>The Lord of Hongyuan Hong Lu</b>'s own skill <b>"I Carve the Path of a Lord" [10 - 25]</b> increases to <b>100%</b>.</li>
                        <li>Choosing any of these buffed skills will immediately reset all percentages back to normal.</li>
                    </ul>
                    
                    ▪ <b>The Heishou Lord (Allies Fallen):</b><br>
                    <ul style="margin: 5px 0 10px 15px; padding-left: 15px; font-size: 0.95em;">
                        <li>If both <b>Faust</b> and <b>Heathcliff</b> are dead (HP &le; 0), the selection system changes entirely.</li>
                        <li>Forces the draw rate of Hong Lu's skill <b>"Lonesome Stand: Sacrifice to Claim The Garden" [14 - 27]</b> to <b>100%</b> on the next turn.</li>
                    </ul>
                    
                    ▪ <b>System Constraints (Mechanics):</b><br>
                    <ul style="margin: 5px 0 10px 15px; padding-left: 15px; font-size: 0.95em;">
                        <li>The skills <b>"I Carve the Path of a Lord"</b> and <b>"Lonesome Stand"</b> have a base draw chance of <b>0%</b>.</li>
                        <li>They stay completely locked unless unlocked by using <b>"Answer Me, Heishou Packs"</b> first.</li>
                    </ul>
                    
                    ▪ <b>System Constraints (Parameters):</b><br>
                    <ul style="margin: 5px 0 5px 15px; padding-left: 15px; font-size: 0.95em;">
                        <li>Both skills retain a default baseline manifestation index of <b>0%</b>.</li>
                        <li>Access parameters remain strictly locked unless authorized through the prior engagement of <b>"Answer Me, Heishou Packs"</b>.</li>
                    </ul><br>
                    <b>Skills:</b><br>
                    • I Wish to Open the Path [4 - 12]<br>
                    • Tarnished Blood's Absolute Cleaver of Ambitions [4 - 18]<br>
                    • Answer Me, Heishou Packs [12 - 22]<br>
                    • I Carve the Path of a Lord [10 - 25]<br>
                    • Lonesome Stand: Sacrifice to Claim The Garden [14 - 27]
                `;
            } else {
                addMessage(getUsername(), "Invalid identity profile.", "user", USER_ICON);
                return;
            }

            addMessage(getUsername(), statDisplay, "user", USER_ICON);
        }, 500);
    }

    else if (command === "?ids") {
        setTimeout(() => {
            let currentUser = JSON.parse(localStorage.getItem("currentUser"));
            const currentId = currentUser ? currentUser.equippedId : "The Lord of Hongyuan Hong Lu";
            let healthState = currentUser && currentUser.idHealth ? currentUser.idHealth : {
                "The Lord of Hongyuan Hong Lu": 5,
                "Heishou Pack - Mao Branch Adept Faust": 7,
                "Heishou Pack - You Branch Adept Heathcliff": 6
            };

            const isHongLuDead = isFighting && healthState["The Lord of Hongyuan Hong Lu"] <= 0;
            const isFaustDead = isFighting && healthState["Heishou Pack - Mao Branch Adept Faust"] <= 0;
            const isHeathcliffDead = isFighting && healthState["Heishou Pack - You Branch Adept Heathcliff"] <= 0;

            let id1 = "The Lord of Hongyuan Hong Lu";
            if (currentId === "The Lord of Hongyuan Hong Lu") id1 += " <b>(equipped)</b>";
            if (isHongLuDead) id1 += " ❌";

            let id2 = "Heishou Pack - Mao Branch Adept Faust";
            if (currentId === "Heishou Pack - Mao Branch Adept Faust") id2 += " <b>(equipped)</b>";
            if (isFaustDead) id2 += " ❌";

            let id3 = "Heishou Pack - You Branch Adept Heathcliff";
            if (currentId === "Heishou Pack - You Branch Adept Heathcliff") id3 += " <b>(equipped)</b>";
            if (isHeathcliffDead) id3 += " ❌";

            const idsText = `
                <b>AVAILABLE IDENTITIES:</b><br>
                • ${id1}<br>
                • ${id2}<br>
                • ${id3}
            `;
            addMessage(getUsername(), idsText, "user", USER_ICON);
        }, 500);
    }

    else if (command.startsWith("?change ")) {
        setTimeout(() => {
            if (isFighting && !canChangeIdThisTurn) {
                let activeBotName = typeof RYOSHU_ICON !== 'undefined' ? "Ryōshū" : typeof WILD_HUNT_ICON !== 'undefined' ? "Wild Hunt" : "A Certain Sinclair";
                let botIcon = typeof RYOSHU_ICON !== 'undefined' ? RYOSHU_ICON : typeof WILD_HUNT_ICON !== 'undefined' ? WILD_HUNT_ICON : SANCHO_ICON;
                addMessage("Dante", "You can only change your Identity once per turn!", "user", DANTE_ICON);
                return;
            }

            const targetIdInput = command.substring(8).trim().toLowerCase();
            let targetIdName = "";

            if (targetIdInput.includes("hongyuan") || targetIdInput.includes("hong lu")) {
                targetIdName = "The Lord of Hongyuan Hong Lu";
            } else if (targetIdInput.includes("faust") || targetIdInput.includes("mao")) {
                targetIdName = "Heishou Pack - Mao Branch Adept Faust";
            } else if (targetIdInput.includes("heathcliff") || targetIdInput.includes("you")) {
                targetIdName = "Heishou Pack - You Branch Adept Heathcliff";
            }

            if (targetIdName) {
                let currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

                if (!currentUser.idHealth) {
                    currentUser.idHealth = {
                        "The Lord of Hongyuan Hong Lu": 5,
                        "Heishou Pack - You Branch Adept Heathcliff": 6,
                        "Heishou Pack - Mao Branch Adept Faust": 7
                    };
                }

                if (isFighting && currentUser.idHealth[targetIdName] <= 0) {
                    let activeBotName = typeof RYOSHU_ICON !== 'undefined' ? "Ryōshū" : typeof WILD_HUNT_ICON !== 'undefined' ? "Wild Hunt" : "A Certain Sinclair";
                    let botIcon = typeof RYOSHU_ICON !== 'undefined' ? RYOSHU_ICON : typeof WILD_HUNT_ICON !== 'undefined' ? WILD_HUNT_ICON : SANCHO_ICON;

                    addMessage("Dante", `❌ Cannot switch to <b>${targetIdName} (Dead)</b>! Choose a living squad member.`, "user", DANTE_ICON);
                    return;
                }

                currentUser.equippedId = targetIdName;

                if (isFighting) {
                    if (!currentUser.skillsUsedThisTurn) {
                        currentUser.skillsUsedThisTurn = {
                            "The Lord of Hongyuan Hong Lu": false,
                            "Heishou Pack - You Branch Adept Heathcliff": false,
                            "Heishou Pack - Mao Branch Adept Faust": false
                        };
                    }

                    if (currentUser.idHealth[targetIdName] === undefined || isNaN(currentUser.idHealth[targetIdName])) {
                        currentUser.idHealth[targetIdName] = (targetIdName === "Heishou Pack - Mao Branch Adept Faust") ? 7 : (targetIdName === "Heishou Pack - You Branch Adept Heathcliff") ? 6 : 5;
                    }

                    userHearts = currentUser.idHealth[targetIdName];

                    awaitingSkillChoice = false;
                    canUserAttack = true;
                    canChangeIdThisTurn = false;
                }

                localStorage.setItem("currentUser", JSON.stringify(currentUser));

                let users = JSON.parse(localStorage.getItem("users")) || [];
                let userIndex = users.findIndex(u => u.username === currentUser.username);
                if (userIndex !== -1) {
                    users[userIndex].equippedId = targetIdName;
                    localStorage.setItem("users", JSON.stringify(users));
                }

                addMessage(getUsername(), `Changed active Identity setup to: <b>${targetIdName}</b>.`, "user", USER_ICON);

                if (isFighting) {
                    let activeBotName = typeof RYOSHU_ICON !== 'undefined' ? "Ryōshū" : typeof WILD_HUNT_ICON !== 'undefined' ? "Wild Hunt" : "A Certain Sinclair";
                    let botIcon = typeof RYOSHU_ICON !== 'undefined' ? RYOSHU_ICON : typeof WILD_HUNT_ICON !== 'undefined' ? WILD_HUNT_ICON : SANCHO_ICON;

                    // Display system matching conditions with "X" flags for dead targets
                    const currentHpState = (userHearts > 0 && !isNaN(userHearts)) ? "❤️".repeat(userHearts) : "❌ (Dead)";
                    const hasActionLeft = !currentUser.skillsUsedThisTurn[targetIdName];
                }
            } else {
                addMessage(getUsername(), "Invalid Identity Name. Double check your spelling.", "user", USER_ICON);
            }
        }, 500);
    }

    else if (command === "?fight sinclair") {
        if (isFighting) {
            let activeBotName = typeof RYOSHU_ICON !== 'undefined' ? "Ryōshū" : typeof WILD_HUNT_ICON !== 'undefined' ? "Wild Hunt" : "A Certain Sinclair";
            addMessage(activeBotName, "Clash already in progress. Face your current judgment.", "bot", typeof RYOSHU_ICON !== 'undefined' ? RYOSHU_ICON : typeof WILD_HUNT_ICON !== 'undefined' ? WILD_HUNT_ICON : SANCHO_ICON);
            return;
        }

        isFighting = true;
        canChangeIdThisTurn = true;
        botHearts = 35;

        let currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

        currentUser.idHealth = {
            "The Lord of Hongyuan Hong Lu": 5,
            "Heishou Pack - You Branch Adept Heathcliff": 6,
            "Heishou Pack - Mao Branch Adept Faust": 7
        };

        currentUser.skillsUsedThisTurn = {
            "The Lord of Hongyuan Hong Lu": false,
            "Heishou Pack - You Branch Adept Heathcliff": false,
            "Heishou Pack - Mao Branch Adept Faust": false
        };

        currentUser.hasUndyingTriggered = false;
        currentUser.undyingTurnsLeft = 0;

        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        const currentId = currentUser.equippedId || "The Lord of Hongyuan Hong Lu";
        userHearts = currentUser.idHealth[currentId];

        let botName = "A Certain Sinclair";
        let botIcon = SANCHO_ICON;

        if (typeof RYOSHU_ICON !== 'undefined') {
            botName = "Ryōshū";
            botIcon = RYOSHU_ICON;
        } else if (typeof WILD_HUNT_ICON !== 'undefined') {
            botName = "Wild Hunt";
            botIcon = WILD_HUNT_ICON;
        }

        addMessage(botName, `The smoke... was blue. <b>Fight Accepted</b>.`, "bot", botIcon);

        let dialogueText = "";
        if (currentId === "The Lord of Hongyuan Hong Lu") {
            dialogueText = `I command the <b>twelve beasts</b>, do not let a single one who <b>breathes</b> before you live.`;
            stopAllSFX();
            lordStartSound.play().catch(error => console.log("Audio play blocked."));
        } else if (currentId === "Heishou Pack - Mao Branch Adept Faust") {
            dialogueText = `That answer will suffice, <b>my lord</b>.`;
            stopAllSFX();
            maoStartSound.play().catch(error => console.log("Audio play blocked."));
        } else if (currentId === "Heishou Pack - You Branch Adept Heathcliff") {
            dialogueText = `<b>Yesss...! Finally!</b> Listen up, <b>gamefowls</b>! Get your <b>talons</b> out! We'll be fightin' the night away tonight, 'till there's <b>no more feed left on the sand circle</b>...!`;
            stopAllSFX();
            youStartSound.play().catch(error => console.log("Audio play blocked."));
        } else {
            dialogueText = `<b>Battle positions</b> initialized.`;
        }

        addMessage(getUsername(), dialogueText, "user", USER_ICON);

        setTimeout(() => {
            const roll = Math.random();
            let selectedSkill = null;

            if (roll < 0.45) {
                selectedSkill = sinclairSkills[0];
            } else if (roll < 0.85) {
                selectedSkill = sinclairSkills[1];
            } else if (roll < 0.95) {
                selectedSkill = sinclairSkills[2];
            } else {
                selectedSkill = sinclairSkills[3];
            }

            const finalAtkPower = Math.floor(Math.random() * (selectedSkill.max - selectedSkill.min + 1)) + selectedSkill.min;
            const attackDisplay = `<b>${selectedSkill.name}</b>: [<b>${finalAtkPower}</b>]`;
            addMessage(botName, attackDisplay, "bot", botIcon);

            const chatContainer = document.getElementById("chat-container");
            chatContainer.classList.add("screen-shake");
            setTimeout(() => {
                chatContainer.classList.remove("screen-shake");
            }, 400);

            botCurrentRoll = finalAtkPower;
            canUserAttack = true;
        }, 1000);
    }
    else if (baseCommand === "?skill") {
        let botName = "A Certain Sinclair";
        let botIcon = typeof RYOSHU_ICON !== 'undefined' ? RYOSHU_ICON : typeof WILD_HUNT_ICON !== 'undefined' ? WILD_HUNT_ICON : SANCHO_ICON;

        const faustSkills = [
            { name: "Blinkstep", min: 3, max: 13, chance: 0.65 },
            { name: "Clearing the Path, My Lord.", min: 5, max: 18, chance: 0.22 },
            { name: "Traceless to Sight and Sound Alike.", min: 11, max: 23, chance: 0.10 },
            { name: "Ascendant Heishou - Mao Technique: Cloudsplitting Manifestation", min: 14, max: 33, chance: 0.03 }
        ];

        const heathcliffSkills = [
            { name: "Peck 'em", min: 5, max: 11, chance: 0.65 },
            { name: "Mutilating Talons", min: 8, max: 16, chance: 0.22 },
            { name: "Bloodflame Massacre", min: 9, max: 25, chance: 0.10 },
            { name: "Rooster's Rampaging Blades Under the Ensanguined Heaven", min: 11, max: 30, chance: 0.03 }
        ];

        const hongluSkills = [
            { name: "I Wish to Open the Path", min: 4, max: 12, chance: 0.65 },
            { name: "Tarnished Blood's Absolute Cleaver of Ambitions", min: 4, max: 18, chance: 0.22 },
            { name: "Answer Me, Heishou Packs", min: 12, max: 22, chance: 0.13 },
            { name: "I Carve the Path of a Lord", min: 10, max: 25, chance: 0.00 },
            { name: "Lonesome Stand: Sacrifice to Claim The Garden", min: 14, max: 27, chance: 0.00 }
        ];

        if (!isFighting) {
            addMessage(botName, "There is no clash to answer to. Type ?fight sinclair first.", "bot", botIcon);
            return;
        }

        let currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const currentId = currentUser && currentUser.equippedId ? currentUser.equippedId : "The Lord of Hongyuan Hong Lu";

        if (currentUser && !currentUser.skillsUsedThisTurn) {
            currentUser.skillsUsedThisTurn = {
                "The Lord of Hongyuan Hong Lu": false,
                "Heishou Pack - You Branch Adept Heathcliff": false,
                "Heishou Pack - Mao Branch Adept Faust": false
            };
        }

        if (currentUser && currentUser.heishouBuffActive === undefined) {
            currentUser.heishouBuffActive = false;
            currentUser.lordCarveBuffActive = false;
            currentUser.lonesomeBuffActive = false;
        }
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        let currentIdHp = currentUser && currentUser.idHealth ? currentUser.idHealth[currentId] : 5;
        if (currentIdHp <= 0) {
            addMessage(getUsername(), `❌ <b>${currentId}</b> is knocked out! You must use <b>?change</b> to bring out a living ID!`, "user", USER_ICON);
            awaitingSkillChoice = false;
            canUserAttack = true;
            return;
        }

        if (currentUser && currentUser.skillsUsedThisTurn[currentId]) {
            addMessage(botName, `<b>${currentId}</b> has already clashed against this attack! Switch to another identity using <b>?change</b> to strike again.`, "bot", botIcon);
            awaitingSkillChoice = false;
            canUserAttack = true;
            return;
        }

        if (awaitingSkillChoice && typeof choiceArg !== 'undefined' && choiceArg.trim() !== "") {
            if (choiceArg !== "1" && choiceArg !== "2") {
                addMessage(botName, "Invalid selection. Please choose your action with <b>?skill 1</b> or <b>?skill 2</b>.", "bot", botIcon);
                return;
            }
            awaitingSkillChoice = false;

            const selectedIndex = parseInt(choiceArg) - 1;
            const selectedUserSkill = userSkillChoices[selectedIndex];
            const userRoll = Math.floor(Math.random() * (selectedUserSkill.max - selectedUserSkill.min + 1)) + selectedUserSkill.min;

            currentUser.skillsUsedThisTurn[currentId] = true;

            // --- BUFF ACTIVATION LOGIC ON SELECTION ---
            if (selectedUserSkill.name === "Answer Me, Heishou Packs") {
                const faustHp = currentUser.idHealth ? currentUser.idHealth["Heishou Pack - Mao Branch Adept Faust"] : 7;
                const heathHp = currentUser.idHealth ? currentUser.idHealth["Heishou Pack - You Branch Adept Heathcliff"] : 6;

                if (faustHp <= 0 && heathHp <= 0) {
                    currentUser.lonesomeBuffActive = true;
                    currentUser.lordCarveBuffActive = false;
                    currentUser.lonesomeBuffActive = false;
                } else {
                    currentUser.heishouBuffActive = true;
                    currentUser.lordCarveBuffActive = true;
                    currentUser.lonesomeBuffActive = false;
                }
            }

            if (currentUser.heishouBuffActive &&
                (selectedUserSkill.name === "Traceless to Sight and Sound Alike." ||
                    selectedUserSkill.name === "Bloodflame Massacre")) {
                currentUser.heishouBuffActive = false;
            }

            if (selectedUserSkill.name === "I Carve the Path of a Lord") {
                currentUser.lordCarveBuffActive = false;
            }

            if (selectedUserSkill.name === "Lonesome Stand: Sacrifice to Claim The Garden") {
                currentUser.lonesomeBuffActive = false;
            }

            localStorage.setItem("currentUser", JSON.stringify(currentUser));

            try {
                // FIXED: Isolated stop function so it doesn't break the following checks
                if (typeof stopAllSkillSFX === 'function') {
                    stopAllSkillSFX();
                }

                // FIXED: Reset this to a clean 'if' statement to verify skill names properly
                if (selectedUserSkill.name === "Traceless to Sight and Sound Alike.") {
                    maoS3Sound.play().catch(e => console.log("Audio blocked"));
                }
                else if (selectedUserSkill.name === "Ascendant Heishou - Mao Technique: Cloudsplitting Manifestation") {
                    maoS3Sound.play().catch(e => console.log("Audio blocked"));
                }
                else if (selectedUserSkill.name === "Tarnished Blood's Absolute Cleaver of Ambitions") {
                    lordS2Sound.play().catch(e => console.log("Audio blocked"));
                }
                else if (selectedUserSkill.name === "Answer Me, Heishou Packs") {
                    lordS3Sound.play().catch(e => console.log("Audio blocked"));
                }
                else if (selectedUserSkill.name === "I Carve the Path of a Lord") {
                    lordS4Sound.play().catch(e => console.log("Audio blocked"));
                }
                else if (selectedUserSkill.name === "Lonesome Stand: Sacrifice to Claim The Garden") {
                    lordS5Sound.play().catch(e => console.log("Audio blocked"));
                }
                else if (selectedUserSkill.name === "Mutilating Talons") {
                    youS2Sound.play().catch(e => console.log("Audio blocked"));
                }
                else if (selectedUserSkill.name === "Bloodflame Massacre") {
                    youS3Sound.play().catch(e => console.log("Audio blocked"));
                }
                else if (selectedUserSkill.name === "Rooster's Rampaging Blades Under the Ensanguined Heaven") {
                    youS4Sound.play().catch(e => console.log("Audio blocked"));
                }
            } catch (audioErr) {
                console.log("Custom audio routing exception caught:", audioErr);
            }

            addMessage(getUsername(), `<b>${selectedUserSkill.name}</b>: [<b>${userRoll}</b>]`, "user", USER_ICON);

            setTimeout(() => {
                if (userRoll > botCurrentRoll) {
                    botHearts--;
                    addMessage(botName, "Looks like my past self has faced some tough battles, too.", "bot", botIcon);
                    addMessage(botName, `A Certain Sinclair - 1 HP (❤️ ${botHearts} left)`, "bot", botIcon);

                    const chatContainer = document.getElementById("chat-container");
                    chatContainer.classList.add("screen-shake");
                    setTimeout(() => { chatContainer.classList.remove("screen-shake"); }, 150);
                }
                else if (userRoll < botCurrentRoll) {
                    if (currentUser && currentUser.idHealth) {
                        if (currentId === "The Lord of Hongyuan Hong Lu") {
                            let projectedHp = currentUser.idHealth[currentId] - 1;

                            if (projectedHp <= 0 && !currentUser.hasUndyingTriggered) {
                                currentUser.idHealth[currentId] = 1;
                                currentUser.hasUndyingTriggered = true;
                                currentUser.undyingTurnsLeft = 2;

                                localStorage.setItem("currentUser", JSON.stringify(currentUser));
                                userHearts = currentUser.idHealth[currentId];

                                addMessage(botName, "Emptiness of sound, emptiness of form, and... emptiness of mind.", "bot", botIcon);

                                addMessage(getUsername(), `<b>The Lord will not die.</b>`, "user", USER_ICON);
                                stopAllSFX();
                                lordUndyingSound.play().catch(error => console.log("Audio play blocked."));
                            }

                            else if (currentUser.undyingTurnsLeft > 0) {
                                addMessage(botName, "Emptiness of sound, emptiness of form, and... emptiness of mind.", "bot", botIcon);
                            }

                            else {
                                currentUser.idHealth[currentId]--;
                                userHearts = currentUser.idHealth[currentId];
                                localStorage.setItem("currentUser", JSON.stringify(currentUser));
                                addMessage(botName, "Emptiness of sound, emptiness of form, and... emptiness of mind.", "bot", botIcon);
                                addMessage(botName, `<b>${currentId}</b> lost 1 HP!`, "bot", botIcon);
                            }
                        }

                        else {
                            currentUser.idHealth[currentId]--;
                            userHearts = currentUser.idHealth[currentId];
                            localStorage.setItem("currentUser", JSON.stringify(currentUser));
                            addMessage(botName, "Emptiness of sound, emptiness of form, and... emptiness of mind.", "bot", botIcon);
                            addMessage(botName, `<b>${currentId}</b> lost 1 HP!`, "bot", botIcon);
                        }
                    } else {
                        userHearts--;
                    }

                    const chatContainer = document.getElementById("chat-container");
                    chatContainer.classList.add("screen-shake");
                    setTimeout(() => { chatContainer.classList.remove("screen-shake"); }, 150);
                }
                else {
                    addMessage(botName, "DRAW. Though now, I've come to realize that knowledge holds no real answers.", "bot", botIcon);
                }

                let allSquadDead = false;
                if (currentUser && currentUser.idHealth) {
                    const hongLuHp = currentUser.idHealth["The Lord of Hongyuan Hong Lu"] || 0;
                    const faustHp = currentUser.idHealth["Heishou Pack - Mao Branch Adept Faust"] || 0;
                    const heathcliffHp = currentUser.idHealth["Heishou Pack - You Branch Adept Heathcliff"] || 0;

                    if (hongLuHp <= 0 && faustHp <= 0 && heathcliffHp <= 0) {
                        allSquadDead = true;
                    }
                } else if (userHearts <= 0) {
                    allSquadDead = true;
                }

                if (allSquadDead) {
                    addMessage(botName, `<b>Defeat</b>. I've heard enough.`, "bot", botIcon);
                    isFighting = false;
                    canUserAttack = true;
                    return;
                }

                if (userHearts <= 0) {
                    addMessage(botName, `<b>${currentId}</b> has collapsed! Quick, swap to a living identity using <b>?change</b>!`, "bot", botIcon);
                    canUserAttack = true;
                    canChangeIdThisTurn = true;
                    return;
                }

                if (botHearts <= 0) {
                    addMessage(botName, "Victory. I think I've heard enough..", "bot", botIcon);
                    updateStorage(2500);
                    addMessage(botName, `<b>[REWARD]</b> You earned <b>2,500 Lunacy</b>!`, "bot", botIcon);
                    isFighting = false;
                    canUserAttack = true;
                } else {
                    setTimeout(() => {
                        let refreshedUser = JSON.parse(localStorage.getItem("currentUser")) || {};

                        if (refreshedUser.hasUndyingTriggered && refreshedUser.undyingTurnsLeft > 0) {
                            refreshedUser.undyingTurnsLeft--;

                            if (refreshedUser.undyingTurnsLeft === 0 && botHearts > 0 && refreshedUser.equippedId === "The Lord of Hongyuan Hong Lu") {
                                refreshedUser.idHealth["The Lord of Hongyuan Hong Lu"] = 0;
                                userHearts = 0;
                                localStorage.setItem("currentUser", JSON.stringify(refreshedUser));

                                const faustHp = refreshedUser.idHealth["Heishou Pack - Mao Branch Adept Faust"] || 0;
                                const heathcliffHp = refreshedUser.idHealth["Heishou Pack - You Branch Adept Heathcliff"] || 0;

                                if (faustHp <= 0 && heathcliffHp <= 0) {
                                    addMessage(botName, `<b>Defeat</b>. I've heard enough.`, "bot", botIcon);
                                    isFighting = false;
                                    canUserAttack = true;
                                    return;
                                } else {
                                    addMessage(getUsername(), `<b>The Lord of Hongyuan Hong Lu</b> has collapsed! Quick, swap to a living identity using <b>?change</b>!`, "user", USER_ICON);
                                    stopAllSFX();
                                    lordDeadSound.play().catch(error => console.log("Audio play blocked."));
                                    canUserAttack = true;
                                    canChangeIdThisTurn = true;
                                    return;
                                }
                            }
                        }

                        const botRollChoice = Math.random();
                        let selectedSkill = sinclairSkills[0];

                        if (botRollChoice < 0.45) selectedSkill = sinclairSkills[0];
                        else if (botRollChoice < 0.85) selectedSkill = sinclairSkills[1];
                        else if (botRollChoice < 0.95) selectedSkill = sinclairSkills[2];
                        else selectedSkill = sinclairSkills[3];

                        botCurrentRoll = Math.floor(Math.random() * (selectedSkill.max - selectedSkill.min + 1)) + selectedSkill.min;

                        addMessage(botName, `<b>${selectedSkill.name}</b>: [${botCurrentRoll}]`, "bot", botIcon);

                        const chatContainer = document.getElementById("chat-container");
                        chatContainer.classList.add("screen-shake");
                        setTimeout(() => { chatContainer.classList.remove("screen-shake"); }, 150);

                        if (refreshedUser && refreshedUser.skillsUsedThisTurn) {
                            refreshedUser.skillsUsedThisTurn = {
                                "The Lord of Hongyuan Hong Lu": false,
                                "Heishou Pack - You Branch Adept Heathcliff": false,
                                "Heishou Pack - Mao Branch Adept Faust": false
                            };
                        }
                        localStorage.setItem("currentUser", JSON.stringify(refreshedUser));

                        canUserAttack = true;
                        canChangeIdThisTurn = true;
                    }, 1200);
                }
            }, 800);

            return;
        }

        if (!canUserAttack) {
            addMessage(botName, "Wait for your opponent to display their strategy.", "bot", botIcon);
            return;
        }

        canUserAttack = false;
        let activeSkillPool = [];

        if (currentId === "Heishou Pack - Mao Branch Adept Faust") {
            activeSkillPool = JSON.parse(JSON.stringify(faustSkills));
            if (currentUser && currentUser.heishouBuffActive) {
                activeSkillPool[0].chance = 0;
                activeSkillPool[1].chance = 0;
                activeSkillPool[2].chance = 1.00;
                activeSkillPool[3].chance = 0;
            }
        }
        else if (currentId === "Heishou Pack - You Branch Adept Heathcliff") {
            activeSkillPool = JSON.parse(JSON.stringify(heathcliffSkills));
            if (currentUser && currentUser.heishouBuffActive) {
                activeSkillPool[0].chance = 0;
                activeSkillPool[1].chance = 0;
                activeSkillPool[2].chance = 1.00;
                activeSkillPool[3].chance = 0;
            }
        }
        else {
            activeSkillPool = JSON.parse(JSON.stringify(hongluSkills));

            if (currentUser && currentUser.lonesomeBuffActive) {
                activeSkillPool[0].chance = 0;
                activeSkillPool[1].chance = 0;
                activeSkillPool[2].chance = 0;
                activeSkillPool[3].chance = 0;
                activeSkillPool[4].chance = 1.00;
            }
            else if (currentUser && currentUser.lordCarveBuffActive) {
                activeSkillPool[0].chance = 0;
                activeSkillPool[1].chance = 0;
                activeSkillPool[2].chance = 0;
                activeSkillPool[3].chance = 1.00;
                activeSkillPool[4].chance = 0;
            }
            else {
                activeSkillPool[0].chance = 0.65;
                activeSkillPool[1].chance = 0.22;
                activeSkillPool[2].chance = 0.13;
                activeSkillPool[3].chance = 0.00;
                activeSkillPool[4].chance = 0.00;
            }
        }

        function getWeightedSkill() {
            const roll = Math.random();
            let accumulatedChance = 0;
            for (let i = 0; i < activeSkillPool.length; i++) {
                accumulatedChance += activeSkillPool[i].chance;
                if (roll <= accumulatedChance) {
                    return activeSkillPool[i];
                }
            }
            return activeSkillPool[0];
        }

        const firstSkill = getWeightedSkill();
        const secondSkill = getWeightedSkill();

        userSkillChoices = [firstSkill, secondSkill];
        awaitingSkillChoice = true;

        const choicesDisplay = `
            <b>Select your strategic counter:</b><br>
            1️⃣ <b>${userSkillChoices[0].name}</b> [${userSkillChoices[0].min} - ${userSkillChoices[0].max}]<br>
            2️⃣ <b>${userSkillChoices[1].name}</b> [${userSkillChoices[1].min} - ${userSkillChoices[1].max}]<br>
            <span style="font-size: 0.85em; color: #aaa;">Type <b>?skill 1</b> or <b>?skill 2</b> to strike!</span>
        `;
        addMessage(getUsername(), choicesDisplay, "user", USER_ICON);
    }
    else if (command === "?help") {
        setTimeout(() => {
            const combatText = `
                <b>COMBAT SYSTEM MANUAL</b><br><br>
                
                • <b>STARTING A BATTLE</b><br>
                <div style="padding-left: 20px; display: inline-block; width: 100%;">
                    <b>TYPE:</b> ?fight sinclair<br>
                    <b>EFFECT:</b> Initializes a new match. Resets both fighter health values and locks your inputs into battle mode.
                </div><br><br>

                • <b>VIEWING IDENTITY PROFILES</b><br>
                <div style="padding-left: 20px; display: inline-block; width: 100%;">
                    <b>TYPE:</b> ?ids<br>
                    <b>EFFECT:</b> Displays the complete character database roster showing available Identites, active skill pools, and current roll values.
                </div><br><br>

                • <b>VIEWING STATS AND PASSIVES</b><br>
                <div style="padding-left: 20px; display: inline-block; width: 100%;">
                    <b>TYPE:</b> ?stat or ?stat [identity name]<br>
                    <b>EFFECT:</b> Displays detailed stats, levels, skill structures, and complete combat passives (if have) for your equipped identity.
                </div><br><br>

                • <b>IDENTITY SELECTION</b><br>
                <div style="padding-left: 20px; display: inline-block; width: 100%;">
                    <b>TYPE:</b> ?change [identity name]<br>
                    <b>EFFECT:</b> Switches your active combat character setup. Can only be executed <b>once</b> directly following a bot's attack roll.<br>
                    <b>VALID TARGETS:</b> <i>The Lord of Hongyuan Hong Lu, Heishou Pack - Mao Branch Adept Faust, Heishou Pack - You Branch Adept Heathcliff</i>
                </div><br><br>

                • <b>EXECUTING AN ATTACK</b><br>
                <div style="padding-left: 20px; display: inline-block; width: 100%;">
                    <b>TYPE:</b> ?skill<br>
                    <b>EFFECT:</b> Triggers a random skill draw, rolls your active clash value, and evaluates the round outcome against the boss.
                </div><br><br>

                • <b>CHOOSE YOUR ACTION</b><br>
                <div style="padding-left: 20px; display: inline-block; width: 100%;">
                    <b>TYPE:</b> ?skill 1 or ?skill 2<br>
                    <b>EFFECT:</b> Confirms and executes your chosen strategy against the boss from your generated combat card pool.
                </div><br><br>

                • <b>SKILL SELECT PERCENTAGES & POWER RATINGS</b><br>
                <div style="padding-left: 20px; display: inline-block; width: 100%;">
                    Skill 1: <b>65%</b> draw rate<br>
                    Skill 2: <b>22%</b> draw rate<br>
                    Skill 3: <b>10%</b> draw rate<br>
                    Skill 4: <b>3%</b> draw rate
                </div><br><br>
                
                • <b>THE CLASH MECHANIC</b><br>
                <div style="padding-left: 20px; display: inline-block; width: 100%;">
                    When you execute ?skill, the engine rolls a number within your skill's min/max range. For example, the boss rolls their counter power value.<br>
                    <b>Higher Roll:</b> Wins the round. The loser loses exactly 1 HP.<br>
                    <b>Equal Roll:</b> Tie round. Neither side takes damage; the clash resets.
                </div><br><br>
                
                • <b>HEALTH VALUATIONS</b><br>
                <div style="padding-left: 20px; display: inline-block; width: 100%;">
                    User Starting HP: <b>5 HP</b><br>
                    Boss Starting HP: <b>10 HP</b>
                </div><br><br>
                
                • <b>COMPENSATION & STORAGE LOCKS</b><br>
                <div style="padding-left: 20px; display: inline-block; width: 100%;">
                    Reducing the boss to 0 HP grants victory. The database processor immediately appends <b>2,500 Lunacy</b> straight to your account database slot and updates your persistent data profile.
                </div>
            `;
            addMessage("A Certain Sinclair", combatText, "bot", SANCHO_ICON);
        }, 500);
    }
    else if (command.startsWith("?profile ")) {
        const adminUser = users[currentUserIndex];
        if (adminUser.email === "khangcraftvn@gmail.com") {
            const args = command.split(" ");
            const targetEmail = args[1].toLowerCase();
            const targetUser = users.find(u => u.email === targetEmail);

            if (targetUser) {
                const inv = targetUser.inventory || {};
                const inventoryList = Object.keys(inv).length > 0
                    ? Object.entries(inv).map(([item, qty]) => `${item}: ${qty}`).join("<br>")
                    : "Empty";
                const tagName = targetUser.equippedTag;
                let highlightedTag = "None";

                if (tagName && allTagStyles[tagName]) {
                    const config = allTagStyles[tagName];
                    highlightedTag = `<span style="${config.style} font-weight: bold; padding: 2px 6px; border-radius: 4px; background-color: ${config.bg};">
                        ${tagName}
                    </span>`;
                }

                const profileInfo = `
                    <b>${targetUser.username}'s Profile</b><br>
                    ---------------------------<br>
                    <b>Username:</b> ${targetUser.username}<br>
                    <b>Password:</b> ${targetUser.password}<br>
                    <b>Lunacy:</b> ${targetUser.lunacy || 0}<br>
                    <b>Inventory:</b><br>${inventoryList}<br>
                    <b>Equipped Tag:</b> ${highlightedTag}
                `;

                addMessage("Sancho", profileInfo, "bot", SANCHO_ICON);
            } else {
                addMessage("Sancho", `No user found with email: <b>${targetEmail}</b>.`, "bot", SANCHO_ICON);
            }
        } else {
            addMessage("Sancho", "Privileged Operators Only.", "bot", SANCHO_ICON);
        }
    }
    else if (command.startsWith("?admin_add_lunacy")) {
        if (users[currentUserIndex].email === "khangcraftvn@gmail.com") {
            const args = command.split(" ");
            const amount = parseInt(args[1]);
            const targetEmail = args[2];
            const targetUser = users.find(u => u.email === targetEmail);
            if (targetUser && !isNaN(amount)) {
                targetUser.lunacy = Math.max(0, (targetUser.lunacy || 0) + amount);
                targetUser.adminNotification = `The admin has given you <b>${amount} Lunacy</b>.`;
                saveUserData();
                addMessage("A Certain Sinclair", `Sent <b>${amount} Lunacy</b> for <b>${targetEmail}</b>.`, "bot", SANCHO_ICON);
            }
        }
    }
    else if (command.startsWith("?admin_add_1ticket")) {
        if (users[currentUserIndex].email === "khangcraftvn@gmail.com") {
            const args = command.split(" ");
            const amount = parseInt(args[1]);
            const targetEmail = args[2];
            const targetUser = users.find(u => u.email === targetEmail);
            if (targetUser && !isNaN(amount)) {
                if (!targetUser.inventory) targetUser.inventory = {};
                const current = targetUser.inventory["1-Pull Extraction Ticket"] || 0;
                targetUser.inventory["1-Pull Extraction Ticket"] = Math.max(0, current + amount);
                targetUser.adminNotification = `The admin has given you <b>${amount} 1-Pull Extraction Ticket</b>.`;
                saveUserData();
                addMessage("A Certain Sinclair", `Sent <b>${amount} 1-Pull Extraction Ticket(s)</b> for <b>${targetEmail}</b>.`, "bot", SANCHO_ICON);
            }
        }
    }
    else if (command.startsWith("?admin_add_10ticket")) {
        if (users[currentUserIndex].email === "khangcraftvn@gmail.com") {
            const args = command.split(" ");
            const amount = parseInt(args[1]);
            const targetEmail = args[2];
            const targetUser = users.find(u => u.email === targetEmail);
            if (targetUser && !isNaN(amount)) {
                if (!targetUser.inventory) targetUser.inventory = {};
                const current = targetUser.inventory["10-Pull Extraction Ticket"] || 0;
                targetUser.inventory["10-Pull Extraction Ticket"] = Math.max(0, current + amount);
                targetUser.adminNotification = `The admin has given you <b>${amount} 10-Pull Extraction Ticket(s)</b>.`;
                saveUserData();
                addMessage("A Certain Sinclair", `Sent <b>${amount} 10-Pull Extraction Ticket(s)</b> for <b>${targetEmail}</b>.`, "bot", SANCHO_ICON);
            }
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (currentUserIndex !== -1 && users[currentUserIndex].adminNotification) {
            addMessage("Sancho", users[currentUserIndex].adminNotification, "bot", SANCHO_ICON);
            delete users[currentUserIndex].adminNotification;
            saveUserData();
        }
    }, 1500);
    setTimeout(() => {
        if (currentUserIndex !== -1 && !users[currentUserIndex].adminNotification) {
            const greeting = "I, too, once sought the answer from knowledge. <b>?help</b> for combat mechanic.";
            addMessage("A Certain Sinclair", greeting, "bot", SANCHO_ICON);
        }
    }, 1000);
});

let audioCtxInstance = null;
let audioSourceConnected = false;

document.addEventListener('DOMContentLoaded', () => {
    const introVideo = document.getElementById('intro-video');
    const loopVideo = document.getElementById('loop-video');

    if (introVideo && loopVideo) {
        introVideo.muted = false;
        loopVideo.muted = false;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxInstance = new AudioContext();

        const introSource = audioCtxInstance.createMediaElementSource(introVideo);
        const introGain = audioCtxInstance.createGain();
        introGain.gain.value = 2.5; // Intro volume level
        introSource.connect(introGain);
        introGain.connect(audioCtxInstance.destination);

        const loopSource = audioCtxInstance.createMediaElementSource(loopVideo);
        const loopGain = audioCtxInstance.createGain();
        loopGain.gain.value = 2.0;
        loopSource.connect(loopGain);
        loopGain.connect(audioCtxInstance.destination);
        introVideo.addEventListener('ended', () => {
            console.log("Intro video complete. Swapping to background loop...");
            loopVideo.classList.remove('hidden-bg');
            loopVideo.classList.add('active-bg');
            loopVideo.play();
            setTimeout(() => {
                introVideo.remove();
            }, 1000);
        });

        const attemptPlay = () => {
            introVideo.play().catch(() => {
                loopVideo.muted = true;
                introVideo.play();
                const unmuteAll = () => {
                    if (audioCtxInstance && audioCtxInstance.state === 'suspended') {
                        audioCtxInstance.resume();
                    }
                    loopVideo.muted = true;
                    document.removeEventListener('click', unmuteAll);
                };
                document.addEventListener('click', unmuteAll);
            });
        };

        attemptPlay();
    }
});
sendBtn.addEventListener('click', handleInput);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleInput(); });