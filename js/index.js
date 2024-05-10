const breedSelect = new SlimSelect({
    select: "#breed-select"
});

const catInfoDiv = document.getElementById("cat-info");
const breedSpan = document.getElementById("breed");
const descriptionSpan = document.getElementById("description");
const temperamentSpan = document.getElementById("temperament");
const catImage = document.getElementById("cat-image");
const loader = document.getElementById("loader");
const error = document.getElementById("error");

function showLoader() {
    loader.style.display = "block";
}

function hideLoader() {
    loader.style.display = "none";
}

function showError() {
    error.style.display = "block";
}

function hideError() {
    error.style.display = "none";
}

function fetchAndPopulateBreeds() {
    showLoader();
    hideError();
    fetchBreeds()
        .then((breeds) => {
            breedSelect.setData(breeds.map((breed) => ({ text: breed.name, value: breed.id })));
        })
        .catch((error) => {
            console.error("Error fetching breeds:", error);
            showError();
        })
        .finally(hideLoader);
}

function fetchAndPopulateCatInfo(breedId) {
    showLoader();
    hideError();
    fetchCatByBreed(breedId)
        .then((cats) => {
            const cat = cats[0];
            breedSpan.textContent = cat.breeds[0].name;
            descriptionSpan.textContent = cat.breeds[0].description;
            temperamentSpan.textContent = cat.breeds[0].temperament;
            catImage.src = cat.url || "placeholder.jpg";
            catInfoDiv.style.display = "block";
        })
        .catch((error) => {
            console.error("Error fetching cat by breed:", error);
            showError();
        })
        .finally(hideLoader);
}

breedSelect.slim.on('change', (value) => {
    if (value) {
      fetchAndPopulateCatInfo(value);
    } else {
      catInfoDiv.style.display = "none";
    }
  });

fetchAndPopulateBreeds();
const apiKey = "cat-key";
axios.defaults.headers.common["x-api-key"] = apiKey;

function fetchBreeds() {
    return axios
        .get("https://api.thecatapi.com/v1/breeds")
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error fetching breeds:", error);
            throw error;
        });
}

function fetchCatByBreed(breedId) {
    return axios
        .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error fetching cat by breed:", error);
            throw error;
        });
}

module.exports = { fetchBreeds, fetchCatByBreed };