

import * as Background  from "./background.js"; // import background.js
import * as Main from "./main.js";  // import main.js

// weather condition default 
export let condition = { 
    clouds: false,
    lightning: false, 
    rain: false, 
    snow: false, 
    wind: false 
  };
 
// set weather description
export const weatherDescriptions = (weatherCode) => {
    let weather;  // nsme weather
    let iconSrc;  // icon weather
    let timeOfDay = Background.state;
    
    // Menentukan cuaca
    if (weatherCode === 0 || weatherCode === 1) {
      weather = "Clear";
    } else if (weatherCode === 2) {
      weather = "Cloudy";
    } else if (weatherCode === 3) {
      weather = "Overcast";
    } else if (weatherCode === 45 || weatherCode === 48) {
      weather = "Fog";
    } else if (weatherCode >= 51 && weatherCode <= 55) {
      weather = "Drizzle";
    } else if (
      weatherCode >= 61 && weatherCode <= 65 ||
      weatherCode >= 80 && weatherCode <= 82
    ) {
      weather = "Rain";
    } else if (weatherCode >= 71 && weatherCode <= 75 || weatherCode >= 85 && weatherCode <= 86) {
      weather = "Snow";
    } else if (weatherCode >= 95 && weatherCode <= 99) {
      weather = "Thunderstorm";
    }
  
    // Menentukan iconSrc berdasarkan cuaca
    switch (weather) {
      case "Clear":
        if (timeOfDay == 'sunrise') {
          iconSrc = "assets/images/weather/clear/morn-clear.webp";
        } else if (timeOfDay == 'day') {
          iconSrc = "assets/images/weather/clear/morn-clear.webp";
        } else if (timeOfDay == 'sunset') {
          iconSrc = "assets/images/weather/clear/morn-clear.webp";
        } else if (timeOfDay == 'night') {
          iconSrc = "assets/images/weather/clear/night-clear.webp";
        }
        break;
      case "Cloudy":
        if (timeOfDay == 'sunrise') {
          iconSrc = "assets/images/weather/cloudly/morn-cloudly.webp";
        } else if (timeOfDay == 'day') {
          iconSrc = "assets/images/weather/cloudly/morn-cloudly.webp";
        } else if (timeOfDay == 'sunset') {
          iconSrc = "assets/images/weather/cloudly/evening-cloudly.webp";
        } else if (timeOfDay == 'night') {
          iconSrc = "assets/images/weather/cloudly/night-cloudly.webp";
        }
        break;
      case "Overcast":
        if (timeOfDay == 'sunrise') {
          iconSrc = "assets/images/weather/overcast/overcast.webp";
        } else if (timeOfDay == 'day') {
          iconSrc = "assets/images/weather/overcast/overcast.webp";
        } else if (timeOfDay == 'sunset') {
          iconSrc = "assets/images/weather/overcast/overcast.webp";
        } else if (timeOfDay == 'night') {
          iconSrc = "assets/images/weather/overcast/overcast.webp";
        }
        break;
      case "Fog":
        if (timeOfDay == 'sunrise') {
          iconSrc = "assets/images/weather/fog/fog.webp";
        } else if (timeOfDay == 'day') {
          iconSrc = "assets/images/weather/fog/fog.webp";
        } else if (timeOfDay == 'sunset') {
          iconSrc = "assets/images/weather/fog/fog.webp";
        } else if (timeOfDay == 'night') {
          iconSrc = "assets/images/weather/fog/fog.webp";
        }
        break;
      case "Drizzle":
        if (timeOfDay == 'sunrise') {
          iconSrc = "assets/images/weather/drizzle/morn-drizzle.webp";
        } else if (timeOfDay == 'day') {
          iconSrc = "assets/images/weather/drizzle/morn-drizzle.webp";
        } else if (timeOfDay == 'sunset') {
          iconSrc = "assets/images/weather/drizzle/evening-drizzle.webp";
        } else if (timeOfDay == 'night') {
          iconSrc = "assets/images/weather/drizzle/night-drizzle.webp";
        }
        break;
      case "Rain":
        if (timeOfDay == 'sunrise') {
          iconSrc = "assets/images/weather/rain/morn-rain.webp";
        } else if (timeOfDay == 'day') {
          iconSrc = "assets/images/weather/rain/morn-rain.webp";
        } else if (timeOfDay == 'sunset') {
          iconSrc = "assets/images/weather/rain/evening-rain.webp";
        } else if (timeOfDay == 'night') {
          iconSrc = "assets/images/weather/rain/night-rain.webp";
        }
        break;
      case "Snow":
        if (timeOfDay == 'sunrise') {
          iconSrc = "assets/images/weather/snow/morn-snow.webp";
        } else if (timeOfDay == 'day') {
          iconSrc = "assets/images/weather/snow/morn-snow.webp";
        } else if (timeOfDay == 'sunset') {
          iconSrc = "assets/images/weather/snow/evening-snow.webp";
        } else if (timeOfDay == 'night') {
          iconSrc = "assets/images/weather/snow/night-snow.webp";
        }
        break;
      case "Thunderstorm":
        if (timeOfDay == 'sunrise') {
          iconSrc = "assets/images/weather/thunderstorm/morn-storm.webp";
        } else if (timeOfDay == 'day') {
          iconSrc = "assets/images/weather/thunderstorm/morn-storm.webp";
        } else if (timeOfDay == 'sunset') {
          iconSrc = "assets/images/weather/thunderstorm/evening-storm.webp";
        } else if (timeOfDay == 'night') {
          iconSrc = "assets/images/weather/thunderstorm/night-storm.webp";
        }
        break;
    }
  
    return {
      weather,
      iconSrc,
    };
  };
  
  export const renderCurrentWeather = (data) => {
    // const conditions = [0, 2, 3, 45, 51, 61, 71, 95];
    // let currentConditionIndex = 0;
    // let hasThunderstormPassed = false; // Menandakan apakah Thunderstorm sudah lewat
    // let hourSetCount = 0; // Menyimpan jumlah pengulangan untuk mengatur jam
    
    // // Fungsi untuk memperbarui kondisi berdasarkan weather code
    // function updateWeatherCondition() {
    //     const currentWeatherCode = conditions[currentConditionIndex];
    
    //     // Menentukan ikon berdasarkan pengulangan dan kondisi
    //     let iconSrc;
    
    //     // Menentukan jam dan ikon berdasarkan pengulangan
    //     const hourSetMapping = {
    //         0: 8,  // Pengulangan pertama
    //         1: 16, // Pengulangan kedua
    //         2: 20, // Pengulangan ketiga
    //         3: 4   // Pengulangan keempat
    //     };
    
    //     // Menentukan ikon untuk setiap kondisi berdasarkan pengulangan
    //     const iconMapping = {
    //         0: {
    //             0: "assets/images/weather/clear/morn-clear.webp",      // Clear
    //             1: "assets/images/weather/cloudly/morn-cloudly.webp",    // Cloudy
    //             2: "assets/images/weather/overcast/overcast.webp",     // Overcast
    //             3: "assets/images/weather/fog/fog.webp",               // Fog
    //             4: "assets/images/weather/drizzle/morn-drizzle.webp",   // Drizzle
    //             5: "assets/images/weather/rain/morn-rain.webp",         // Rain
    //             6: "assets/images/weather/snow/morn-snow.webp",         // Snow
    //             7: "assets/images/weather/thunderstorm/morn-storm.webp" // Thunderstorm
    //         },
    //         1: {
    //             0: "assets/images/weather/clear/morn-clear.webp",    // Clear
    //             1: "assets/images/weather/cloudly/evening-cloudly.webp",  // Cloudy
    //             2: "assets/images/weather/overcast/overcast.webp", // Overcast
    //             3: "assets/images/weather/fog/fog.webp",        // Fog
    //             4: "assets/images/weather/drizzle/evening-drizzle.webp", // Drizzle
    //             5: "assets/images/weather/rain/evening-rain.webp",       // Rain
    //             6: "assets/images/weather/snow/evening-snow.webp",       // Snow
    //             7: "assets/images/weather/thunderstorm/evening-storm.webp" // Thunderstorm
    //         },
    //         2: {
    //             0: "assets/images/weather/clear/night-clear.webp",       // Clear
    //             1: "assets/images/weather/cloudly/night-cloudly.webp",     // Cloudy
    //             2: "assets/images/weather/overcast/overcast.webp", // Overcast
    //             3: "assets/images/weather/fog/fog.webp",           // Fog
    //             4: "assets/images/weather/drizzle/night-drizzle.webp",   // Drizzle
    //             5: "assets/images/weather/rain/night-rain.webp",         // Rain
    //             6: "assets/images/weather/snow/night-snow.webp",         // Snow
    //             7: "assets/images/weather/thunderstorm/night-storm.webp" // Thunderstorm
    //         },
    //         3: {
    //           0: "assets/images/weather/clear/morn-clear.webp",    // Clear
    //           1: "assets/images/weather/cloudly/evening-cloudly.webp",  // Cloudy
    //           2: "assets/images/weather/overcast/overcast.webp", // Overcast
    //           3: "assets/images/weather/fog/fog.webp",        // Fog
    //           4: "assets/images/weather/drizzle/evening-drizzle.webp", // Drizzle
    //           5: "assets/images/weather/rain/evening-rain.webp",       // Rain
    //           6: "assets/images/weather/snow/evening-snow.webp",       // Snow
    //           7: "assets/images/weather/thunderstorm/evening-storm.webp" // Thunderstorm
    //         }
    //     };
    
    //     // Mengatur jam dan ikon berdasarkan pengulangan
    //     Background.setCurrentHour(hourSetMapping[hourSetCount]);
    //     iconSrc = iconMapping[hourSetCount][currentConditionIndex];
    
    //     // Mengatur kondisi cuaca
    //     condition.rain = false;
    //     condition.clouds = false;
    //     condition.lightning = false;
    //     condition.snow = false;
    //     condition.wind = false;
    
    //     // Memperbarui kondisi berdasarkan weather code
    //     switch (currentWeatherCode) {
    //         case 0: // Clear
    //             condition.rain = false;
    //             condition.clouds = false;
    //             condition.lightning = false;
    //             condition.snow = false;
    //             condition.wind = false;
    //             Main.selectors.currentWeather.text("Clear");
    //             break;
    //         case 2: // Cloudy
    //             condition.rain = false;
    //             condition.clouds = true;
    //             Main.selectors.currentWeather.text("Cloudy");
    //             break;
    //         case 3: // Overcast
    //             condition.rain = false;
    //             condition.clouds = true;
    //             Main.selectors.currentWeather.text("Overcast");
    //             break;
    //         case 45: // Fog
    //             condition.rain = false;
    //             condition.clouds = true;
    //             condition.wind = true;
    //             Main.selectors.currentWeather.text("Fog");
    //             break;
    //         case 51: // Drizzle
    //             condition.rain = true;
    //             condition.clouds = true;
    //             Main.selectors.currentWeather.text("Drizzle");
    //             break;
    //         case 61: // Rain
    //             condition.rain = true;
    //             condition.clouds = true;
    //             condition.wind = true;
    //             Main.selectors.currentWeather.text("Rain");
    //             break;
    //         case 71: // Snow
    //             condition.snow = true;
    //             Main.selectors.currentWeather.text("Snow");
    //             break;
    //         case 95: // Thunderstorm
    //             hasThunderstormPassed = true; // Tandai bahwa Thunderstorm telah berlalu
    //             condition.rain = true;
    //             condition.clouds = true;
    //             condition.lightning = true;
    //             condition.wind = true;
    //             Main.selectors.currentWeather.text("Thunderstorm");
    //             break;
    //         default:
    //             Main.selectors.currentWeather.text("Unknown Weather");
    //             break;
    //     }
    
    //     // Mengupdate elemen cuaca
    //     Main.selectors.currentTemp.text("23" + ' °');
    //     Main.selectors.currentHumi.text("90%");
    //     Main.selectors.currentWindSpeed.text("2m/s");
    //     Main.selectors.iconCurrentWeather.attr("src", iconSrc);
    
    //     // Memanggil setConditionReady() setelah semua elemen diperbarui
    //     setConditionReady();
    
    //     // Perbarui indeks kondisi untuk animasi berikutnya
    //     currentConditionIndex = (currentConditionIndex + 1) % conditions.length;
    
    //     // Cek apakah sudah satu putaran penuh
    //     if (currentConditionIndex === 0) {
    //         hourSetCount = (hourSetCount + 1) % 4; // Meningkatkan pengulangan hingga 3
    //     }
    
    //     // Panggil updateWeatherCondition lagi setelah 3 detik
    //     setTimeout(updateWeatherCondition, 15000);
    // }
    
    // // Panggil fungsi pertama kali untuk memulai
    // updateWeatherCondition();
    
    
    const weatherInfo = weatherDescriptions(data.weather_code);
 
  
  
    // Tentukan kondisi berdasarkan kode cuaca
    if (data.weather_code === 0 || data.weather_code === 1) {
      //clear
      condition.rain = false;
      condition.clouds = false;
      condition.lightning = false;
      condition.snow = false;
      condition.wind = false;
    } else if (data.weather_code === 2 ) {
      // cloudly || overcast
      condition.rain = false;
      condition.clouds = true;
      condition.lightning = false;
      condition.snow = false;
      condition.wind = false;
    } else if (data.weather_code === 45 || data.weather_code === 48) {
      // fog
      condition.rain = false;
      condition.clouds = true;
      condition.lightning = false;
      condition.snow = false;
      condition.wind = true;
    } else if (data.weather_code >= 51 && data.weather_code <= 55) {
      // drizzle
      condition.rain = true;
      condition.clouds = true;
      condition.lightning = false;
      condition.snow = false;
      condition.wind = false;
    } else if (data.weather_code >= 61 && data.weather_code <= 65 || data.weather_code >=80 && data.weather_code <= 82) {
      // rain
      condition.rain = true;
      condition.clouds = true;
      condition.lightning = false;
      condition.snow = false;
      condition.wind = true;
      condition.lightning = false;
    } else if (data.weather_code >= 71 && data.weather_code <= 77 || data.weather_code >= 85 && data.weather_code <= 86) {
      // snow
      condition.rain = false;
      condition.clouds = false;
      condition.lightning = false;
      condition.snow = true;
      condition.wind = false;
    } else if (data.weather_code >= 95 && data.weather_code <= 99) {
    thunderstorm 
      condition.rain = true;
      condition.clouds = true;
      condition.lightning = true;
      condition.snow = false;
      condition.wind = true;
    }
 
    Background.setConditionReady();
    // Update UI
    Main.selectors.currentWeather.text(weatherInfo.weather);
    Main.selectors.currentTemp.text(Math.round(data.temperature_2m) + "\u00B0");
    Main.selectors.currentHumi.text(data.relative_humidity_2m + "%");
    Main.selectors.currentWindSpeed.text(data.wind_speed_10m + "m/s");
    Main.selectors.iconCurrentWeather.attr("src", weatherInfo.iconSrc);
  };
  
  export const renderHourlyForecast = (data) => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const hourlyForecastContainer = Main.selectors.hourlyForecast.empty();
  
    // Ambil data 12 jam ke depan
    const next12HoursData = data.hourly.time.map((time, index) => ({
      time,
      temperature: data.hourly.temperature_2m[index],
      weatherCode: data.hourly.weather_code[index],
    })).filter(({ time }) => {
      const forecastTime = new Date(time);
      const forecastHour = forecastTime.getHours();
      const forecastDate = forecastTime.toDateString();
      const currentDate = currentTime.toDateString();
  
      return (
        forecastDate === currentDate && // Pastikan masih dalam hari yang sama
        forecastHour >= currentHour && 
        forecastHour < currentHour + 12
      ); // Hanya ambil jam saat ini dan 11 jam berikutnya
    });
  
    // Loop untuk menampilkan data di UI
    next12HoursData.forEach(({ time, temperature, weatherCode }) => {
      const timeFormatted = new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const weatherIcon = weatherDescriptions(weatherCode).iconSrc;
      
      hourlyForecastContainer.append(`
        <div class="bg-[#48319D]/80 w-12 h-[110px] rounded-full shadow-2xl mx-auto text-center">
          <img src="${weatherIcon}" alt="icon_weather" class="w-14 h-14 object-contain relative -top-5">
          <div class="text-xs text-white relative -top-5">
            <p class="font-bold mt-2">${timeFormatted}</p>
            <p class="my-2">${Math.round(temperature)}&deg;</p>
          </div>
        </div>
      `);
    });
  };
  
  export const renderDailyForecast = (data) => {
    const dailyForecastContainer = Main.selectors.dailyForecast.empty();
    const today = new Date().getDay();
    
    data.daily.time.forEach((_, i) => {
      const dayIndex = (today + i) % 7;
      const dayMaxTemp = Math.round(data.daily.temperature_2m_max[i]) + "\u00B0";
      const dayMinTemp = Math.round(data.daily.temperature_2m_min[i]) + "\u00B0";
      const weatherCode = data.daily.weather_code[i];
      const dailyIconSrc = weatherDescriptions(weatherCode).iconSrc;
  
      dailyForecastContainer.append(`
        <div class="bg-[#48319D]/80 w-12 h-[110px] rounded-full shadow-2xl mx-auto text-center">
          <img src="${dailyIconSrc}" alt="icon_weather" class="w-14 h-14 object-contain relative -top-5">
          <div class="text-xs text-white relative -top-3">
            <p class="font-bold">${Main.daysOfWeek[dayIndex]}</p>
            <p class="underline underline-offset-4">${dayMaxTemp}</p>
            <p>${dayMinTemp}</p>
          </div>
        </div>
      `);
    });
  };
  