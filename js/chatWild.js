const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const SOUND_GUIDANCE = new Audio("./sound/index.mp3");
const SOUND_SUCCESS = new Audio("./sound/index.mp3");
const SOUND_FAILED = new Audio("./sound/index.mp3");
const SOUND_WARNING = new Audio("./sound/index.mp3");
const BGM = new Audio("./sound/certainSinclairTheme.mp3");
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
let botHearts = 10;

const userSkills = [
    { name: "I Wish to Open the Path", min: 4, max: 12, chance: 0.50 },                           // 50%
    { name: "Tarnished Blood's Absolute Cleaver of Ambitions", min: 4, max: 18, chance: 0.25 }, // 25%
    { name: "Answer Me, Heishou Packs", min: 12, max: 22, chance: 0.15 },                       // 15%
    { name: "Lonesome Stand: Sacrifice to Claim The Garden", min: 14, max: 30, chance: 0.10 }    // 10%
];
const sinclairSkills = [
    { name: "Downward Swing", min: 6, max: 14, chance: 0.50 },
    { name: "Halberd Combo", min: 8, max: 17, chance: 0.25 },
    { name: "Trench-specialized Spear Combat", min: 14, max: 25, chance: 0.25 },
    { name: "True Decapitation Deathblow", min: 15, max: 30, chance: 0.10 }
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

    let nameHtml = (sender === "A Certain Sinclair") ?
        `<div class="sancho-name">${sender}</div>` :
        `<div class="sender-name" style="display: flex; align-items: center;">${sender}</div>`;

    msgDiv.innerHTML = `
        <img src="${icon}" class="icon">
        <div class="message-content">
            ${nameHtml}
            <div class="bubble">${processedText}</div>
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
    else if (command === "?stat") {
        const currentUserHearts = userHearts > 0 ? "❤️".repeat(userHearts) : "Defeated";

        const statInfo = `
            <b>${getUsername()}</b><br>
            ---------------------------<br>
            <b>Level:</b> 60<br>
            <b>HP:</b> ${currentUserHearts}<br>
            <b>Skills:</b><br>
            • I Wish to Open the Path [4 - 12]<br>
            • Tarnished Blood's Absolute Cleaver of Ambitions [4 - 18]<br>
            • Answer Me, Heishou Packs [12 - 22]<br>
            • Lonesome Stand: Sacrifice to Claim The Garden [14 - 30]
        `;

        addMessage(getUsername(), statInfo, "user", USER_ICON);
    }

    else if (command === "?fight sinclair") {
        if (isFighting) {
            let activeBotName = typeof RYOSHU_ICON !== 'undefined' ? "Ryōshū" : typeof WILD_HUNT_ICON !== 'undefined' ? "Wild Hunt" : "A Certain Sinclair";
            addMessage(activeBotName, "Clash already in progress. Face your current judgment.", "bot", typeof RYOSHU_ICON !== 'undefined' ? RYOSHU_ICON : typeof WILD_HUNT_ICON !== 'undefined' ? WILD_HUNT_ICON : SANCHO_ICON);
            return;
        }

        isFighting = true;
        userHearts = 5;
        botHearts = 10;

        let botName = "A Certain Sinclair";
        let botIcon = SANCHO_ICON;

        if (typeof RYOSHU_ICON !== 'undefined') {
            botName = "Ryōshū";
            botIcon = RYOSHU_ICON;
        } else if (typeof WILD_HUNT_ICON !== 'undefined') {
            botName = "Wild Hunt";
            botIcon = WILD_HUNT_ICON;
        }
        addMessage(botName, "The smoke... was blue. <b>Fight Accepted</b>.", "bot", botIcon);

        setTimeout(() => {
            const roll = Math.random();
            let selectedSkill = null;

            if (roll < 0.30) {
                selectedSkill = sinclairSkills[0];
            } else if (roll < 0.55) {
                selectedSkill = sinclairSkills[1];
            } else if (roll < 0.75) {
                selectedSkill = sinclairSkills[2];
            } else if (roll < 0.90) {
                selectedSkill = sinclairSkills[3];
            } else {
                selectedSkill = sinclairSkills[0];
            }

            const finalAtkPower = Math.floor(Math.random() * (selectedSkill.max - selectedSkill.min + 1)) + selectedSkill.min;
            const attackDisplay = `<b>${selectedSkill.name}</b>: [<b>${finalAtkPower}</b>]`;
            addMessage(botName, attackDisplay, "bot", botIcon);

            // SCREEN SHAKE
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

        // Turn guard check
        if (!isFighting) {
            addMessage(botName, "There is no clash to answer to. Type ?fight sinclair first.", "bot", botIcon);
            return;
        }

        if (awaitingSkillChoice) {
            if (choiceArg !== "1" && choiceArg !== "2") {
                addMessage(botName, "Invalid selection. Please choose your action with <b>?skill 1</b> or <b>?skill 2</b>.", "bot", botIcon);
                return;
            }
            awaitingSkillChoice = false;

            const selectedIndex = parseInt(choiceArg) - 1;
            const selectedUserSkill = userSkillChoices[selectedIndex];
            const userRoll = Math.floor(Math.random() * (selectedUserSkill.max - selectedUserSkill.min + 1)) + selectedUserSkill.min;

            addMessage(getUsername(), `<b>${selectedUserSkill.name}</b>: [<b>${userRoll}</b>]`, "user", USER_ICON);
            setTimeout(() => {
                if (userRoll > botCurrentRoll) {
                    botHearts--;
                    addMessage(botName, "Looks like my past self has faced some tough battles, too.", "bot", botIcon);
                    addMessage(botName, `A Certain Sinclair - 1 HP`, "bot", botIcon);

                    const chatContainer = document.getElementById("chat-container");
                    chatContainer.classList.add("screen-shake");
                    setTimeout(() => {
                        chatContainer.classList.remove("screen-shake");
                    }, 400);
                }
                else if (userRoll < botCurrentRoll) {
                    userHearts--;
                    addMessage(botName, "Emptiness of sound, emptiness of form, and... emptiness of mind.", "bot", botIcon);
                    addMessage(botName, `${getUsername()} - 1 HP`, "bot", botIcon);

                    const chatContainer = document.getElementById("chat-container");
                    chatContainer.classList.add("screen-shake");
                    setTimeout(() => {
                        chatContainer.classList.remove("screen-shake");
                    }, 400);
                }
                else {
                    addMessage(botName, "DRAW. Though now, I've come to realize that knowledge holds no real answers.", "bot", botIcon);
                }

                if (userHearts <= 0) {
                    addMessage(botName, "Defeat. This lonely path of adversity, the path of my choosing.", "bot", botIcon);
                    isFighting = false;
                    canUserAttack = true;
                } else if (botHearts <= 0) {
                    addMessage(botName, "Victory. I think I've heard enough..", "bot", botIcon);
                    updateStorage(1000);
                    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
                    const totalLunacy = currentUser ? currentUser.lunacy : 2500;
                    addMessage(botName, `<b>[REWARD]</b> You earned <b>2,500 Lunacy</b>!`, "bot", botIcon);

                    isFighting = false;
                    canUserAttack = true;
                } else {
                    setTimeout(() => {
                        const botRollChoice = Math.random();
                        let selectedSkill = sinclairSkills[0];

                        if (botRollChoice < 0.30) selectedSkill = sinclairSkills[0];
                        else if (botRollChoice < 0.55) selectedSkill = sinclairSkills[1];
                        else if (botRollChoice < 0.75) selectedSkill = sinclairSkills[2];
                        else if (botRollChoice < 0.90) selectedSkill = sinclairSkills[3];

                        botCurrentRoll = Math.floor(Math.random() * (selectedSkill.max - selectedSkill.min + 1)) + selectedSkill.min;

                        addMessage(botName, `<b>${selectedSkill.name}</b>: [${botCurrentRoll}]`, "bot", botIcon);

                        const chatContainer = document.getElementById("chat-container");
                        chatContainer.classList.add("screen-shake");
                        setTimeout(() => {
                            chatContainer.classList.remove("screen-shake");
                        }, 400);

                        canUserAttack = true;
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

        function getWeightedSkill() {
            const roll = Math.random();
            if (roll < 0.50) return userSkills[0];
            else if (roll < 0.75) return userSkills[1];
            else if (roll < 0.90) return userSkills[2];
            else return userSkills[3];
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
                &nbsp;&nbsp; TYPE: <b>?fight sinclair</b><br>
                &nbsp;&nbsp; EFFECT: Initializes a new match. Resets both fighter health values and locks your inputs into battle mode.<br><br>

                • <b>EXECUTING AN ATTACK</b><br>
                &nbsp;&nbsp; TYPE: <b>?skill</b><br>
                &nbsp;&nbsp; EFFECT: Triggers a random skill draw, rolls your active clash value, and evaluates the round outcome against the boss.<br><br>

                • <b>SKILL SELECT PERCENTAGES & POWER RATINGS</b><br>
                &nbsp;&nbsp; Skill 1: <b>50%</b> draw rate<br>
                &nbsp;&nbsp; Skill 2: <b>25%</b> draw rate<br>
                &nbsp;&nbsp; Skill 3: <b>15%</b> draw rate<br>
                &nbsp;&nbsp; Skill 4: <b>10%</b> draw rate<br><br>
                
                • <b>THE CLASH MECHANIC</b><br>
                &nbsp;&nbsp; When you execute ?skill, the engine rolls a number within your skill's min/max range. For example, the boss rolls their counter power value.<br>
                &nbsp;&nbsp; Higher Roll: Wins the round. The loser loses exactly 1 HP.<br>
                &nbsp;&nbsp; Equal Roll: Tie round. Neither side takes damage; the clash resets.<br><br>
                
                • <b>HEALTH VALUATIONS</b><br>
                &nbsp;&nbsp; User Starting HP: <b>5 HP</b><br>
                &nbsp;&nbsp; Boss Starting HP: <b>10 HP</b><br><br>
                
                • <b>COMPENSATION & STORAGE LOCKS</b><br>
                &nbsp;&nbsp; Reducing the boss to 0 HP grants victory. The database processor immediately appends <b>1,000 Lunacy</b> straight to your account database slot and updates your persistent data profile.
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