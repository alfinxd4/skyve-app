import "../../src/css/main.css"; // import main.css
import "../../src/css/styles.css"; // import styles.css
import * as Location from "./location.js";  // import location.js
import * as Background from "./background.js";  // import background.js
import * as Weather from "./weather.js";  // import weather.js


// import all images from assets/images folder
const images = require.context(
  "../assets/images",
  true,
  /\.(png|jpe?g|gif|svg|webp)$/
);
images.keys().forEach((key) => images(key)); // import all img

export const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // list days of week

// selector set
export const selectors = {
  btnRefresh: $("#icon-refresh"),
  cityName: $("#city-name"),
  countryCode: $("#country-code"),
  currentTemp: $("#current-temp"),
  currentHumi: $("#current-humi"),
  currentWeather: $("#current-weather"),
  currentWindSpeed: $("#current-windspeed"),
  iconCurrentWeather: $("#icon-current-weather"),
  localTime: $("#local-time"),
  hourlyForecast: $("#hourly-forecast"),
  dailyForecast: $("#daily-forecast"),
  drawer: $("#drawer-swipe"),
  expandedContent: $("#drawer-expanded-content"),
  menu: $("#menu"),
};

// (f) showTime
export const showTime = () => {
  const date = new Date();
  let d = date.getDate(); // get currentDate
  let day= date.getDay(); // get currentDay
  let hours = date.getHours();  // get currentHours
  let minutes = date.getMinutes();  // getCurrentMinutes
  let seconds = date.getSeconds();

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;

  // format time with <span> for colons
  let time = `${daysOfWeek[day]} ${d} || ${hours} <span class="colon">:</span> ${minutes}`;

  selectors.localTime.html(time);

 // apply blink effect to colons every second
 const currentSeconds = new Date().getSeconds();
  if (currentSeconds % 1 === 0) {  // Blink every second
    $('.colon').addClass('blink');
  } else {
    $('.colon').removeClass('blink');
  }

  setTimeout(showTime, 1000);
}


$(window).on("load", () => {
  selectors.btnRefresh.on("click", () => {   // refresh-page
    location.reload();  // reload page
  });

  $("#drawer-toggle").on("click", () => {   // show/hide drawer
    selectors.drawer.toggleClass("drawer-collapsed drawer-expanded");
    selectors.expandedContent.toggleClass("hidden");
    selectors.menu.toggleClass("hidden");
  });
  
  $("#daily-forecast").addClass("hidden");
  $("#hourly-page").on("click", () => {   // event for switching between hourly and daily forecast
    selectors.dailyForecast.addClass("hidden");
    selectors.hourlyForecast.removeClass("hidden");
  });
  
  $("#daily-page").on("click", () => {    // event for switching between hourly and daily forecast
    selectors.hourlyForecast.addClass("hidden");
    selectors.dailyForecast.removeClass("hidden");
  });
  
  Location.getCoordinates((lat, lon) => { // fetch api
    // api weather
    const apiWeather = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FBangkok`;
    // api geocoding
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C${lon}&key=250178f6b314472c95280f5f73d608e1`)
      .then(response => response.json())
      .then(Location.renderGeocoding)
      .catch(console.error);
    // api weather process
    fetch(apiWeather)
      .then(response => response.json())
      .then(data => {
        Weather.renderCurrentWeather(data.current); // renderCurrentW4eather
        Background.setConditionReady(); // setCondition [AnimationBackground]
        Weather.renderHourlyForecast(data); // renderHourlyForecast
        Weather.renderDailyForecast(data);  // renderDailyForecast
      })
      .catch(console.error);
  }, (err) => {
    alert("Unable to retrieve your location. Please ensure location services are enabled.");
    console.error("Geolocation error:", err);
  });
  
  
});

showTime(); // running showTime
