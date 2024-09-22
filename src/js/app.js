// import CSS
import "../../src/css/main.css";
// import CSS
import "../../src/css/styles.css";

// import all images from assets/images folder
const images = require.context('../assets/images', true, /\.(png|jpe?g|gif|svg|webp)$/);

// create an array to store all imported images
images.keys().map((key) => images(key));

// show-hide drawer
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


const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // Array list of day
const cityName = $("#city-name");
const countryCode = $("#country-code");

const currentTemp = $("#current-temp");
const currentHumi = $("#current-humi");
const currentWeather = $("#current-weather");
const currentWindSpeed = $("#current-windspeed");
const iconCurrentWeather = $("#icon-current-weather");

const localTime = $("#local-time");


const showTime = () => {
  let d = new Date(); // (f) date
  let date = d.getDate()  // get date
  let day = d.getDay(); // get array day [0-6]

  let hours = d.getHours(); // get hours
  let minutes = d.getMinutes(); // get minute
  
  hours = (hours < 10) ? "0" + hours : hours; 
  minutes = (minutes < 10) ? "0" + minutes : minutes;

  // format time with <span> for colons
  let time = `${daysOfWeek[day]} ${date} <span> | </span> ${hours} <span class="colon">:</span> ${minutes}`;
  
  localTime.html(time); // render time to page


 // apply blink effect to colons every second
 const currentSeconds = new Date().getSeconds();  // get seconds
  if (currentSeconds % 1 === 0) {  // blink every second
    $('.colon').addClass('blink');
  } else {
    $('.colon').removeClass('blink');
  }

  setTimeout(showTime, 1000); // delay 1s
}

showTime(); // display local time

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
  countryCode.text(data.results[0].components.country_code.toUpperCase());

  forecastDays(); // Call function to display days
};

// Render current weather
const renderCurrentWeather = (data) => {
  currentWeather.text(data.weather[0].main);  
  currentTemp.text(Math.round(data.main.temp) + "\u00B0");
  currentHumi.text(data.main.humidity + "%")
  currentWindSpeed.text(data.wind.speed + " m/s")
  
  // load img by current weather
  if (currentWeather.text() == "Thunderstorm") {
    iconCurrentWeather.attr('src', 'assets/images/weather/thunderstorm/night-storm.webp');
  } else if(currentWeather.text() == "Clouds"){
    iconCurrentWeather.attr('src', 'assets/images/weather/cloudly/night-cloudly.webp');
  } else if(currentWeather.text() == "Drizzle"){
 iconCurrentWeather.attr('src', 'assets/images/weather/drizzle/night-drizzle.webp');
  } else if(currentWeather.text() == "Rain"){
 iconCurrentWeather.attr('src', 'assets/images/weather/rain/night-rain.webp');
  } else if(currentWeather.text() == "Snow"){
 iconCurrentWeather.attr('src', 'assets/images/weather/snow/night-snow.webp');
  } else if(currentWeather.text() == "Clear"){
    iconCurrentWeather.attr('src', 'assets/images/weather/snow/night-clear.webp');
  }
}


// Render hourly forecast
const renderHourlyForecast = (data) => {
  const weatherData = data;
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentDateString = currentTime.toISOString().slice(0, 10);

  
  
  const forecastContainer = document.querySelector('#hourly-forecast');
  // Bersihkan konten lama
  forecastContainer.innerHTML = '';
  
  const next12HoursDataToday = filterNext12HoursToday(weatherData, currentDateString, currentHour);

  next12HoursDataToday.forEach((data) => {
    const time = data.dt_txt.split(' ')[1].split(':').slice(0, 2).join(':');;
    console.log(time);
    
    // const time = data.dt_txt.split(' ')[1].split(':')[0];
    const temp = data.main.temp;
   
    // Membuat elemen cuaca baru secara di\amis
    const forecastElement = `
       <div class="bg-[#48319D]/80 w-12 h-24 rounded-full shadow-2xl mx-auto text-center">
               <div class="flex justify-center items-center relative -top-5 ">
                  <div class="mx-auto text-center">
                     <img src="assets/images/weather/thunderstorm/night-storm.webp" alt="icon_weather"
                        class="w-12 h-auto">
                  </div>
               </div>
               <!--  -->
               <div class="relative -top-3 text-xs text-white">
                  <p class="">${time}</p>
                  <p class="">${Math.round(temp)}&deg;</p>
               </div>
            </div>

    `;

     // Menyisipkan elemen baru ke dalam container
     forecastContainer.innerHTML += forecastElement;
    })
  };
  // next12HoursDataToday.forEach((data, index) => {
  //   if (selectorHours[index]) {
  //     const time = data.dt_txt.split(' ')[1].split(':')[0];
  //     selectorHours[index].text(`Jam: ${time}, Suhu: ${data.main.temp}°C`);
  //     selectorHours[index].show();
  //   }
  // });

  // for (let i = next12HoursDataToday.length; i < selectorHours.length; i++) {
  //   selectorHours[i].hide();
  // }
 
// Filter next 12 hours today
const filterNext12HoursToday = (weatherData, currentDateString, currentHour) => {
  const maxHourToday = Math.min(currentHour + 12, 24);

  return weatherData.list.filter(data => {
    const [date, time] = data.dt_txt.split(' ');
    const [hour] = time.split(':');
    return date === currentDateString && hour >= currentHour && hour < maxHourToday;
  });
};

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


$(window).on("load", () => {
  getCoordinates(
    (lat, lon) => {
      fetch(`${apiGeocoding}?q=${lat}%2C${lon}&key=${keyGeocoding}`)
        .then((response) => response.json())
        .then((responseJson) => renderGeocoding(responseJson))
        .catch((error) => console.error("Error:", error));

      fetch(`${apiWeather}/weather?lat=${lat}&lon=${lon}&appid=${keyWeather}&units=metric`)
        .then((response) => response.json())
        .then((responseJson) => renderCurrentWeather(responseJson))
        .catch((error) => console.error("Error:", error));
 
        /*
      fetch(`${apiWeather}/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=${keyWeather}&units=metric`)
        .then((response) => response.json())
        .then((responseJson) => renderDailyForecast(responseJson))
        .catch((error) => console.error("Error:", error));
 */
      fetch(`${apiHourlyWeather}?lat=${lat}&lon=${lon}&appid=${keyWeather}&units=metric`)
        .then((response) => response.json())
        .then((responseJson) => renderHourlyForecast(responseJson))
        .catch((error) => console.error("Error:", error));


    },
    (err) => {
      alert("Unable to retrieve your location. Please ensure location services are enabled.");
      console.error("Geolocation error:", err);
    }
  );
});



