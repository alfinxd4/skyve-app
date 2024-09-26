
import * as Main from "./main.js";

export const getCoordinates = (success, error) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => success(position.coords.latitude, position.coords.longitude),
        (err) => {
          console.error("Error:", err.message);
          error && error(err.message);
        }
      );
    } else {
      const errorMessage = "Geolocation is not supported by this browser.";
      console.error("Error:", errorMessage);
      error && error(errorMessage);
    }
  };

  export const renderGeocoding = (data) => {
    Main.selectors.cityName.text(data.results[0].components.city || data.results[0].components.county);
    Main.selectors.countryCode.text(data.results[0].components.country_code.toUpperCase());
  };
  