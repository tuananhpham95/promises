const backgroundImage = document.querySelector(".img");
const weather = document.querySelector(".weather-data");
const pokemon = document.querySelector(".pokemon");
const time = document.querySelector(".time");
const qoutes = document.querySelector(".qoutes");
const recipe = document.querySelector(".recipe");

const getImages = async () => {
  try {
    const res = await axios.get(
      "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=9787e6990d503eae6aadce948ab9cea7&tags=landscape&content_type=1&sort=relevance&format=json&nojsoncallback=1"
    );
    let photoData = res.data.photos.photo[0];
    let title = photoData.title;
    let authorName = photoData.owner;
    let imgUrl = `https://farm${photoData.farm}.staticflickr.com/${photoData.server}/${photoData.id}_${photoData.secret}.jpg`;

    backgroundImage.innerHTML = `
      <img src="${imgUrl}" alt="Background Image">
      <p>title: ${title}</p>
      <p>author: ${authorName}</p>     
    `;
  } catch (error) {
    console.error("Det gick inte att hämta bakgrundsbilden:", error);
    // Visa en standardbild som fallback
    applyBackgroundImage("https://exempel-api.com/default-background.jpg");
  }
};
getImages();

const weatherData = async (latitude, longitude) => {
  try {
    const res = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat: latitude,
          lon: longitude,
          appid: "fad4b5157cdd8fbb13419e97906fa095",
        },
      }
    );
    const weatherData = res.data;
    const country = `${weatherData.sys.country} , ${weatherData.name}`;
    const temp = Math.round(weatherData.main.temp - 273.15); //i celsius
    const desc = weatherData.weather[0].description;
    weather.innerHTML = `<p class="country">${country}</p>
    <span class="temp">${temp}</span><sup>&deg;</sup><sup>C</sup>
    <p class="desc">${desc}</p>`;
  } catch (error) {
    console.error("Det gick inte att hämta väderdata:", error);
  }
};

// Funktion för att uppdatera tiden och datumet varje sekund
function updateClock() {
  const now = new Date();
  // Uppdatera tiden och datumet på din sida
  time.innerHTML = now.toLocaleString();
}
updateClock();
setInterval(updateClock, 1000);

// hämtar lat lon
function getWeatherPos() {
  navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    weatherData(latitude, longitude);
  });
}
window.addEventListener("load", getWeatherPos);

const RandomQuote = async () => {
  try {
    const res = await axios.get("https://api.quotable.io/quotes/random");
    const quoteText = res.data[0].content;
    const quoteAuthor = res.data[0].author;
    const formattedQuote = `"${quoteText}" - ${quoteAuthor}`;
    qoutes.innerHTML = formattedQuote;
  } catch (error) {
    console.error("Error fetching quote:", error);
  }
};

RandomQuote();

setInterval(RandomQuote, 5000);

const apiKey = "1f638870314b4c79814632dfa252f03b";

// random recipe
const RandomRecipe = async () => {
  try {
    const res = await axios.get(
      `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}`
    );
    const recipeImage = res.data.recipes[0].image;
    const recipeTitle = res.data.recipes[0].title;
    recipe.innerHTML = `
      <img id="recipe-img" src="${recipeImage}" alt="recipe image">
      <p>${recipeTitle}</p>
      `;
  } catch (error) {
    console.error("Error fetching random recipe:", error);
  }
};
RandomRecipe();

setInterval(RandomRecipe, 5000);

const RandomPokemon = async () => {
  // Generate a random Pokémon ID between 1 and 500 (total number of Pokémon)
  const randomPokemonId = Math.floor(Math.random() * 500) + 1;
  try {
    const res = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`
    );
    const pokemonData = res.data;
    const pokemonName = pokemonData.name;
    const pokemonImageUrl = pokemonData.sprites.front_default;
    pokemon.innerHTML = `
              <h2>Random Pokémon:</h2>
              <p>Name: ${pokemonName}</p>
              <img id="pokemon-img" src="${pokemonImageUrl}" alt="${pokemonName}">
          `;
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
};

// Generate a random Pokémon every 5 seconds
setInterval(RandomPokemon, 5000);

RandomPokemon();
