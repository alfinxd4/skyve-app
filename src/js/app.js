import "../../src/css/main.css";

const getLocation = $("#btn-get-location");
const latCoordinates = $("#lat");
const longCoordinates = $("#long");
// const countryCode = $('#country-code');
const cityName = $("#city-name");
const regionName = $("#region-name");
const countryName = $("#country-name");

const locationInfo = $("#location-info");
const baseUrl =
  "https://api.opencagedata.com/geocode/v1/json?key=250178f6b314472c95280f5f73d608e1";

// Fungsi untuk mendapatkan koordinat
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

// Fungsi untuk render response JSON
const renderLocationInfo = (data) => {
  getCoordinates(
    (lat, long) => {
  latCoordinates.text(lat);
  longCoordinates.text(long);
})
  cityName.text(data.results[0].components.county);
  regionName.text(data.results[0].components.state);
  countryName.text(data.results[0].components.country);
};

// Event listener untuk tombol get location
// getLocation.on("click", function() {
  $(window).on("load",()=> {
  // locationInfo.removeClass("invisible");
  getCoordinates(
    (lat, long) => {
      fetch(`${baseUrl}&q=${lat},${long}`)
        .then((response) => response.json())
        .then((responseJson) => {
          renderLocationInfo(responseJson);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    (err) => {
      alert(
        "Unable to retrieve your location. Please ensure location services are enabled.",
      );
      console.error("Geolocation error:", err); // Mencetak error yang lebih spesifik
    },
  );

});
