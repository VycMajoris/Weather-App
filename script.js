document.addEventListener("DOMContentLoaded", () => {
  fetchData("istanbul");
});

const body = document.querySelector("body");
const submitBtn = document.querySelector(".submit-btn");
const form = document.querySelector(".form");
const input = document.getElementById("input");
const city = document.querySelector(".city");
const country = document.querySelector(".country");
const date = document.querySelector(".date");
const currentDegree = document.querySelector(".current-degree");
const weatherText = document.querySelector(".weather-text");
const feelsLike = document.querySelector(".feels-like-container");
const humidityContainer = document.querySelector(".humidity-container");
const chanceOfRainContainer = document.querySelector(
  ".chance-of-rain-container"
);
const windSpeedContainer = document.querySelector(".wind-speed-container");

const searchBtn = document.createElement("img");
searchBtn.classList.add("search-icon");
searchBtn.src = "./assets/icons/search-icon.svg";

submitBtn.appendChild(searchBtn);

const forecastSection = document.querySelector(".forecast-section");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = document.getElementById("input").value;
  fetchData(city);
});

async function fetchData(city) {
  try {
    const currentResponse = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=aaddfdacef7142bd944180703232203&q=${city}`
    );

    const forecastResponse = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=aaddfdacef7142bd944180703232203&q=${city}`
    );

    const sevenDaysForecastResponse = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=aaddfdacef7142bd944180703232203&q=${city}&days=3`
    );

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();
    const sevenDaysForecastData = await sevenDaysForecastResponse.json();
    input.value = "";
    console.log(sevenDaysForecastData);
    populateFields(currentData, forecastData, sevenDaysForecastData);

    createHourlyForecast(sevenDaysForecastData, getLocalTime(currentData));
  } catch (error) {
    console.log(error);
  }
}

function getLocalTime(currentData) {
  const hourNow = parseInt(currentData.current.last_updated.substring(11, 13));

  return hourNow;
}

function populateFields(now, forecastData, sevenDaysForecastData) {
  city.innerHTML = now.location.name;
  country.innerHTML = now.location.country;
  date.innerHTML = now.location.localtime;
  currentDegree.innerHTML = `${now.current.temp_c} °C`;
  weatherText.innerHTML = now.current.condition.text;
  feelsLike.querySelector("h4").innerHTML = `${now.current.feelslike_c} °C`;
  humidityContainer.querySelector("h4").innerHTML = `${now.current.humidity}%`;
  chanceOfRainContainer.querySelector(
    "h4"
  ).innerHTML = `${forecastData.forecast.forecastday[0].day.daily_chance_of_rain}%`;
  windSpeedContainer.querySelector(
    "h4"
  ).innerHTML = `${now.current.wind_kph} km/h`;

  // Change background image and color according to weather
  // Rainy
  if (now.current.is_day === 1 && now.current.condition.text.includes("rain")) {
    body.style.backgroundImage = "url('./assets/images/light-rain.jpg')";
    body.style.color = "white";
  } else if (
    now.current.is_day === 0 &&
    now.current.condition.text.includes("rain")
  ) {
    body.style.backgroundImage = "url('./assets/images/rainy.jpg')";
    body.style.color = "white";
  } else if (
    // Cloudy
    now.current.is_day === 0 &&
    now.current.condition.text === "Partly cloudy"
  ) {
    body.style.backgroundImage =
      "url('./assets/images/partly-cloudy-night.jpg')";
    body.style.color = "white";
    input.style.cssText = `::placeholder { color: white; }`;
  } else if (
    now.current.is_day === 1 &&
    now.current.condition.text === "Partly cloudy"
  ) {
    body.style.backgroundImage = "url('./assets/images/partly-cloudy.jpg')";
    body.style.color = "black";
  } else if (
    // Sunny and clear
    now.current.is_day === 1 &&
    now.current.condition.text === "Sunny"
  ) {
    body.style.backgroundImage = "url('./assets/images/sunny.jpg')";
    body.style.color = "black";
  } else if (
    now.current.is_day === 0 &&
    now.current.condition.text === "Clear"
  ) {
    body.style.backgroundImage = "url('./assets/images/clear-sky-night.jpg')";
    body.style.color = "white";
  } else if (now.current.condition.text.includes("Overcast")) {
    // Overcast
    body.style.backgroundImage = "url('./assets/images/overcast.jpg')";
    body.style.color = "white";
  } else if (
    now.current.is_day === 1 &&
    now.current.condition.text.includes("snow")
  ) {
    // Snowy
    body.style.backgroundImage = "url('./assets/images/snowy.jpg')";
    body.style.color = "black";
  } else if (
    now.current.is_day === 0 &&
    now.current.condition.text.includes("snow")
  ) {
    body.style.backgroundImage = "url('./assets/images/snowy-night.jpg')";
    body.style.color = "white";
  } else if (
    // Misty
    (now.current.is_day === 1 &&
      (now.current.condition.text.includes("Mist") ||
        now.current.condition.text.includes("Fog"))) ||
    now.current.condition.text.includes("fog")
  ) {
    body.style.backgroundImage = "url('./assets/images/misty.jpg')";
    body.style.color = "black";
  } else if (
    (now.current.is_day === 0 &&
      (now.current.condition.text.includes("Mist") ||
        now.current.condition.text.includes("Fog"))) ||
    now.current.condition.text.includes("fog")
  ) {
    body.style.backgroundImage = "url('./assets/images/misty-night.jpg')";
    body.style.color = "white";
  }
}

// 24 hours forecast

function createHourlyForecast(sevenDaysForecastData, localTime) {
  forecastSection.innerHTML = "";
  for (let i = localTime + 1; i < 24; i++) {
    const individualForecastContainer = document.createElement("div");
    const hourDiv = document.createElement("div");
    hourDiv.innerHTML = `<strong>${i}:00</strong>`;
    const degreeDiv = document.createElement("div");
    const weatherIcon = document.createElement("img");
    console.log(i);

    degreeDiv.innerHTML = `${sevenDaysForecastData.forecast.forecastday[0].hour[i].temp_c} °C`;
    weatherIcon.src = `https:${sevenDaysForecastData.forecast.forecastday[0].hour[i].condition.icon}`;

    individualForecastContainer.appendChild(hourDiv);
    individualForecastContainer.appendChild(degreeDiv);
    individualForecastContainer.appendChild(weatherIcon);
    forecastSection.appendChild(individualForecastContainer);
  }

  for (let i = 0; i < localTime + 2; i++) {
    const individualForecastContainer = document.createElement("div");
    const hourDiv = document.createElement("div");
    const degreeDiv = document.createElement("div");
    const weatherIcon = document.createElement("img");

    hourDiv.innerHTML = `<strong>${i}:00</strong>`;

    degreeDiv.innerHTML = `${sevenDaysForecastData.forecast.forecastday[0].hour[i].temp_c} °C`;
    weatherIcon.src = `https:${sevenDaysForecastData.forecast.forecastday[0].hour[i].condition.icon}`;

    individualForecastContainer.appendChild(hourDiv);
    individualForecastContainer.appendChild(degreeDiv);
    individualForecastContainer.appendChild(weatherIcon);
    forecastSection.appendChild(individualForecastContainer);
  }
}
