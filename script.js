document.addEventListener("DOMContentLoaded", function () {
    const projectsList = document.getElementById("projectsList");
    const searchBox = document.getElementById("search-box");
    const showAllButton = document.getElementById("showAll");
    let allData = [];

    const placeholders = [
        "À la recherche de ma prochaine victime...",
        "Trouver un endroit... pour se cacher des monstres !",
        "Crème solaire pour vampire ?",
        "Recettes sans ail pour cet été...",
        "Que cherchez-vous ? Un vampire ?",
        "Cherchez et vous trouverez... sauf si c'est en plein jour.",
        "Magasin de cercueils le plus proche...",
        "Rechercher des endroits... sans miroirs.",
        "Vous cherchez quelqu'un ? Regardez dans la crypte !",
        "Vous pouvez rechercher ici."
    ];

    // Set a random placeholder text
    const randomPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];
    searchBox.setAttribute("placeholder", randomPlaceholder);

    const buttons = document.querySelectorAll("#navigation button[data-filter]");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.getAttribute("data-filter");
            loadData(filter);
        });
    });

    showAllButton.addEventListener("click", () => {
        loadAllData();
    });

    searchBox.addEventListener("input", function () {
        const searchTerm = searchBox.value.toLowerCase();
        const filteredData = allData.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
        displayData(filteredData);
    });

    function loadData(filter) {
        let file;
        if (filter === "playerCharacters") {
            file = "playerCharacters.json";
        } else if (filter === "characters") {
            file = "characters.json";
        } else if (filter === "places") {
            file = "places.json";
        }

        if (file) {
            fetch(file)
                .then(response => response.json())
                .then(data => {
                    allData = data; // Store the data for search functionality
                    displayData(data);
                });
        }
    }

    function loadAllData() {
        const files = ["playerCharacters.json", "characters.json", "places.json"];
        allData = [];
        Promise.all(files.map(file => fetch(file).then(response => response.json())))
            .then(results => {
                results.forEach(data => {
                    allData = allData.concat(data);
                });
                displayData(allData);
            });
    }

    function displayData(data) {
        projectsList.innerHTML = ""; // Clear the list first
        data.forEach(item => {
            const li = document.createElement("li");
            li.classList.add("project-box", "show-project");
            li.innerHTML = `
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="tags">${item.tags.join(", ")}</div>
            `;
            li.addEventListener("click", () => {
                window.open(item.link, "_blank");
            });
            projectsList.appendChild(li);
        });
    }
});
