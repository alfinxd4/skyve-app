import "../../src/css/main.css"; // import main.css
import "../../src/css/styles.css"; // import styles.css

// import all images from assets/images folder
const images = require.context(
  "../assets/images",
  true,
  /\.(png|jpe?g|gif|svg|webp)$/
);
images.keys().map((key) => images(key)); // create an array to store all imported images

export const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // list days of week
// selector set
export const selectors = {
  btnRefresh : $("#icon-refresh"),
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

 
 

export const showTime = () => {
  const d = new Date();
  const date = d.getDate();
  const day = d.getDay();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  const time = `${daysOfWeek[day]} ${date} <span> | </span> ${hours} <span class="colon">:</span> ${minutes}`;
  selectors.localTime.html(time);
  $(".colon").toggleClass("blink", d.getSeconds() % 2 === 0);
  setTimeout(showTime, 1000);
};

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
  selectors.cityName.text(data.results[0].components.city || data.results[0].components.county);
  selectors.countryCode.text(data.results[0].components.country_code.toUpperCase());
};

export let weatherInfo; // Deklarasi letiabel global

export const renderCurrentWeather = (data) => {
  weatherInfo = weatherDescriptions(data.current.weather_code); // Simpan hasil ke letiabel global

  // Pembaruan kondisi
  condition.clouds = false;
  condition.lightning = false;
  condition.rain = false;
  condition.snow = false;
  condition.wind = false;

  switch (data.current.weather_code) {
    case 0: // Clear
    condition.clouds = false;
    condition.lightning = false;
    condition.rain = false;
    condition.snow = false;
    condition.wind = false;
    case 1: // Clear
    condition.clouds = false;
    condition.lightning = false;
    condition.rain = false;
    condition.snow = false;
    condition.wind = false;
      break;
    case 2: // Cloudy
      condition.clouds = true;
      condition.lightning = false;
      condition.rain = false;
      condition.snow = false;
      condition.wind = false;
      break;
    case 3: // Overcast
      condition.clouds = true;
      condition.lightning = false;
      condition.rain = false;
      condition.snow = false;
      condition.wind = false;
      break;
      case 45: // Fog
      case 48: // Fog
        condition.rain = false;
        condition.clouds = true;
        condition.lightning = false;
        condition.snow = false;
        condition.wind = true;
        break;
      case 51: // Drizzle
      case 53: // Drizzle
      case 55: // Drizzle
        condition.rain = true;
        condition.clouds = true;
        condition.lightning = false;
        condition.snow = false;
        condition.wind = false;
        break;
    case 61: // Rain
    case 63: // Rain
    case 65: // Rain
    condition.rain = true;
    condition.clouds = true;
    condition.lightning = true;
    condition.snow = false;
    condition.wind = false;
      break;
    case 71: // Snow
    case 73: // Snow
    case 75: // Snow
    condition.rain = false;
    condition.clouds = false;
    condition.lightning = false;
    condition.snow = true;
    condition.wind = false;
      break;
    case 95: // Thunderstorm
    case 96: // Thunderstorm
    case 99: // Thunderstorm
    condition.rain = true;
    condition.clouds = true;
    condition.lightning = true;
    condition.snow = true;
    condition.wind = false;
      break;
    default:
      break;
  }
  // Update UI
  selectors.currentWeather.text(weatherInfo.weather);
  selectors.currentTemp.text(Math.round(data.current.temperature_2m) + "\u00B0");
  selectors.currentHumi.text(data.current.relative_humidity_2m + "%");
  selectors.currentWindSpeed.text(data.current.wind_speed_10m + "m/s");
  selectors.iconCurrentWeather.attr("src", weatherInfo.iconSrc);
};


