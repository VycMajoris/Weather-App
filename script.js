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
  } catch (error) {
    console.log(error);
  }
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

  if (now.current.precip_mm > 0) {
    body.style.backgroundImage = "url('./assets/images/rainy.jpg')";
    body.style.color = "white";
  } else if (
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
    now.current.is_day === 1 &&
    now.current.condition.text === "Clear"
  ) {
    body.style.backgroundImage = "url('./assets/images/sunny.jpg')";
    body.style.color = "black";
  } else if (
    now.current.is_day === 0 &&
    now.current.condition.text === "Clear"
  ) {
    body.style.backgroundImage = "url('./assets/images/clear-sky-night.jpg')";
    body.style.color = "white";
  } else if (now.current.is_day === 1 && now.current.wind_kph > 20) {
    body.style.backgroundImage = "url('./assets/images/windy.jpg')";
    body.style.color = "black";
  } else if (
    now.current.is_day === 1 &&
    now.current.condition.text === "Sunny"
  ) {
    body.style.backgroundImage = "url('./assets/images/clear.jpg')";
    body.style.color = "black";
  }

  // 24 hours forecast

  const hourNow = sevenDaysForecastData.current.last_updated.split("")[12];
  console.log(hourNow);
  const hours = [];

  for (let i = hourNow; i < 24; i++) {
    const individualForecastContainer = document.createElement("div");
    const hourDiv = document.createElement("div");
    const degreeDiv = document.createElement("div");
    const weatherIconDiv = document.createElement("img");

    hourDiv.innerHTML = sevenDaysForecastData.forecast.forecastday[0].hour[
      i
    ].time.substring(11, 16);

    hours.push(
      sevenDaysForecastData.forecast.forecastday[0].hour[i].time.substring(
        11,
        16
      )
    );

    individualForecastContainer.appendChild(hourDiv);
    forecastSection.appendChild(individualForecastContainer);
  }

  for (let i = 0; i < 6; i++) {
    const individualForecastContainer = document.createElement("div");
    const hourDiv = document.createElement("div");
    const degreeDiv = document.createElement("div");
    const weatherIconDiv = document.createElement("img");
    hourDiv.innerHTML = sevenDaysForecastData.forecast.forecastday[1].hour[
      i
    ].time.substring(11, 16);

    hours.push(
      sevenDaysForecastData.forecast.forecastday[1].hour[i].time.substring(
        11,
        16
      )
    );
    individualForecastContainer.appendChild(hourDiv);
    forecastSection.appendChild(individualForecastContainer);
  }

  console.log(hours);
}
