import "../../src/css/main.css"; // import main.css
import "../../src/css/styles.css"; // import styles.css

// Import all images from assets/images folder
const images = require.context(
  "../assets/images",
  true,
  /\.(png|jpe?g|gif|svg|webp)$/
);
images.keys().forEach((key) => images(key)); // Import semua gambar

export const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // List days of week

// Selector set
export const selectors = {
  btnRefresh: $("#icon-refresh"),
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

export const weatherDescriptions = (weatherCode) => {
  let weather;
  let iconSrc;

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
      iconSrc = "assets/images/weather/clear/night-clear.webp";
      break;
    case "Cloudy":
      iconSrc = "assets/images/weather/cloudly/night-cloudly.webp";
      break;
    case "Overcast":
      iconSrc = "assets/images/weather/overcast/overcast.webp";
      break;
    case "Fog":
      iconSrc = "assets/images/weather/fog/fog.webp";
      break;
    case "Drizzle":
      iconSrc = "assets/images/weather/cloudly/night-drizzle.webp";
      break;
    case "Rain":
      iconSrc = "assets/images/weather/rain/night-rain.webp";
      break;
    case "Snow":
      iconSrc = "assets/images/weather/snow/night-snow.webp";
      break;
    case "Thunderstorm":
      iconSrc = "assets/images/weather/thunderstorm/night-storm.webp";
      break;
  }

  return {
    weather,
    iconSrc,
  };
};

