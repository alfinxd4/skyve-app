import * as Main from './main.js';
import * as Background from './background.js';
// Weather params
// weather.js
export let condition = { 
  clouds: false,
  lightning: false, 
  rain: false, 
  snow: false, 
  wind: false 
};

export let weatherInfo; // Deklarasi variabel global

export const renderCurrentWeather = (data) => {
    weatherInfo = weatherDescriptions(data.weather_code); // Simpan hasil ke variabel global
    console.log(weatherInfo);

    // Reset kondisi cuaca
    condition.clouds = false;
    condition.lightning = false;
    condition.rain = false;
    condition.snow = false;
    condition.wind = false;

    // Tentukan kondisi berdasarkan kode cuaca
    switch (data.weather_code) {
        case 0: // Clear
        case 1: // Clear
            break;
        case 2: // Cloudy
        case 3: // Overcast
            condition.clouds = true;
            break;
        case 45: // Fog
        case 48: // Fog
            condition.clouds = true;
            condition.wind = true;
            break;
        case 51: // Drizzle
        case 53:
        case 55:
            condition.rain = true;
            condition.clouds = true;
            break;
        case 61: // Rain
        case 63:
        case 65:
            condition.rain = true;
            condition.clouds = true;
            condition.lightning = true;
            break;
        case 71: // Snow
        case 73:
        case 75:
            condition.snow = true;
            break;
        case 95: // Thunderstorm
        case 96:
        case 99:
            condition.rain = true;
            condition.clouds = true;
            condition.lightning = true;
            condition.snow = true;
            break;

            setConditionReady();
    }

    // Update UI
    Main.selectors.currentWeather.text(weatherInfo.weather);
    Main.selectors.currentTemp.text(Math.round(data.temperature_2m) + "\u00B0");
    Main.selectors.currentHumi.text(data.relative_humidity_2m + "%");
    Main.selectors.currentWindSpeed.text(data.wind_speed_10m + "m/s");
    Main.selectors.iconCurrentWeather.attr("src", weatherInfo.iconSrc);
};


  export const weatherDescriptions = (weatherCode) => {
    let weather = "Unknown";
    let iconSrc = "";
   
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
    if (weather === "Clear") {
      iconSrc = "assets/images/weather/clear/night-clear.webp";
    } else if (weather === "Cloudy") {
      iconSrc = "assets/images/weather/cloudly/night-cloudly.webp";
    } else if (weather === "Overcast") {
      iconSrc = "assets/images/weather/overcast/overcast.webp";
    } else if (weather === "Fog") {
      iconSrc = "assets/images/weather/fog/fog.webp";
    } else if (weather === "Drizzle") {
      iconSrc = "assets/images/weather/cloudly/night-drizzle.webp";
    } else if (weather === "Rain") {
      iconSrc = "assets/images/weather/rain/night-rain.webp";
    } else if (weather === "Snow") {
      iconSrc = "assets/images/weather/snow/night-snow.webp";
    } else if (weather === "Thunderstorm") {
      iconSrc = "assets/images/weather/thunderstorm/night-storm.webp";
    }
  
    return {
      weather,
      iconSrc,
    };



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