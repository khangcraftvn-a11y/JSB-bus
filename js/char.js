const url = "https://6a115ff03e35d0f37ee334fc.mockapi.io/id/char";

fetch(url)
    .then(res => res.json())
    .then(data => {
        const charGrid1 = document.querySelector('#essential-section-products');
        const charGrid2 = document.querySelector('#essential-section2-products');
        const charGrid3 = document.querySelector('#essential-section3-products');
        const charGrid4 = document.querySelector('#essential-section4-products');

        const char3 = data.slice(0, 3);
        const char6 = data.slice(3, 6);
        const char9 = data.slice(6, 9);
        const char12 = data.slice(9, 12);

        char3.forEach(char => {
            const charCard = `
                <div id="api-char-${char.id}" class="product-b-card">
                    <img src="img/${char.avatar}" alt="${char.id}" />
                    <h4>${char.name}</h4>
                    <p>
                        ${char.des}
                    </p>
                    <a href="./product.html?id=${char.id}"
                        style="color: #F1BF02; font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;">About</a>
                    <audio id="sound-${char.id}" src="./sound/${char.sound}"></audio>
                </div>
            `;
            charGrid1.innerHTML += charCard;
        });

        char6.forEach(char => {
            const charCard = `
                <div id="api-char-${char.id}" class="product-b-card">
                    <img src="img/${char.avatar}" alt="${char.id}" />
                    <h4>${char.name}</h4>
                    <p>
                        ${char.des}
                    </p>
                    <a href="./product.html?id=${char.id}"
                        style="color: #F1BF02; font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;">About</a>
                    <audio id="sound-${char.id}" src="./sound/${char.sound}"></audio>
                </div>
            `;
            charGrid2.innerHTML += charCard;
        });

        char9.forEach(char => {
            const charCard = `
                <div id="api-char-${char.id}" class="product-b-card">
                    <img src="img/${char.avatar}" alt="${char.id}" />
                    <h4>${char.name}</h4>
                    <p>
                        ${char.des}
                    </p>
                    <a href="./product.html?id=${char.id}"
                        style="color: #F1BF02; font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;">About</a>
                    <audio id="sound-${char.id}" src="./sound/${char.sound}"></audio>
                </div>
            `;
            charGrid3.innerHTML += charCard;
        });

        char12.forEach(char => {
            const charCard = `
                <div id="api-char-${char.id}" class="product-b-card">
                    <img src="img/${char.avatar}" alt="${char.id}" />
                    <h4>${char.name}</h4>
                    <p>
                        ${char.des}
                    </p>
                    <a href="./product.html?id=${char.id}"
                        style="color: #F1BF02; font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;">About</a>
                    <audio id="sound-${char.id}" src="./sound/${char.sound}"></audio>
                </div>
            `;
            charGrid4.innerHTML += charCard;
        });

        const yiSangCard = document.getElementById("api-char-1");
        if (yiSangCard) {
            yiSangCard.addEventListener("click", () => playSound("sound-1"));
        }

        const faustCard = document.getElementById("api-char-2");
        if (faustCard) {
            faustCard.addEventListener("click", () => playSound("sound-2"));
        }

        const donCard = document.getElementById("api-char-3");
        if (donCard) {
            donCard.addEventListener("click", () => playSound("sound-3"));
        }

        const susuBtn = document.getElementById("api-char-4");
        if (susuBtn) susuBtn.addEventListener("click", () => playSound("sound-4"));

        const liemBtn = document.getElementById("api-char-5");
        if (liemBtn) liemBtn.addEventListener("click", () => playSound("sound-5"));

        const hongBtn = document.getElementById("api-char-6");
        if (hongBtn) hongBtn.addEventListener("click", () => playSound("sound-6"));

        const heathBtn = document.getElementById("api-char-7");
        if (heathBtn) heathBtn.addEventListener("click", () => playSound("sound-7"));

        const ishyBtn = document.getElementById("api-char-8");
        if (ishyBtn) ishyBtn.addEventListener("click", () => playSound("sound-8"));

        const rodyaBtn = document.getElementById("api-char-9");
        if (rodyaBtn) rodyaBtn.addEventListener("click", () => playSound("sound-9"));

        const sinBtn = document.getElementById("api-char-10");
        if (sinBtn) sinBtn.addEventListener("click", () => playSound("sound-10"));

        const outisBtn = document.getElementById("api-char-11");
        if (outisBtn) outisBtn.addEventListener("click", () => playSound("sound-11"));

        const bugBtn = document.getElementById("api-char-12");
        if (bugBtn) bugBtn.addEventListener("click", () => playSound("sound-12"));
    })
    .catch(error => console.error('Error fetching data:', error));

function playSound(audioId) {
    const audio = document.getElementById(audioId);

    if (!audio) {
        console.error("Không tìm thấy thẻ audio có ID là:", audioId);
        return;
    }

    document.querySelectorAll("audio").forEach(a => {
        a.pause();
        a.currentTime = 0;
    });

    audio.currentTime = 0;
    audio.volume = 0.3;
    audio.play().catch(error => {
        console.log("Trình duyệt chặn tự động phát nhạc khi chưa tương tác trực tiếp:", error);
    });
}

function detailProduct(productId) {
    fetch(`https://67bb1dc1fbe0387ca1391d45.mockapi.io/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            window.localStorage.setItem("product", JSON.stringify(product));
            window.location.href = "../detail.html";
        })
        .catch(error => console.error('Error fetching product details:', error));
}