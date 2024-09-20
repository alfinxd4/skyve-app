// import CSS
import "../../src/css/main.css";
// import CSS
import "../../src/css/styles.css";
// 
// import "../assets/images/background/starry-mountain.png";
// // 
// import "../assets/images/weather/thunderstorm/night-storm.webp";

// Mengimpor semua gambar dari folder assets/images
const images = require.context('../assets/images', true, /\.(png|jpe?g|gif|svg|webp)$/);

// Membuat array untuk menyimpan semua gambar yang diimpor
const importedImages = images.keys().map((key) => images(key));


$('#drawer-toggle').on('click', function () {
  const drawer = $('#drawer-swipe');
  const expandedContent = $('#drawer-expanded-content');

  if (drawer.hasClass('drawer-collapsed')) {
    drawer.removeClass('drawer-collapsed').addClass('drawer-expanded');
    expandedContent.removeClass('hidden');
  } else {
    drawer.removeClass('drawer-expanded').addClass('drawer-collapsed');
    expandedContent.addClass('hidden');
  }
});

// import "../../src/assets/fonts/sf-pro-display-regular.otf";
// 
// Array list of day
// const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Selectors
const localTime = $("#local-time");
// const cityName = $("#city-name");
// const countryName = $("#country-name");
// const temp = $("#temp");
// const humi = $("#humidity");
// const weather = $("#weather");
// const minTemp = $("#min-temp");
// const maxTemp = $("#max-temp");

// const day1 = $("#day1");
// const day2 = $("#day2");
// const day3 = $("#day3");
// const day4 = $("#day4");
// const day5 = $("#day5");
// const day6 = $("#day6");
// const day7 = $("#day7");

// const selectorHours = [
//   $("#hour1"), $("#hour2"), $("#hour3"), $("#hour4"), $("#hour5"),
//   $("#hour6"), $("#hour7"), $("#hour8"), $("#hour9"), $("#hour10"),
//   $("#hour11"), $("#hour12")
// ];

const showTime = () => {
  const date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  
  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  // Format time with <span> for colons
  let time = `${hours} <span class="colon">:</span> ${minutes} <span class="colon">:</span> ${seconds}`;
  
  localTime.html(time);

 // Apply blink effect to colons every second
 const currentSeconds = new Date().getSeconds();
  if (currentSeconds % 1 === 0) {  // Blink every second
    $('.colon').addClass('blink');
  } else {
    $('.colon').removeClass('blink');
  }

  setTimeout(showTime, 1000);
}

showTime(); // Display local time

// API URLs
const apiGeocoding = "https://api.opencagedata.com/geocode/v1/json";
const keyGeocoding = "250178f6b314472c95280f5f73d608e1";
const apiWeather = "https://api.openweathermap.org/data/2.5";
const keyWeather = "d12f1c70ff84d00a509bf50060d7af7c";
const apiHourlyWeather = "https://pro.openweathermap.org/data/2.5/forecast/hourly";

// Get coordinates
const getCoordinates = (success, error) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        success(lat, lon);
      },
      (err) => {
        console.error("Error:", err.message);
        if (error) {
          error(err.message);
        }
      },
    );
  } else {
    const errorMessage = "Geolocation is not supported by this browser.";
    console.error("Error:", errorMessage);
    if (error) {
      error(errorMessage);
    }
  }
};

// Forecast days
const forecastDays = () => {
  let today = new Date().getDay();
  for (let i = 1; i <= 7; i++) {
    let dayIndex = (today + i) % 7;
    $(`#d${i}`).text(daysOfWeek[dayIndex]);
  }
}

// Render geocoding
const renderGeocoding = (data) => {
  cityName.text(data.results[0].components.city || data.results[0].components.county);
  countryName.text(data.results[0].components.country);
  forecastDays(); // Call function to display days
};

// Render current weather
const renderCurrentWeather = (data) => {
  weather.text(data.weather[0].main);
  temp.text(data.main.temp + "\u00B0C");
  humi.text(data.main.humidity + "%");
}

