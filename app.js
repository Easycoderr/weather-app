import { API_KEY } from "./config.js";

const searchBtnEl = document.getElementById("search-btn");
const InputEl = document.getElementById("search-input");
const weatherDisplayEl = document.querySelector(".weather-display-info");
const errorMessageEl = document.querySelector(".error-notif");
const spinnerEl = document.querySelector(".spinner-container");

function displayErrorMessage(message) {
  displayErrorEl("remove");
  displayWeatherInfoEl("add");
  displaySpinnerEl("add");
  errorMessageEl.querySelector("span").textContent = message;
}

function displaySpinnerEl(status) {
  status === "add"
    ? spinnerEl.classList.add("unvisible")
    : spinnerEl.classList.remove("unvisible");
}

function displayErrorEl(status) {
  status === "add"
    ? errorMessageEl.classList.add("unvisible")
    : errorMessageEl.classList.remove("unvisible");
}
function displayWeatherInfoEl(status) {
  status === "add"
    ? weatherDisplayEl.classList.add("unvisible")
    : weatherDisplayEl.classList.remove("unvisible");
}

async function getData(location) {
  displayWeatherInfoEl("add");
  displayErrorEl("add");
  const APIkey = API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIkey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status:${response.status}`);
    }
    const json = response.json();
    return json;
  } catch (error) {
    console.error("Fetch error:", error.message);
    displayErrorMessage("Invalid location. Avoid using symbols or numbers.");
    return null;
  }
}

function getLocatioWeather() {
  displaySpinnerEl("remove");
  const locationName = InputEl.value;
  if (locationName === "") {
    InputEl.value = "";

    displayErrorMessage("Please enter a valid location name.");
  } else {
    getData(InputEl.value).then((data) => {
      if (data.error) {
        console.error("Failed to get weather:", data.message);
        displayErrorMessage(
          `Unable to fetch weather data. Please try again later.`
        );
      } else {
        displaySpinnerEl("add");
        displayErrorEl("add");
        displayData(data);
        InputEl.value = "";
      }
    });
  }
}

function displayData(data) {
  displayWeatherInfoEl("remove");
  const desc = data.weather[0].description;
  const capitalizedDesc = desc
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
  let html = `
        <div class="location">${data.name}</div>

        <div class="weather-main">
          <div class="temperature">${Math.round(data.main.temp - 273.15)}°</div>
          <div class="weather-icon">
            <img src="http://openweathermap.org/img/wn/${
              data.weather[0].icon
            }@2x.png" alt="${data.weather[0].main}" />
          </div>
        </div>

        <div class="condition">${capitalizedDesc}</div>

        <div class="weather-details">
          <div class="detail-card">
            <i class="fas fa-wind"></i>
            <div class="detail-label">WIND SPEED</div>
            <div class="detail-value">${(
              (data.wind.speed * (60 * 60)) /
              1000
            ).toFixed(1)} km/h</div>
          </div>

          <div class="detail-card">
            <i class="fas fa-tint"></i>
            <div class="detail-label">HUMIDITY</div>
            <div class="detail-value">${data.main.humidity}%</div>
          </div>

          <div class="detail-card">
            <i class="fas fa-temperature-high"></i>
            <div class="detail-label">FEELS LIKE</div>
            <div class="detail-value">${Math.round(
              data.main.feels_like - 273.15
            )}°</div>
          </div>

          <div class="detail-card">
            <i class="fas fa-compress-alt"></i>
            <div class="detail-label">PRESSURE</div>
            <div class="detail-value">${data.main.pressure.toLocaleString()} hPa</div>
          </div>
          `;

  weatherDisplayEl.innerHTML = html;
}

searchBtnEl.addEventListener("click", getLocatioWeather);
InputEl.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getLocatioWeather();
  }
});