export const renderHourlyForecast = (data) => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const hourlyForecastContainer = selectors.hourlyForecast.empty();

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
  const dailyForecastContainer = selectors.dailyForecast.empty();
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
          <p class="font-bold">${daysOfWeek[dayIndex]}</p>
          <p class="underline underline-offset-4">${dayMaxTemp}</p>
          <p>${dayMinTemp}</p>
        </div>
      </div>
    `);
  });
};

$(window).on("load", () => {
  $("#daily-forecast").addClass("hidden");
  getCoordinates((lat, lon) => {
    const apiWeather = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FBangkok`;
    
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C${lon}&key=250178f6b314472c95280f5f73d608e1`)
      .then(response => response.json())
      .then(renderGeocoding)
      .catch(console.error);

    fetch(apiWeather)
      .then(response => response.json())
      .then(data => {
        renderCurrentWeather(data);
        renderHourlyForecast(data);
        renderDailyForecast(data);
      })
      .catch(console.error);
  }, (err) => {
    alert("Unable to retrieve your location. Please ensure location services are enabled.");
    console.error("Geolocation error:", err);
  });
  
  
});


// refresh-page
selectors.btnRefresh.on("click", () => {
  location.reload();
});

// Show/hide drawer
$("#drawer-toggle").on("click", () => {
  selectors.drawer.toggleClass("drawer-collapsed drawer-expanded");
  selectors.expandedContent.toggleClass("hidden");
  selectors.menu.toggleClass("hidden");
});

// Event for switching between Hourly and Daily Forecast
$("#hourly-page").on("click", () => {
  selectors.dailyForecast.addClass("hidden");
  selectors.hourlyForecast.removeClass("hidden");
});

$("#daily-page").on("click", () => {
  selectors.hourlyForecast.addClass("hidden");
  selectors.dailyForecast.removeClass("hidden");
});

showTime();

export let animationId = false, assets = [], inputs = [], tempEl = false, canvas = false, context = false, timers = {};
export let imageAssetsLoaded = false, imageAssets = {
  'leaf': { fileName: 'weather_leaf.png' },
  'cloud_02': { fileName: 'weather_cloud_02.png', width: 1792, height: 276 }
};

// Weather params
export let condition = { 
  clouds: false,
  lightning: false, 
  rain: false, 
  snow: false, 
  wind: false 
};
// Contoh data
export const data = {
  current: {
    weather_code: 45, // Contoh kode cuaca
    temperature_2m: 30,
    relative_humidity_2m: 65,
    wind_speed_10m: 5,
  },
};

renderCurrentWeather(data); // Memanggil fungsi

 



export let spawnedClouds = false, windSpeed = 30, windDirection = 120, temp = 0;
export const rainColor = 'rgba(255, 255, 255, .4)';

// Util methods
export const randomRange = function(min, max, round = true) {
  const val = Math.random() * (max - min) + min;
  return round ? Math.floor(val) : val;
};

export const preLoadImageAssets = function(callback) {
  let imageAssetsCount = 0, imageAssetsLoadedCount = 0;

  if (imageAssetsLoaded) { if (callback) callback(); return; }
  const loadedHandler = function() {
    imageAssetsLoadedCount++;
    if (imageAssetsLoadedCount === imageAssetsCount) {
      imageAssetsLoaded = true;
      if (callback) callback();
    }
  };

  for (const imageAssetName in imageAssets) {
    const imageAsset = imageAssets[imageAssetName];
    imageAssetsCount++;
    imageAsset.image = new Image();
    imageAsset.image.onload = loadedHandler;
    imageAsset.image.src = 'https://s3.amazonaws.com/gerwins/weather/' + imageAsset.fileName;
  }
};

 
export const setConditionReady = function() {
  pause();
  spawnedClouds = false;
  assets = []; // Clear assets
  beginSpawning();
};

/*
|
| Spawning timers
|
*/
export const beginSpawning = function() {
  if (animationId) return;
  if (condition.clouds && !spawnedClouds) {
    assets.push(new cloud({ x: -400 }), new cloud({ x: 700 }), new cloud({ x: 1400 }));
    spawnedClouds = true;
  }
  if (condition.rain) timers.rain = setInterval(() => assets.push(new rainDrop()), 60);
  if (condition.snow) timers.snow = setInterval(() => assets.push(new snowFlake()), 250);
  if (condition.wind) {
    (function spawnLeaves() {
      for (let i = 0, n = randomRange(0, 3); i < n; i++) assets.push(new blowingLeaf());
      timers.wind = setTimeout(spawnLeaves, randomRange(500, 1500));
    })();
  }
  if (condition.lightning) {
    (function spawnLightning() {
      if (randomRange(0, 10) > 7) timers.secondFlash = setTimeout(() => assets.push(new lightning()), 200);
      assets.push(new lightning());
      timers.lightning = setTimeout(spawnLightning, randomRange(500, 7000));
    })();
  }
  animate();
};

/*
|
| Animation methods
|
*/
export const pause = function() {
  cancelAnimationFrame(animationId);
  animationId = false;
  for (let intervalId in timers) if (timers[intervalId]) clearInterval(timers[intervalId]);
};

export const animate = function() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0, n = assets.length; i < n; i++) {
    if (!assets[i].draw()) { assets.splice(i, 1); n--; i--; }
  }
  animationId = window.requestAnimationFrame(animate);
};

/*
| Cloud particle
|
*/
export const cloud = function(options) {
  this.type = 'cloud';
  this.img = options.img || imageAssets.cloud_02;
  this.width = this.img.width; 
  this.height = this.img.height; 
  this.xVelocity = (windSpeed - randomRange(0, 10)) / 60;
  this.x = options.x || randomRange(-100, canvas.width + 100);    
  this.y = options.y || randomRange(0 - (this.height / 2), -60);
};

cloud.prototype.draw = function() {
  this.x += this.xVelocity;
  context.drawImage(this.img.image, this.x, this.y, this.img.width, this.img.height);
  if (this.x > canvas.width) { this.xVelocity = (windSpeed - randomRange(0, 10)) / 60; this.x = 0 - this.width; }
  if (this.x < 0 - this.width) { this.xVelocity = (windSpeed - randomRange(0, 10)) / 60; this.x = canvas.width; }
  return true;
};

/*
| Rain drop particle
|
*/
const rainDrop = function() {
  this.type = 'rain_drop';
  this.width = 3;
  this.height = randomRange(15, 25);
  this.x = randomRange(0, canvas.width);
  this.y = -10;
  this.yVelocity = 8;
};

rainDrop.prototype.draw = function() {
  this.y += this.yVelocity;
  context.fillStyle = rainColor;
  context.fillRect(this.x, this.y, this.width, this.height);
  if (this.y > canvas.height) {
    if (Math.floor(Math.random() * 10) > 7) for (const i = 0, n = randomRange(3, 5); i < n; i++) assets.push(new splashDrop(this.x));
    return false;
  }
  return true;
};

/*
| Splash drop particle
|
*/
export const splashDrop = function(x) {
  this.type = 'splash_drop';
  this.width = 3; this.height = 3;
  this.x = x; this.y = canvas.height;
  this.yVelocity = randomRange(-1, -3, false);
  this.xVelocity = randomRange(-2, 2, false);
  this.age = 0; this.maxAge = 30;
};

splashDrop.prototype.draw = function() {
  this.y += this.yVelocity; this.x += this.xVelocity;
  context.fillStyle = rainColor; context.fillRect(this.x, this.y, this.width, this.height);
  this.yVelocity += 0.1; this.age++;
  return this.age > this.maxAge ? false : true;
};

/*
| Snow flake particle
|
*/
export const snowFlake = function() {
  this.type = 'snow_flake';
  this.width = randomRange(10, 30); this.height = this.width;
  this.x = randomRange(-200, canvas.width + 200); this.y = -30;
  this.xVelocity = (windSpeed - randomRange(0, 10)) / 60; this.yVelocity = randomRange(.8, 1.4, false);
  this.opacity = randomRange(.3, .7, false); this.settleLength = 500; this.settled = 0;
};

snowFlake.prototype.draw = function() {
  this.y += this.yVelocity; this.x += this.xVelocity;
  context.beginPath(); context.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI, false);
  context.fillStyle = 'rgba(255, 255, 255, ' + this.opacity + ')'; context.fill();
  if (this.y > canvas.height) { this.xVelocity = 0; this.yVelocity = 0; this.settled++; return this.settled > this.settleLength ? false : true; }
  return true;
};

/*
| Blowing leaf particle
|
*/
export const blowingLeaf = function() {
  this.type = 'blowing_leaf'; this.width = randomRange(10, 20); this.height = this.width * 2.24;
  this.xVelocity = (windSpeed - randomRange(0, 20)) / 6; this.yVelocity = this.xVelocity / 6;
  this.rotation = Math.random() * 1; this.rotationVelocity = randomRange(-.06, .06, false);
  this.x = this.xVelocity > 0 ? randomRange(-50, -100) : randomRange(canvas.width, canvas.width + 100);
  this.gravity = randomRange(-0.06, 0.06, false); this.y = randomRange(canvas.height - canvas.height / 4, canvas.height);
  this.yDirectionChangeLength = randomRange(20, 100); this.yDirectionTravelled = 0;
};

blowingLeaf.prototype.draw = function() {
  context.save();
  this.x += this.xVelocity; this.y += this.yVelocity;
  this.yVelocity += this.gravity - .01; this.yDirectionTravelled++;
  if (this.yDirectionTravelled > this.yDirectionChangeLength) { this.yDirectionTravelled = 0; this.yVelocity = randomRange(-1, 1, false); }
  context.translate(this.x, this.y); context.rotate(this.rotation);
  context.drawImage(imageAssets.leaf.image, -this.width / 2, -this.height / 2, this.width, this.height);
  context.restore();
  if (this.x > canvas.width + 50 || this.x < -50 || this.y > canvas.height) return false;
  return true;
};

/*
| Lightning particle
|
*/
export const lightning = function() {
  this.type = 'lightning'; this.x = randomRange(0, canvas.width); this.y = -20;
  this.height = randomRange(50, 100); this.width = 3;
};

lightning.prototype.draw = function() {
  context.fillStyle = 'rgba(255, 255, 255, .8)'; context.fillRect(this.x, this.y, this.width, this.height);
  return this.y < canvas.height + this.height ? (this.y += 2) : false;
 };

 let state;

 export function setTimeBasedWeather() {
  const currentHour = new Date().getHours();
 
   if (currentHour >= 4 && currentHour < 6) {
     state = 'sunrise';
   } else if (currentHour >= 7 && currentHour < 15) {
     state = 'day';
   } else if (currentHour >= 16 && currentHour < 19) {
     state = 'sunset';
   } else {
     state = 'night';
   }
 
   // Update class name to change background and weather
   if (canvas) {
     canvas.className = state;
   } 
 }
 
 // Contoh penggunaan
 setTimeBasedWeather(); // Panggil fungsi untuk mengatur state
 
 // Dapatkan nilai state setelah fungsi dipanggil
 console.log(state); // Ini akan menampilkan nilai state yang terbaru
 

// Resize canvas function
export const resizeCanvas = function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

/*
|
| Initialise
|
*/
document.addEventListener('DOMContentLoaded', function() {
  const inputs = document.getElementsByTagName('input');
  canvas = document.getElementById('canvas'); 
  context = canvas.getContext('2d');
  resizeCanvas();
  setTimeBasedWeather();
  window.addEventListener('resize', resizeCanvas);
  
  // let cityEl = document.getElementById('city');
  // let tempEl = document.getElementById('temp');

  for (const i = 0; i < inputs.length; i++) {
    if (inputs[i].type === 'text') {
      inputs[i].addEventListener('keyup', updateConditions);
    } else {
      inputs[i].addEventListener('change', updateConditions);
    }
  }

  preLoadImageAssets(function() {
    setConditionReady();
  });
});
