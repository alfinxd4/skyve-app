import * as Weather from "./weather.js";  // import weather.js

// set animationId
export let animationId = false, assets = [], inputs = [], tempEl = false, canvas = false, context = false, timers = {};
// set assetsImage
export let imageAssetsLoaded = false, imageAssets = {
  'leaf': { fileName: 'weather_leaf.png' },
  'cloud_02': { fileName: 'weather_cloud_02.png', width: 1792, height: 276 }
};

// set default properties for spawn cloud
export let spawnedClouds = false, windSpeed = 30, windDirection = 120, temp = 0;

export const rainColor = 'rgba(255, 255, 255, .4)'; // set rain color

// set utilities methods
export const randomRange = function(min, max, round = true) {
  const val = Math.random() * (max - min) + min;
  return round ? Math.floor(val) : val;
};

// config for load images
export const preLoadImageAssets = (callback) => {
  let imageAssetsCount = 0, imageAssetsLoadedCount = 0;

  if (imageAssetsLoaded) { if (callback) callback(); return; }
  const loadedHandler = () => {
    imageAssetsLoadedCount++;
    if (imageAssetsLoadedCount === imageAssetsCount) {
      imageAssetsLoaded = true;
      if (callback) callback();
    }
  };

// looping for searh imgage in assets
  for (const imageAssetName in imageAssets) {
    const imageAsset = imageAssets[imageAssetName];
    imageAssetsCount++;
    imageAsset.image = new Image();
    imageAsset.image.onload = loadedHandler;
    imageAsset.image.src = 'https://s3.amazonaws.com/gerwins/weather/' + imageAsset.fileName;
  }
};

 
export const setConditionReady = () => {
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


//  spawning timers
export const beginSpawning = () => {
  if (animationId) return;
  if (Weather.condition.clouds && !spawnedClouds) {
    assets.push(new cloud({ x: -400 }), new cloud({ x: 700 }), new cloud({ x: 1400 }));
    spawnedClouds = true;
  }
  if (Weather.condition.rain) timers.rain = setInterval(() => assets.push(new rainDrop()), 60);
  if (Weather.condition.snow) timers.snow = setInterval(() => assets.push(new snowFlake()), 250);

 if(Weather.condition.wind)
  {
    let spawnLeaves = function()
    {
      for(let i = 0, n = randomRange(0, 3); i < n; i ++)
      {
        assets.push(new blowingLeaf());
      }

      timers.wind = setTimeout(spawnLeaves, randomRange(500, 1500));
    };
    spawnLeaves();
  }
  
  if(Weather.condition.lightning)
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


//  animation methods
export const pause = () =>{
  cancelAnimationFrame(animationId);
  animationId = false;
  for (let intervalId in timers) if (timers[intervalId]) clearInterval(timers[intervalId]);
};

// config animate
export const animate = ()=> {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0, n = assets.length; i < n; i++) {
    if (!assets[i].draw()) { assets.splice(i, 1); n--; i--; }
  }
  animationId = window.requestAnimationFrame(animate);
};

// cloud particle
export const cloud = function (options) {
  this.type = 'cloud';
  this.img = options.img || imageAssets.cloud_02;
  this.width = this.img.width; 
  this.height = this.img.height; 
  this.xVelocity = (windSpeed - randomRange(0, 10)) / 60;
  this.x = options.x || randomRange(-100, canvas.width + 100);    
  this.y = options.y || randomRange(0 - (this.height / 2), -60);
};

cloud.prototype.draw = function () {
  this.x += this.xVelocity;
  context.drawImage(this.img.image, this.x, this.y, this.img.width, this.img.height);
  if (this.x > canvas.width) { this.xVelocity = (windSpeed - randomRange(0, 10)) / 60; this.x = 0 - this.width; }
  if (this.x < 0 - this.width) { this.xVelocity = (windSpeed - randomRange(0, 10)) / 60; this.x = canvas.width; }
  return true;
};

// rain drop particle
const rainDrop = function () {
  this.type = 'rain_drop';
  this.width = 3;
  this.height = randomRange(15, 25);
  this.x = randomRange(0, canvas.width);
  this.y = -10;
  this.yVelocity = 8;
};

rainDrop.prototype.draw = function () {
  this.y += this.yVelocity;
  context.fillStyle = rainColor;
  context.fillRect(this.x, this.y, this.width, this.height);
  if (this.y > canvas.height) {
    if (Math.floor(Math.random() * 10) > 7) for (let i = 0, n = randomRange(3, 5); i < n; i++) assets.push(new splashDrop(this.x));
    return false;
  }
  return true;
};

//  Splash drop particle
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

//  Snow flake particle
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

 
//  Blowing leaf particle
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

blowingLeaf.prototype.draw = function(){
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


// Lightning particle x
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


 export let state;

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
 

// let _currentHour; // Simpan currentHour di sini

// export let state;

// export const getCurrentHour = () => _currentHour; // Getter
// export const setCurrentHour = (value) => {
//     _currentHour = value; // Setter
//     setTimeBasedWeather(); // Panggil fungsi setiap kali currentHour diatur
// };

// export function setTimeBasedWeather() {
//     if (_currentHour >= 4 && _currentHour < 6) {
//         state = 'sunrise';
//     } else if (_currentHour >= 7 && _currentHour < 15) {
//         state = 'day';
//     } else if (_currentHour >= 16 && _currentHour < 19) {
//         state = 'sunset';
//     } else {
//         state = 'night';
//     }

//     // Update class name to change background and weather
//     if (canvas) {
//         canvas.className = state;
//     }
// }


 

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