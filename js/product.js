document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const charId = urlParams.get('id');

    console.log("Extracted Character ID:", charId);

    if (!charId) {
        console.error("no id");
        return;
    }

    const apiUrl = `https://6a115ff03e35d0f37ee334fc.mockapi.io/id/char/${charId}`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(charData => {
            console.log("Successfully fetched data for:", charData.name);
            const imgElement = document.querySelector('#content2 .imgface');

            if (imgElement) {
                imgElement.src = `img/${charData.image}`;
                imgElement.alt = `${charData.name} face sin`;
            } else {
                console.error("no class img facesin");
            }
        })
        .catch(err => console.error("Error communicating with MockAPI:", err));
});