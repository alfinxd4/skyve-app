import "../../src/css/main.css";

const localTime = $("#local-time");

// const getLocation = $("#btn-get-location");
const latCoordinates = $("#lat");
const longCoordinates = $("#long");
const cityName = $("#city-name");
const regionName = $("#region-name");
const countryName = $("#country-name");

// 
const temp = $("#temp");
const humi = $("#humidity");
const weather = $("#weather");
const weatherMin = $("#weather-min");
const weatherMax = $("#weather-max");

const day1 = $("#day1");
const day2 = $("#day2");
const day3 = $("#day3");
const day4 = $("#day4");
const day5 = $("#day5");
const day6 = $("#day6");
const day7 = $("#day7");

// const locationInfo = $("#location-info");
const urlCoordinates =
  "https://api.opencagedata.com/geocode/v1/json?key=250178f6b314472c95280f5f73d608e1";

const urlCurrentWeather = "https://api.openweathermap.org/data/2.5/weather";
const urlForecast = "https://api.openweathermap.org/data/2.5/forecast/daily";
const keyWeather = "d12f1c70ff84d00a509bf50060d7af7c";

// 
const getCoordinates = (success, error) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        success(lat, long);
      },
      (err) => {
        console.error("Error:", err.message);
        if (error) {
          error(err.message);
        }
      },
    );
  } else {
    // Jika browser tidak mendukung geolocation
    const errorMessage = "Geolocation is not supported by this browser.";
    console.error("Error:", errorMessage);
    if (error) {
      error(errorMessage); // Memanggil callback error jika disediakan
    }
  }
};

// 
const renderLocationInfo = (data) => {
  // 
  getCoordinates(
    (lat, long) => {
  latCoordinates.text(lat);
  longCoordinates.text(long);
})
  cityName.text(data.results[0].components.city || data.results[0].components.county );
  regionName.text(data.results[0].components.state);
  countryName.text(data.results[0].components.country);
};


const renderWeatherInfo = (data) => {
  temp.text(data.main.temp + "\u00B0C");
  humi.text(data.main.humidity + "%");
  weather.text(data.weather[0].main);
}


  $(window).on("load",()=> {
  getCoordinates(
    (lat, long) => {
      fetch(`${urlCoordinates}&q=${lat},${long}`)
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          console.log(responseJson.results[0].components.city || responseJson.results[0].components.county);
          console.log(responseJson.results[0].components.state);
          console.log(responseJson.results[0].components.country);
          renderLocationInfo(responseJson);
        })
        .catch((error) => {
          console.error("Error:", error);
        });

        // 
        fetch(`${urlCurrentWeather}?lat=${lat}&lon=${long}&appid=${keyWeather}&units=metric`)
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          console.log(responseJson.weather[0].main);
          console.log(responseJson.weather[0].description);
          console.log(responseJson.main.temp);
          console.log(responseJson.main.humidity);
          renderWeatherInfo(responseJson)
        })
        .catch((error) => {
          console.error("Error:", error);
        });


//   
    fetch(`${urlForecast}?lat=${lat}&lon=${long}&cnt=7&appid=${keyWeather}&units=metric`)
    .then((response) => response.json())
    .then((responseJson) => {
      weatherMin.text(Math.round(responseJson.list[0].temp.max) + "\u00B0C");
      weatherMax.text(Math.round(responseJson.list[0].temp.min) + "\u00B0C")

      day1.text(Math.round(responseJson.list[0].temp.max) + "\u00B0C" + "/" + Math.round(responseJson.list[0].temp.min) + "\u00B0C"  + "," + responseJson.list[0].weather[0].main);
      day2.text(Math.round(responseJson.list[1].temp.max) + "\u00B0C" + "/" + Math.round(responseJson.list[1].temp.min) + "\u00B0C"  + "," + responseJson.list[1].weather[0].main);
      day3.text(Math.round(responseJson.list[2].temp.max) + "\u00B0C" + "/" + Math.round(responseJson.list[2].temp.min) + "\u00B0C"  + "," + responseJson.list[2].weather[0].main);
      day4.text(Math.round(responseJson.list[3].temp.max) + "\u00B0C" + "/" + Math.round(responseJson.list[3].temp.min) + "\u00B0C"  + "," + responseJson.list[3].weather[0].main);
      day5.text(Math.round(responseJson.list[4].temp.max) + "\u00B0C" + "/" + Math.round(responseJson.list[4].temp.min) + "\u00B0C"  + "," + responseJson.list[4].weather[0].main);
      day6.text(Math.round(responseJson.list[5].temp.max) + "\u00B0C" + "/" + Math.round(responseJson.list[5].temp.min) + "\u00B0C"  + "," + responseJson.list[5].weather[0].main);
      day7.text(Math.round(responseJson.list[6].temp.max) + "\u00B0C" + "/" + Math.round(responseJson.list[6].temp.min) + "\u00B0C"  + "," + responseJson.list[6].weather[0].main);

      console.log(responseJson);
      
    })
    .catch((error) => {
      console.error("Error:", error);
    });


    },
    (err) => {
      alert(
        "Unable to retrieve your location. Please ensure location services are enabled.",
      );
      console.error("Geolocation error:", err); //
    },
  );


  const showTime = () =>{
    const date = new Date();
    let hours = date.getHours();
    let minutes =  date.getMinutes();
    let seconds = date.getSeconds();
  
    hours = (hours<10) ? "0" + hours : hours;
    minutes = (minutes<10) ? "0" + minutes : minutes;
    seconds = (seconds<10) ? "0" + seconds : seconds;
  
    let time = hours + ":" +  minutes + ":" + seconds;
    
    localTime.text(time);
    setTimeout(showTime,1000);

  }


  showTime();


// Array nama hari
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Fungsi untuk mendapatkan hari ini dan hari-hari berikutnya
function fillDays() {
  let today = new Date().getDay(); // Mendapatkan hari ini dalam bentuk indeks (0 untuk Minggu, 1 untuk Senin, dst.)

  // Loop untuk mengisi elemen d1 hingga d7
  for (let i = 1; i <= 7; i++) {
    // Menentukan indeks hari sesuai urutan
    let dayIndex = (today + i - 1) % 7;

    // Menemukan elemen berdasarkan ID d1, d2, ..., d7 dan mengisi dengan nama hari
    $(`#d${i}`).text(daysOfWeek[dayIndex]);
  }
}

// Memanggil fungsi untuk mengisi hari
fillDays();

});








// https://api.openweathermap.org/data/2.5/weather?lat=-6.4483911&lon=106.7890904&appid=d12f1c70ff84d00a509bf50060d7af7c