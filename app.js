const form = document.querySelector('#searchForm');
const resultDiv = document.querySelector('#resultDiv');

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    resultDiv.innerHTML = ''; // Clear previous results

    try {
        // Get the search term
        let searchTerm = form.elements.query.value.trim();

        if (searchTerm === '') return; // If search term is empty, do nothing
        
        // Display a loading spinner
        resultDiv.innerHTML = '<div class="loader"></div>';

        // If the search term includes spaces, limit it to the first word
        if (searchTerm.includes(' ')) {
            searchTerm = searchTerm.split(' ')[0];
        }

        // Fetch data from the API
        const response = await axios.get(`https://api.potterdb.com/v1/characters?filter[name_cont]=${searchTerm}`);
        console.log("Page loaded");

        // Hide the loader and display results
        resultDiv.innerHTML = '';
        makeResults(response.data.data);

    } catch (e) {
        console.log('Error was thrown');
        console.log(e);
        resultDiv.innerHTML = '<p>Error fetching data. Please try again later.</p>';
    }
});

// Function to display results as cards
const makeResults = (data) => {
    if (data.length === 0) {
        resultDiv.innerHTML = '<p>No characters found.</p>';
        return;
    }

    data.forEach(result => {
        const card = document.createElement('div');
        card.classList.add('result-card');

        // Image element
        if (result.attributes.image) {
            const img = document.createElement('img');
            img.src = result.attributes.image;
            img.alt = result.attributes.name;
            card.appendChild(img);
        }

        // Name and house
        const details = document.createElement('div');
        details.classList.add('result-details');

        const name = document.createElement('h3');
        name.textContent = result.attributes.slug;
        details.appendChild(name);

        const house = document.createElement('p');
        house.textContent = result.attributes.house || 'no house available';
        details.appendChild(house);

        card.appendChild(details);

        // Add button to open character wiki
        const wikiButton = document.createElement('button');
        wikiButton.textContent = 'View Wiki';
        wikiButton.classList.add('view-wiki-btn');
        card.appendChild(wikiButton);

        // When button is clicked, open character wiki in a new tab
        wikiButton.addEventListener('click', function (e) {
            e.preventDefault();
            window.open(result.attributes.wiki, '_blank');
        });

        // Append the card to the result div
        resultDiv.append(card);
    });
}
