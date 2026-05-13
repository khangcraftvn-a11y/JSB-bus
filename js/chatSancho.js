const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const SOUND_GUIDANCE = new Audio("./sound/index.mp3");
const SOUND_SUCCESS = new Audio("./sound/index.mp3");
const SOUND_FAILED = new Audio("./sound/index.mp3");
const SOUND_WARNING = new Audio("./sound/index.mp3");
const BGM = new Audio("./sound/theme.mp3");
BGM.loop = true;
BGM.volume = 0.3;
const musicBtn = document.getElementById('music-toggle');
let isMuted = true;
musicBtn.classList.add('muted');
const shopItems = {
    "The Red Mist": { price: 16000, style: "background: linear-gradient(to right, #ff1a1a, #4d0000); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(255, 71, 71, 0.1)" },
    "The Black Silence": { price: 14500, style: "background: linear-gradient(to right, #8e9297, #2c2e33); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(142, 146, 151, 0.1)" },
    "The Wild Hunt": { price: 12500, style: "background: linear-gradient(to right, #A330FF, #32005a); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(163, 48, 255, 0.1)" },
    "Tamamo Cross": { price: 11000, style: "background: linear-gradient(to right, #00afff, #00364d); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(0, 175, 255, 0.1)" },
    "Paradise Lost": { price: 9000, style: "background: linear-gradient(to right, #ff7373, #5a0000); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(255, 115, 115, 0.1)" },
    "Justitia": { price: 7000, style: "background: linear-gradient(to right, #00ffc8, #004d3c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(0, 255, 200, 0.08)" },
    "Walpurgisnacht": { price: 5000, style: "background: linear-gradient(to right, #43b581, #0d2b1d); -webkit-background-clip: text; -webkit-text-fill-color: transparent;", bg: "rgba(67, 181, 129, 0.1)" }
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
const SANCHO_ICON = "./img/sancho.png";
const USER_ICON = "./img/dante.png";

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

    // Default if no tag is foundl
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

    let nameHtml = (sender === "Sancho") ?
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

    if (activeQuest === "MESSAGES" && command !== "?prescript") {
        messageCounter++;
        if (messageCounter >= 8) endQuest(true);
    }

    if (command === "hi" || command === "hello") {
        setTimeout(() => addMessage("Sancho", "Greetings, Manager. Please type <b>?help</b> for all <b>available commands</b>.", "bot", SANCHO_ICON), 500);
    }
    else if (command === "?bal") {
        setTimeout(() => {
            const allUsers = JSON.parse(localStorage.getItem("users")) || [];
            const currentSession = JSON.parse(localStorage.getItem("currentUser"));

            const sortedUsers = [...allUsers].sort((a, b) => {
                const lunacyA = parseInt(a.lunacy) || 0;
                const lunacyB = parseInt(b.lunacy) || 0;
                return lunacyB - lunacyA;
            });

            const rank = sortedUsers.findIndex(u => u.email === currentSession.email) + 1;
            const userData = allUsers.find(u => u.email === currentSession.email);
            const styledName = getUsername();

            const balHtml = `
            <div style="text-align: left; font-family: 'Courier New', Courier, monospace; color: white; line-height: 1.2;">
                <div style="margin-bottom: 20px; display: flex; align-items: center;">
                    ${styledName}
                    <b style="font-size: 18px; margin-left: 10px;">'s Balance</b>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <b style="font-size: 18px;">Lunacy:</b><br>
                    <div style="margin-top: 8px; font-size: 16px;">${userData.lunacy || 0}</div>
                </div>
                
                <div>
                    <b style="font-size: 18px;">Leaderboard Rank:</b><br>
                    <div style="margin-top: 8px; font-size: 16px;">#${rank}</div>
                </div>
            </div>
            `;
            addMessage("Sancho", balHtml, "bot", SANCHO_ICON);
        }, 500);
    }
    else if (command === "?shop") {
        if (window.shopTimeout) clearTimeout(window.shopTimeout);

        window.shopTimeout = setTimeout(() => {
            const uniqueEntries = Object.entries(shopItems);

            const itemListHtml = uniqueEntries.map(([name, item]) => {
                const cleanName = name.startsWith('@') ? name.slice(1) : name;

                return `
                <div style="margin-bottom: 12px;">
                    <div style="display: inline-block; background: ${item.bg}; padding: 2px 8px; border-radius: 4px; margin-bottom: 4px;">
                        <span style="${item.style} font-weight: bold;">${cleanName}</span>
                    </div><br>
                    <span style="color: #dbdee1;">Price: <b>${item.price} Lunacy</b></span>
                </div>`;
            }).join('');

            const shopHtml = `
            <div style="background-color: #2b2d31; color: #dbdee1; padding: 15px; border-radius: 8px; font-family: 'Courier New', Courier, monospace; max-width: 320px; line-height: 1.4; text-align: left; border: 1px solid rgba(255,255,255,0.05);">
                <b style="color: white; font-size: 16px;">SANCHO'S LUNACY SHOP</b><br>
                <span style="font-size: 12px; color: #b5bac1;">Use <b>?shop buy [name]</b> to purchase!</span><br><br>

                ${itemListHtml}
                
                <hr style="border: 0; border-top: 1px solid #3f4147; margin: 10px 0;">
                <div style="font-size: 11px; color: #949ba4; display: flex; align-items: center; gap: 5px;">
                    Requested by <span>${getUsername()}</span>
                </div>
            </div>`;

            addMessage("Sancho", shopHtml, "bot", SANCHO_ICON);
        }, 500);
    }
    else if (text.startsWith("?buy ")) {
        const itemName = text.replace("?buy ", "").trim();
        const item = shopItems[itemName];
        const user = users[currentUserIndex];

        setTimeout(() => {
            if (!item) {
                addMessage("Sancho", "That <b>nametag</b> does not exist in the shop.", "bot", SANCHO_ICON);
                return;
            }
            if (user.inventory && user.inventory[itemName]) {
                addMessage("Sancho", "You have already owned this <b>nametag</b>.", "bot", SANCHO_ICON);
                return;
            }
            if ((user.lunacy || 0) < item.price) {
                addMessage("Sancho", "Insufficient <b>Lunacy</b>.", "bot", SANCHO_ICON);
                return;
            }

            // Purchase
            user.lunacy -= item.price;
            if (!user.inventory) user.inventory = {};
            user.inventory[itemName] = 1;
            saveUserData();

            const purchaseMsg = `${getUsername()} purchased ${itemName} for ${item.price} Lunacy.`;
            addMessage("Sancho", purchaseMsg, "bot", SANCHO_ICON);
        }, 500);
    }
    if (command === "?inventory") {
        setTimeout(() => {
            const user = users[currentUserIndex];
            const inv = user.inventory || {};
            const ticket1Count = inv["1-Pull Extraction Ticket"] || 0;
            const ticket10Count = inv["10-Pull Extraction Ticket"] || 0;
            const nametags = Object.keys(inv).filter(key =>
                inv[key] > 0 && !key.toLowerCase().includes("ticket")
            );

            let invHtml = `
            <div style="background-color: #1e1f22; color: #dbdee1; padding: 20px; border-radius: 4px; font-family: 'Courier New', Courier, monospace; max-width: 350px; text-align: left;">
                <b style="font-size: 18px;">${getUsername()}'s Inventory:</b><br>
                <span></span><br><br>
                
                <b style="font-size: 16px;">Extraction Tickets:</b><br>
                ${ticket10Count > 0 ? `<b>10-Pull Extraction Ticket</b>: ${ticket10Count}<br>` : ""}
                ${ticket1Count > 0 ? `<b>1-Pull Extraction Ticket</b>: ${ticket1Count}<br>` : ""}
                ${ticket1Count === 0 && ticket10Count === 0 ? "<i>No tickets found.</i><br>" : ""}
                
                <br><b style="font-size: 16px;">Nametags:</b><br>
                <div style="margin-top: 8px;">
                    ${nametags.length === 0 ? "<i>No nametags owned.</i>" : nametags.map(tag => {
                const data = allTagStyles[tag];
                return data ? `
                            <div style="display: flex; align-items: center; background: ${data.bg}; padding: 4px 10px; border-radius: 5px; margin-bottom: 6px; width: fit-content;">
                                <span style="${data.style} font-weight: bold; font-size: 14px;">${tag}</span>
                            </div>` : `<div style="margin-bottom: 8px; font-size: 14px; color: #888;">${tag}</div>`;
            }).join('')}
                </div>

                <br><br>
                <span style="color: #888; font-size: 13px;">Type <b>?inventory equip [name]</b> to change your look.</span>
            </div>`;

            addMessage("Sancho", invHtml, "bot", SANCHO_ICON);
        }, 500);
    }
    else if (text.startsWith("?inventory equip ")) {
        const itemName = text.replace("?inventory equip ", "").trim();
        const user = users[currentUserIndex];

        setTimeout(() => {
            if (user.inventory && user.inventory[itemName] > 0) {
                user.equippedTag = itemName;
                saveUserData();
                localStorage.setItem("currentUser", JSON.stringify(user));

                addMessage("Sancho", `Successfully equipped ${itemName}.`, "bot", SANCHO_ICON);
            } else {
                addMessage("Sancho", "You do not own this nametag.", "bot", SANCHO_ICON);
            }
        }, 500);
    }
    else if (text.startsWith("?inventory unequip ")) {
        const user = users[currentUserIndex];

        setTimeout(() => {
            if (user.equippedTag) {
                const oldTag = user.equippedTag;
                user.equippedTag = null;
                saveUserData();
                localStorage.setItem("currentUser", JSON.stringify(user));

                addMessage("Sancho", `Successfully unequipped ${oldTag}.`, "bot", SANCHO_ICON);
            } else {
                addMessage("Sancho", "You are not wearing any nametag.", "bot", SANCHO_ICON);
            }
        }, 500);
    }
    else if (command === "?sinners") {
        setTimeout(() => {
            let collectionHtml = `<b>${getUsername()}'s Collection</b><br>`;
            const collection = users[currentUserIndex].collection || {};
            sinnersList.forEach(sinner => {
                collectionHtml += `<br><b>${sinner}</b><br>`;
                if (collection[sinner] && collection[sinner].length > 0) {
                    collection[sinner].forEach(id => { collectionHtml += `🔸 ${id}<br>`; });
                } else { collectionHtml += `🔸 LCB Sinner ${sinner}<br>`; }
            });
            addMessage("Sancho", collectionHtml, "bot", SANCHO_ICON);
        }, 500);
    }
    else if (command === "?gamble") {
        const currentTime = Date.now();
        const cooldownTime = 300000;
        const timePassed = currentTime - lastGambleTime;

        if (timePassed < cooldownTime) {
            const msLeft = cooldownTime - timePassed;
            const h = Math.floor(msLeft / 3600000);
            const m = Math.floor((msLeft % 3600000) / 60000);
            const s = Math.ceil((msLeft % 60000) / 1000);
            let timeString = (h > 0 ? h + "h " : "") + (m > 0 || h > 0 ? m + "m " : "") + s + "s";
            addMessage("Sancho", `Gamble is on cooldown! Try again in <b>${timeString}</b>.`, "bot", SANCHO_ICON);
            return;
        }
        lastGambleTime = currentTime;

        setTimeout(() => {
            const chance = Math.random();
            if (chance < 0.65) {
                addMessage("Sancho", `Gambled... and won <b>Nothing</b>.`, "bot", SANCHO_ICON);
                if (activeQuest === "GAMBLE_WIN") endQuest(false);
            }
            else if (chance < 0.85) {
                const winAmount = Math.floor(Math.random() * 451) + 50; // Wins 50 to 500
                addMessage("Sancho", `Gambled... and won ${winAmount} <b>Lunacy</b>!`, "bot", SANCHO_ICON);
                updateStorage(winAmount);

                // PRESCRIPT CHECK
                if (activeQuest === "GAMBLE_WIN") {
                    // Check if the win is in the 100-150 range
                    if (winAmount >= 100 && winAmount <= 150) {
                        endQuest(true);
                    } else {
                        endQuest(false);
                    }
                }
            }
            else if (chance < 0.95) {
                addMessage("Sancho", "Gambled... and won an item: <b>1-Pull Extraction Ticket</b>!", "bot", SANCHO_ICON);
                addItemToInventory("1-Pull Extraction Ticket", 1);

                if (activeQuest === "GAMBLE_WIN") endQuest(false);
            }
            else {
                addMessage("Sancho", "Gambled... and won an item: <b>10-Pull Extraction Ticket</b>!", "bot", SANCHO_ICON);
                addItemToInventory("10-Pull Extraction Ticket", 1);

                if (activeQuest === "GAMBLE_WIN") endQuest(false);
            }
        }, 600);
    }
    else if (command.startsWith("?extract")) {
        setTimeout(() => {
            const args = command.split(" ");
            let amount = 1;
            let paymentMethod = "";
            let canProceed = false;
            const inv = users[currentUserIndex].inventory || {};

            if (args[1] === "1-pull") {
                amount = 1;
            } else if (args[1] === "10-pull") {
                amount = 10;
            } else {
                amount = parseInt(args[1]) || 1;
            }

            if (amount > 10) {
                addMessage("Sancho", "My apologies, Manager! You can only extract <b>10 extractions</b> at a time.", "bot", SANCHO_ICON);
                return;
            }

            if (args[1] === "1-pull") {
                if ((inv["1-Pull Extraction Ticket"] || 0) >= 1) {
                    amount = 1;
                    paymentMethod = "<b>1-Pull Extraction Ticket</b>";
                    addItemToInventory("1-Pull Extraction Ticket", -1);
                    canProceed = true;
                } else { addMessage("Sancho", "No <b>1-Pull Tickets available</b>.", "bot", SANCHO_ICON); }
            }
            else if (args[1] === "10-pull") {
                if ((inv["10-Pull Extraction Ticket"] || 0) >= 1) {
                    amount = 10;
                    paymentMethod = "<b>10-Pull Extraction Ticket</b>";
                    addItemToInventory("10-Pull Extraction Ticket", -1);
                    canProceed = true;
                } else { addMessage("Sancho", "No <b>10-Pull Tickets available</b>.", "bot", SANCHO_ICON); }
            }
            else {
                const cost = 130 * amount;
                if (getBalance() >= cost) {
                    updateStorage(-cost);
                    paymentMethod = `<b>${cost} Lunacy</b>`;
                    canProceed = true;
                } else { addMessage("Sancho", "Insufficient <b>Lunacy</b>.", "bot", SANCHO_ICON); }
            }

            if (canProceed) {
                let extractedIDs = [];
                let hasNewID = false;

                for (let i = 0; i < amount; i++) {
                    const idName = extractionPool[Math.floor(Math.random() * extractionPool.length)];
                    let sinnerName = "";

                    if (idName.endsWith("Yi Sang")) sinnerName = "Yi Sang";
                    else if (idName.endsWith("Don Quixote")) sinnerName = "Don Quixote";
                    else if (idName.endsWith("Hong Lu")) sinnerName = "Hong Lu";
                    else {
                        const nameParts = idName.split(" ");
                        sinnerName = nameParts[nameParts.length - 1];
                    }
                    const collection = users[currentUserIndex].collection || {};
                    if (!collection[sinnerName] || !collection[sinnerName].includes(idName)) {
                        hasNewID = true;
                    }

                    extractedIDs.push(idName);
                    addIdToCollection(idName, sinnerName);
                }

                const resultsHtml = extractedIDs.length > 1 ? extractedIDs.map(name => `• ${name}`).join("<br>") : extractedIDs[0];
                addMessage("Sancho", `<b>${getUsername()}'s Extraction Results</b><br>Method: ${paymentMethod}<br><br><b>IDs Obtained</b><br>${resultsHtml}`, "bot", SANCHO_ICON);

                // PRESCRIPT
                if (activeQuest === "EXTRACT") {
                    if (hasNewID) {
                        endQuest(true);
                    } else {
                        endQuest(false);
                    }
                }
            }
        }, 800);
    }
    else if (command === "?prescript") {
        if (activeQuest) {
            // Play sound
            SOUND_WARNING.currentTime = 0;
            SOUND_WARNING.play().catch(e => console.log("Sound blocked"));

            addMessage("Sancho", "You are already under a Prescript.", "bot", SANCHO_ICON);
            return;
        }

        setTimeout(() => {
            const quest = prescriptPool[Math.floor(Math.random() * prescriptPool.length)];
            activeQuest = quest.id;

            // Play sound
            SOUND_GUIDANCE.currentTime = 0;
            SOUND_GUIDANCE.play().catch(e => console.log("Sound blocked"));

            addMessage("Sancho", `${quest.text}`, "bot", SANCHO_ICON);

            if (activeQuest === "STAY" || activeQuest === "SILENCE") questTimer = setTimeout(() => endQuest(true), 30000);
            else if (activeQuest === "LUCK") endQuest(true, false);
        }, 700);
    }
    else if (command === "?help") {
        setTimeout(() => {
            const helpText = `
            <b>AVAILABLE COMMANDS:</b><br><br>
            • <b>?bal</b> - Check your current <b>Rank</b> and <b>Lunacy</b>.<br>
            • <b>?shop</b> - Browse and buy <b>Nametags</b> using Lunacy.<br>
            • <b>?inventory</b> - View your items (<b>Extraction Tickets</b>, <b>Nametags</b>).<br>
            • <b>?sinners</b> - View all 12 <b>Sinners</b> and your collected <b>Identities</b>.<br>
            • <b>?gamble</b> - Test your luck for <b>Lunacy</b> or <b>Extraction Ticket</b>.<br>
            • <b>?extract [value]</b> - Extract using <b>Lunacy</b>.<br>
            • <b>?extract 1-pull</b> - Use a <b>1-Pull Extraction Ticket</b>.<br>
            • <b>?extract 10-pull</b> - Use a <b>10-Pull Extraction Ticket</b>.<br>
            • <b>?prescript</b> - Receive a <b>task</b> from the Index.<br>
            • <b>?help</b> - View all <b>available commands</b>.
        `;
            addMessage("Sancho", helpText, "bot", SANCHO_ICON);
        }, 500);
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
                addMessage("Sancho", `Sent <b>${amount} Lunacy</b> for <b>${targetEmail}</b>.`, "bot", SANCHO_ICON);
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
                addMessage("Sancho", `Sent <b>${amount} 1-Pull Extraction Ticket(s)</b> for <b>${targetEmail}</b>.`, "bot", SANCHO_ICON);
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
                addMessage("Sancho", `Sent <b>${amount} 10-Pull Extraction Ticket(s)</b> for <b>${targetEmail}</b>.`, "bot", SANCHO_ICON);
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
            const greeting = "My name is <b>Sancho</b>! And <b>I</b>, <b>Sancho</b>, declare upon my <b>honor</b>: This <b>lance</b> shall end that <b>festering</b>, <b>slothful dream</b>! Type <b>?help</b> for guidance.";

            addMessage("Sancho", greeting, "bot", SANCHO_ICON);
        }
    }, 1000);
});

sendBtn.addEventListener('click', handleInput);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleInput(); });