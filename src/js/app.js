// 
import "../../src/css/main.css";
// 
const localTime = $("#local-time"); // selector to display local time
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // Array list of day
const cityName = $("#city-name"); // selector city name
const countryName = $("#country-name"); // selector country name
// 
const temp = $("#temp"); // selector to set temperature
const humi = $("#humidity"); // selector to set humidity
const weather = $("#weather"); // selector to set weather
const minTemp = $("#min-temp"); // selector to set min temperature
const maxTemp = $("#max-temp");// selector to set max temperature
// 
const day1 = $("#day1");
const day2 = $("#day2");
const day3 = $("#day3");
const day4 = $("#day4");
const day5 = $("#day5");
const day6 = $("#day6");
const day7 = $("#day7");

  
const selectorHours = [
  $("#hour1"), $("#hour2"), $("#hour3"), $("#hour4"), $("#hour5"), 
  $("#hour6"), $("#hour7"), $("#hour8"), $("#hour9"), $("#hour10"), 
  $("#hour11"), $("#hour12")
];

const showTime = () =>{ // (f) to display local-time
  const date = new Date();
  let hours = date.getHours(); // get hours
  let minutes =  date.getMinutes(); // get mminutes
  let seconds = date.getSeconds(); // get second
  hours = (hours<10) ? "0" + hours : hours;
  minutes = (minutes<10) ? "0" + minutes : minutes;
  seconds = (seconds<10) ? "0" + seconds : seconds;
  let time = hours + ":" +  minutes + ":" + seconds; // display local-time
  localTime.text(time);
  setTimeout(showTime,1000); //setimeout
}

showTime(); //

const apiGeocoding = // api Geocding
  "https://api.opencagedata.com/geocode/v1/json";
const keyGeocoding = "250178f6b314472c95280f5f73d608e1"; //  api key geocoding
const apiWeather = "https://api.openweathermap.org/data/2.5"; // api open weather
const keyWeather = "d12f1c70ff84d00a509bf50060d7af7c"; // api key open weather

const apiHourlyWeather = "https://pro.openweathermap.org/data/2.5/forecast/hourly"
// 
const getCoordinates = (success, error) => {  // get coordinates n set callback when success or error
  if (navigator.geolocation) {  // permission to access current location
    navigator.geolocation.getCurrentPosition(
      (position) => {   // return data current position
        const lat = position.coords.latitude; // set latitude
        const lon = position.coords.longitude; // set longitude
        success(lat, lon); // success callback
      },
      (err) => { // if error
        console.error("Error:", err.message); // set & return console.error
        if (error) {
          error(err.message); // error callback
        }
      },
    );
  } else {
    // if browser doesnt support geolocation
    const errorMessage = "Geolocation is not supported by this browser.";
    console.error("Error:", errorMessage);  // set & return console.error
    if (error) {
      error(errorMessage); // error callback
    }
  }
};
// 
const forecastDays = () => { // (f) to get this day and next day
  let today = new Date().getDay(); // get day in index result
  for (let i = 1; i <= 7; i++) {   // Loop tp fill selector day
    let dayIndex = (today + i - 1) % 7; // define indeks of day by sequence
    $(`#d${i}`).text(daysOfWeek[dayIndex]);     // get selector to set value froom looping
  }
}
// 
const renderGeocoding = (data) => { // (f) to render data from api to page
  // set city-name by api result [chrome,edge,etc]
  cityName.text(data.results[0].components.city || data.results[0].components.county );
  countryName.text(data.results[0].components.country);   // set country name by api result
// Memanggil fungsi untuk mengisi hari
forecastDays();
};
// 
const renderCurrentWeather = (data) =>{ // (f) to render data from api to page
  weather.text(data.weather[0].main); // set current weather
  temp.text(data.main.temp + "\u00B0C");  // set current temperature
  humi.text(data.main.humidity + "%");  // set current humidity
}