export const renderCurrentWeather = (data) => {
  const weatherInfo = weatherDescriptions(data.weather_code);
  console.log(weatherInfo.weather);
  console.log(data.weather_code);


  // Tentukan kondisi berdasarkan kode cuaca
  if (data.weather_code === 0 || data.weather_code === 1) {
    //clear
    condition.rain = false;
    condition.clouds = false;
    condition.lightning = false;
    condition.snow = false;
    condition.wind = false;
  } else if (data.weather_code === 2 || data.weather_code === 3) {
    // cloudly
    condition.rain = false;
    condition.clouds = true;
    condition.lightning = false;
    condition.snow = false;
    condition.wind = false;
  } else if (data.weather_code === 45 || data.weather_code === 48) {
    // fog
    condition.rain = false;
    condition.clouds = false;
    condition.lightning = true;
    condition.snow = true;
    condition.wind = false;
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
    condition.rain = false;
    condition.clouds = false;
    condition.lightning = false;
    condition.snow = false;
    condition.wind = false;
  }

 

  // Update UI
  selectors.currentWeather.text(weatherInfo.weather);
  selectors.currentTemp.text(Math.round(data.temperature_2m) + "\u00B0");
  selectors.currentHumi.text(data.relative_humidity_2m + "%");
  selectors.currentWindSpeed.text(data.wind_speed_10m + "m/s");
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

export const showTime = () => {
  const d = new Date();
  const date = d.getDate();
  const day = d.getDay();
  const month = d.getMonth();
  const year = d.getFullYear();

  const currentDate = `${daysOfWeek[day]}, ${date} ${month + 1} ${year}`;
  selectors.localTime.text(currentDate);
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
        renderCurrentWeather(data.current);
        setConditionReady();
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
  wind: false ,
};
 



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
 // stop spawning
 pause();

 // clear flags
 spawnedClouds = false;

 // clear assets
 for(let i = 0, n = assets.length; i < n; i ++)
 {
   assets.splice(i, 1);
   n --;
   i --;
 }

 // start spawning
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

 if(condition.wind)
  {
    var spawnLeaves = function()
    {
      for(let i = 0, n = randomRange(0, 3); i < n; i ++)
      {
        assets.push(new blowingLeaf());
      }

      timers.wind = setTimeout(spawnLeaves, randomRange(500, 1500));
    };

    spawnLeaves();
  }
  
  if(condition.lightning)
    {
      let spawnLightning = function()
      {
        let rand = randomRange(0, 10);
        if(rand > 7)
        {
          timers.secondFlash = setTimeout(function()
          {
            assets.push(new lightning());
          }, 200);
        }
        assets.push(new lightning());
        timers.lightning = setTimeout(spawnLightning, randomRange(500, 7000));
      };
  
      spawnLightning();
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
    if (Math.floor(Math.random() * 10) > 7) for (let i = 0, n = randomRange(3, 5); i < n; i++) assets.push(new splashDrop(this.x));
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
  this.type = 'blowing_leaf';
  this.width = randomRange(10, 20);
  this.height = this.width * 2.24;

  this.xVelocity = (windSpeed - randomRange(0, 20)) / 6;
  this.yVelocity = this.xVelocity / 6;

  this.rotation = Math.random() * 1;
  this.rotationVelocity = randomRange(-.06, .06, false);

  if(this.xVelocity > 0)
  {
    // >>>
    this.x = randomRange(-50, -100);
  }
  else
  {
    // <<<
    this.x = randomRange(canvas.width, canvas.width + 100);
  }
  
  this.gravity = randomRange(-0.06, 0.06, false);
  this.y = randomRange(canvas.height - canvas.height / 4, canvas.height);
  this.yDirectionChangeLength = randomRange(20, 100);
  this.yDirectionTravelled = 0;
};

blowingLeaf.prototype.draw = function()
{
  // save context
  context.save();

  // move x and y
  this.x += this.xVelocity;
  this.y += this.yVelocity;

  // sway
  this.yVelocity = this.yVelocity + this.gravity + -.01;

  this.yDirectionTravelled ++;
  if(this.yDirectionTravelled > this.yDirectionChangeLength)
  {
    this.yDirectionTravelled = 0;
    this.gravity *= -1;
    this.yDirectionChangeLength = randomRange(20, 100);
  }

  // increment rotation
  this.rotation += this.rotationVelocity;

  // translate context
  var xOffset = this.width / 2;
  var yOffset = this.height / 2;

  context.translate(this.x + xOffset, this.y + yOffset);
  context.rotate(this.rotation);
  context.drawImage(imageAssets.leaf.image, 0, 0, 100, 224, 0 - xOffset, 0 - yOffset, this.width, this.height);
  
  // restore context
  context.restore();

  if(this.xVelocity > 0)
  {
    // >>>
    if(this.x > canvas.width)
    {
      return false;
    }
  }
  else
  {
    // <<<
    if(this.x < -50)
    {
      return false;
    }
  }
  return true;
};

/*
| Lightning particle
|
*/
export const lightning = function() {
  this.type = 'lightning';
  this.x = randomRange(0, canvas.width);
  this.age = 0;
  this.life = 20;
  this.drawFrom = 0;
  this.drawTo = 0;
  this.points = [
    [this.x, 0]
  ];
  this.totalPoints = 0;
  this.opacity = .7;

  this.flashed = false;
  this.flashOpacity = 0;

  var nextPointX = 0;
  var nextPointY = 0;
  while(nextPointY < canvas.height)
  {
    var lastPoint = this.points[this.points.length - 1];
    nextPointX = lastPoint[0] > this.x ? randomRange(this.x, this.x + 15) : randomRange(this.x + 15, this.x);
    nextPointY = lastPoint[1] + randomRange(10, 50);
    
    if(nextPointY > canvas.height)
    {
      nextPointY = canvas.height;
    }

    this.totalPoints ++;
    this.points.push([nextPointX, nextPointY]);
  }
};

lightning.prototype.draw = function()
{
  if(this.drawTo < this.points.length)
  {
    this.drawTo = this.drawTo + 2;
    if(this.drawTo > this.points.length)
    {
      this.drawTo = this.points.length;
    }
  }
  else
  {
    this.opacity = this.opacity - .02;

    if(!this.flashed)
    {
      this.flashed = true;
      this.flashOpacity = 1;
    }
  }

  if(this.opacity < 0)
  {
    return false;
  }

  if(this.flashOpacity > 0)
  {
    context.fillStyle = 'rgba(255, 255, 255, ' + this.flashOpacity + ')';
    context.fillRect(0, 0, canvas.width, canvas.height);
    this.flashOpacity = this.flashOpacity - .1;
  }

  context.beginPath();
  context.moveTo(this.points[this.drawFrom][0], this.points[this.drawFrom][1]);

  for(var i = this.drawFrom; i < this.drawTo; i ++)
  {
    context.lineTo(this.points[i][0], this.points[i][1]);
  }

  context.strokeStyle = 'rgba(255, 255, 255, ' + this.opacity + ')';
  context.lineWidth = 3;
  context.stroke();

  return true;
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