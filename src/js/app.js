import "../../src/css/main.css";

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
const weatherDesc = $("#weather-detail");

// const locationInfo = $("#location-info");
const urlCoordinates =
  "https://api.opencagedata.com/geocode/v1/json?key=250178f6b314472c95280f5f73d608e1";

const urlWeather = "https://api.openweathermap.org/data/2.5/weather";
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
  humi.text(data.main.humidity);
  weather.text(data.weather[0].main); 
 
  function capitalizeFirstLetter(text) {
    // Split teks menjadi array kata, kapitalisasi huruf pertama dari setiap kata
    return text.split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

// Contoh penggunaan dengan data dari API
weatherDesc.text(capitalizeFirstLetter(data.weather[0].description));
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
        fetch(`${urlWeather}?lat=${lat}&lon=${long}&appid=${keyWeather}&units=metric`)
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


    },
    (err) => {
      alert(
        "Unable to retrieve your location. Please ensure location services are enabled.",
      );
      console.error("Geolocation error:", err); //
    },
  );

});


// https://api.openweathermap.org/data/2.5/weather?lat=-6.4483911&lon=106.7890904&appid=d12f1c70ff84d00a509bf50060d7af7c