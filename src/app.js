//
import axios from "axios";
// regenerator-runtime
import "regenerator-runtime";
// import style.css
import "./style/style.css";
// import component js [custom elem]
import "./scripts/components/search-bar.js";
// import img
import imgSunrise from "./img/sunrise.jpg";
import imgMorning from "./img/bluesky.jpg";
import imgSunset from "./img/sunset.jpg";
import imgNight from "./img/night.jpg";

// query-selector body
const body = document.body;
body.style.backgroundRepeat = "no-repeat";

// query-selector field-input
const inputCity = document.querySelector(".input-city");
// query-selector search-btn
const searchBtn = document.querySelector(".search-btn");

// define date object
const date = new Date();
const formatTime = date.toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: false,
});

// define time
const currentTime = formatTime;
const time = currentTime;

// define daytime
const sunrise = time.substring(0, 2) >= 4 && time.substring(0, 2) <= 6;
const noon = time.substring(0, 2) >= 7 && time.substring(0, 2) <= 15;
const evening = time.substring(0, 2) >= 16 && time.substring(0, 2) <= 18;

// sunrise (04-06)
if (sunrise) {
  body.style.backgroundImage = `url(${imgSunrise})`;
  // morning-noon (07-15)
} else if (noon) {
  body.style.backgroundImage = `url(${imgMorning})`;
  // evening (16-18)
} else if (evening) {
  body.style.backgroundImage = `url(${imgSunset})`;
  // night (19-24 -03)
} else {
  body.style.backgroundImage = `url(${imgNight})`;
}

// setting API url
const baseUrl =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
// setting KEY API
const keyApi =
  "?unitGroup=metric&key=LWKWZMWSFZB8KPW3MJZ2FHWLH&contentType=json";

// if click search-btn
searchBtn.addEventListener("click", () => {
  // run axios to get data
  axios
    .get(`${baseUrl}${inputCity.value}${keyApi}`)
    .then((response) => {
      // handle success
      // define current-day
      let currentDay = new Date(response.data.days[0].datetime).toLocaleString(
        "en-us",
        { weekday: "long" }
      );
      currentDay = currentDay.substring(0, 3);
      // define day-2
      let day2 = new Date(response.data.days[1].datetime).toLocaleString(
        "en-us",
        {
          weekday: "long",
        }
      );
      day2 = day2.substring(0, 3);
      // define day-3
      let day3 = new Date(response.data.days[2].datetime).toLocaleString(
        "en-us",
        {
          weekday: "long",
        }
      );
      day3 = day3.substring(0, 3);
      // define day-4
      let day4 = new Date(response.data.days[3].datetime).toLocaleString(
        "en-us",
        {
          weekday: "long",
        }
      );
      day4 = day4.substring(0, 3);
      // define day-5
      let day5 = new Date(response.data.days[4].datetime).toLocaleString(
        "en-us",
        {
          weekday: "long",
        }
      );
      day5 = day5.substring(0, 3);

      //
      let result = document.querySelector(".weather");
      result.innerHTML = `
                <div class="weather-info">
                    <p class="time m-0">${currentDay}, ${currentTime}</p>
                    <div class="d-flex justify-content-center">
                        <i class="fa-solid fa-location-dot align-self-center"></i>
                        <p class="location mb-0 mx-2">${response.data.resolvedAddress}</p>
                    </div>
                    <div class="weather d-flex justify-content-center">
                        <div class="me-2">
                            <p class="m-0 temp">${response.data.currentConditions.temp}°С</p>
                            <hr class="">
                            <p class="status">${response.data.currentConditions.conditions}</p>
                        </div>
                        <img class="clouds ms-2" src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${response.data.currentConditions.icon}.png" alt="">
                    </div>
                    <div class="stats  d-flex justify-content-around rounded-3 p-2 my-4">
                        <div>
                            <i class="fa-solid fa-temperature-arrow-up"></i>
                            <p>${response.data.currentConditions.feelslike}°С</p>
                        </div>
                        <div>
                            <i class="fa-solid fa-droplet"></i>
                            <p>${response.data.currentConditions.humidity}%</p>
                        </div>
                        <div>
                            <i class="fa-solid fa-wind"></i>
                            <p>${response.data.currentConditions.windspeed} km/h</p>
                        </div>
                    </div>
                    <div class="row justify-content-around mt-5">
                        <div class="forecast col-2  rounded-3 p-2">
                            <p>${day2}</p>
                            <img class="img-fluid" src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${response.data.days[1].icon}.png" alt="">
                            <p>${response.data.days[1].tempmax}°С</p>
                        </div>
                        <div class="forecast col-2  rounded-3 p-2">
                            <p>${day3}</p>
                            <img class="img-fluid" src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${response.data.days[2].icon}.png" alt="">
                            <p>${response.data.days[2].tempmax}°С</p>
                        </div>
                        <div class="forecast col-2  rounded-3 p-2">
                            <p>${day4}</p>
                            <img class="img-fluid" src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${response.data.days[3].icon}.png" alt="">
                            <p>${response.data.days[3].tempmax}°С</p>
                        </div>
                        <div class="forecast col-2  rounded-3 p-2">
                            <p>${day5}</p>
                            <img class="img-fluid" src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${response.data.days[4].icon}.png" alt="">
                            <p>${response.data.days[4].tempmax}°С</p>
                        </div>
          
                    </div>
                </div>
               `;
      // conditional color-pallete by time
      const stats = document.querySelector(".stats");
      const forecast = document.querySelectorAll(".forecast");
      if (sunrise) {
        stats.classList.add("bg-sunrise");
        for (const forecasts of forecast) {
          forecasts.classList.add("bg-sunrise");
        }
      } else if (noon) {
        stats.classList.add("bg-noon");
        for (const forecasts of forecast) {
          forecasts.classList.add("bg-noon");
        }
      } else if (evening) {
        stats.classList.add("bg-sunset");
        for (const forecasts of forecast) {
          forecasts.classList.add("bg-sunset");
        }
      } else {
        stats.classList.add("bg-night");
        for (const forecasts of forecast) {
          forecasts.classList.add("bg-night");
        }
      }
      console.log(response);
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });

  inputCity.value = null;
});
//