// Render daily forecast
const renderDailyForecast = (data) => {

  maxTemp.text(Math.round(data.list[0].temp.max) + "\u00B0C");
  day1.text(Math.round(data.list[1].temp.max) + "\u00B0C" + "/" + Math.round(data.list[0].temp.min) + "\u00B0C" + ", " + data.list[1].weather[0].main);
   day2.text(Math.round(data.list[1].temp.max) + "\u00B0C" + "/" + Math.round(data.list[1].temp.min) + "\u00B0C" + ", " + data.list[1].weather[0].main);
  day3.text(Math.round(data.list[2].temp.max) + "\u00B0C" + "/" + Math.round(data.list[2].temp.min) + "\u00B0C" + ", " + data.list[2].weather[0].main);
  day4.text(Math.round(data.list[3].temp.max) + "\u00B0C" + "/" + Math.round(data.list[3].temp.min) + "\u00B0C" + ", " + data.list[3].weather[0].main);
  day5.text(Math.round(data.list[4].temp.max) + "\u00B0C" + "/" + Math.round(data.list[4].temp.min) + "\u00B0C" + ", " + data.list[4].weather[0].main);
  day6.text(Math.round(data.list[5].temp.max) + "\u00B0C" + "/" + Math.round(data.list[5].temp.min) + "\u00B0C" + ", " + data.list[5].weather[0].main);
  day7.text(Math.round(data.list[6].temp.max) + "\u00B0C" + "/" + Math.round(data.list[6].temp.min) + "\u00B0C" + ", " + data.list[6].weather[0].main);
}

// Filter next 12 hours today
const filterNext12HoursToday = (weatherData, currentDateString, currentHour) => {
  const maxHourToday = Math.min(currentHour + 12, 24);

  return weatherData.list.filter(data => {
    const [date, time] = data.dt_txt.split(' ');
    const [hour] = time.split(':');
    return date === currentDateString && hour >= currentHour && hour < maxHourToday;
  });
};

// Get minimum temperature from hourly data
const getMinTempFromHourlyData = (hourlyData) => {
  return Math.min(...hourlyData.map(data => data.main.temp));
};

// Render hourly forecast
const renderHourlyForecast = (data) => {
  const weatherData = data;
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentDateString = currentTime.toISOString().slice(0, 10);

  const next12HoursDataToday = filterNext12HoursToday(weatherData, currentDateString, currentHour);
  const minTempToday = getMinTempFromHourlyData(next12HoursDataToday);
  console.log("Min temp today from hourly data:", minTempToday);
  minTemp.text(Math.round(minTempToday) + "\u00B0C"); 

  next12HoursDataToday.forEach((data, index) => {
    if (selectorHours[index]) {
      const time = data.dt_txt.split(' ')[1].split(':')[0];
      selectorHours[index].text(`Jam: ${time}, Suhu: ${data.main.temp}°C`);
      selectorHours[index].show();
    }
  });

  for (let i = next12HoursDataToday.length; i < selectorHours.length; i++) {
    selectorHours[i].hide();
  }
}

// On window load
// $(window).on("load", () => {
//   getCoordinates(
//     (lat, lon) => {
//       fetch(`${apiGeocoding}?q=${lat}%2C${lon}&key=${keyGeocoding}`)
//         .then((response) => response.json())
//         .then((responseJson) => renderGeocoding(responseJson))
//         .catch((error) => console.error("Error:", error));

//       fetch(`${apiWeather}/weather?lat=${lat}&lon=${lon}&appid=${keyWeather}&units=metric`)
//         .then((response) => response.json())
//         .then((responseJson) => renderCurrentWeather(responseJson))
//         .catch((error) => console.error("Error:", error));

//       fetch(`${apiWeather}/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=${keyWeather}&units=metric`)
//         .then((response) => response.json())
//         .then((responseJson) => renderDailyForecast(responseJson))
//         .catch((error) => console.error("Error:", error));

//       fetch(`${apiHourlyWeather}?lat=${lat}&lon=${lon}&appid=${keyWeather}&units=metric`)
//         .then((response) => response.json())
//         .then((responseJson) => renderHourlyForecast(responseJson))
//         .catch((error) => console.error("Error:", error));
//     },
//     (err) => {
//       alert("Unable to retrieve your location. Please ensure location services are enabled.");
//       console.error("Geolocation error:", err);
//     }
//   );
// });