const renderDailyForecast = (data) =>{
  minTemp.text(Math.round(data.list[0].temp.max) + "\u00B0C");
  maxTemp.text(Math.round(data.list[0].temp.min) + "\u00B0C")

      day1.text(Math.round(data.list[0].temp.max) + "\u00B0C" + "/" + Math.round(data.list[0].temp.min) + "\u00B0C"  + "," + data.list[0].weather[0].main);
      day2.text(Math.round(data.list[1].temp.max) + "\u00B0C" + "/" + Math.round(data.list[1].temp.min) + "\u00B0C"  + "," + data.list[1].weather[0].main);
      day3.text(Math.round(data.list[2].temp.max) + "\u00B0C" + "/" + Math.round(data.list[2].temp.min) + "\u00B0C"  + "," + data.list[2].weather[0].main);
      day4.text(Math.round(data.list[3].temp.max) + "\u00B0C" + "/" + Math.round(data.list[3].temp.min) + "\u00B0C"  + "," + data.list[3].weather[0].main);
      day5.text(Math.round(data.list[4].temp.max) + "\u00B0C" + "/" + Math.round(data.list[4].temp.min) + "\u00B0C"  + "," + data.list[4].weather[0].main);
      day6.text(Math.round(data.list[5].temp.max) + "\u00B0C" + "/" + Math.round(data.list[5].temp.min) + "\u00B0C"  + "," + data.list[5].weather[0].main);
      day7.text(Math.round(data.list[6].temp.max) + "\u00B0C" + "/" + Math.round(data.list[6].temp.min) + "\u00B0C"  + "," + data.list[6].weather[0].main);
}


// / (f) to filter data next 12 hours based on current time
const filterNext12HoursToday = (weatherData, currentDateString, currentHour) => {
  // Maximum hour limit (next 12 hours or end of today)
  const maxHourToday = Math.min(currentHour + 12, 24); // Make sure not to exceed 24:00

  // Filter the weather array for only what is happening within the current hour up to a maximum of 12 hours of the current day
  return weatherData.list.filter(data => {
      const [date, time] = data.dt_txt.split(' '); // Separate date and time
      const [hour] = time.split(':'); // Take only hours of time

      // Filter if the date matches today and the hour is in the range from now to the next 12 hours.
      return date === currentDateString && hour >= currentHour && hour < maxHourToday;
  });
};

const renderHourlyForecast = (data) =>{

const weatherData = data; // data api

const currentTime = new Date(); // (f) date
const currentHour = currentTime.getHours( ); // get current hour
const currentDateString = currentTime.toISOString().slice(0, 10); // get date this day in format "YYYY-MM-DD"

// Call the function to get the weather data for the next 12 hours of today
const next12HoursDataToday = filterNext12HoursToday(weatherData, currentDateString, currentHour);

// return console
console.log(next12HoursDataToday);


next12HoursDataToday.forEach((data, index) => {
  if (selectorHours[index]) {
    const time = data.dt_txt.split(' ')[1].split(':')[0]; // Ambil hanya jam dari dt_txt
    selectorHours[index].text(`Jam: ${time}, Suhu: ${data.main.temp}°C`);
    selectorHours[index].show(); // Tampilkan selector (jika sebelumnya disembunyikan)
  }
});

// Sembunyikan selector yang tidak digunakan (jika output kurang dari 12)
for (let i = next12HoursDataToday.length; i < selectorHours.length; i++) {
  selectorHours[i].hide(); // Sembunyikan selector jika tidak ada data
}


}

  $(window).on("load",()=> { // running every page onload
  getCoordinates( // call getCoordinates to get latitude & longitude
    (lat, lon) => { // set parameter
      // fetch geocoding
      fetch(`${apiGeocoding}?q=${lat}%2C${lon}&key=${keyGeocoding}`) // fetch api crrent weather by current location
        .then((response) => response.json())
        .then((responseJson) => { // process data api
          renderGeocoding(responseJson); // call renderGeocoding and set data api
        })
        .catch((error) => { // if error
          console.error("Error:", error);
        });

        // fetch currentWeather
        fetch(`${apiWeather}/weather?lat=${lat}&lon=${lon}&appid=${keyWeather}&units=metric`)
        .then((response) => response.json())
        .then((responseJson) => { // process data api
          renderCurrentWeather(responseJson) // call renderCurrentWeather and set data api
        }) 
        .catch((error) => { // if error
          console.error("Error:", error);
        });

    // fetch dailyForecast
    fetch(`${apiWeather}/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=${keyWeather}&units=metric`)
    .then((response) => response.json())
    .then((responseJson) => { // process data api
      renderDailyForecast(responseJson); // call renderDailyForecast and set data api
    })
    .catch((error) => {
      console.error("Error:", error);
    });

      // fetch api HourlyWeather
fetch(`${apiHourlyWeather}?lat=${lat}&lon=${lon}&appid=${keyWeather}&units=metric`)
.then((response) => response.json())
.then((responseJson) => {
  console.log(responseJson);

  renderHourlyForecast(responseJson);

    })
    .catch((error) => {
      console.error("Error:", error);
    });




    },
    (err) => { // if the loction not active
      alert(
        "Unable to retrieve your location. Please ensure location services are enabled.",
      );
      console.error("Geolocation error:", err); //
    },
  );

});