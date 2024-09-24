
import * as Location from './location.js';
 
import * as Weather from './weather.js';

import * as Background from './background.js';
import { condition } from './weather.js'; // Impor condition dari weather.js

export function setConditionReady() {
  beginSpawning(); // Panggil fungsi untuk mulai animasi berdasarkan kondisi
}

/*
| Variables
*/
let animationId = false;
const assets = [];
let cityEl = false;
let tempEl = false;
let canvas = false; 
let context = false;
const timers = {};

// // Weather parameters
// const condition = {
//   clouds: true,
//   lightning: true,
//   rain: true,
//   snow: true,
//   wind: true,
// };

// Image assets
const imageAssets = {
  leaf: { fileName: 'weather_leaf.png' },
  cloud_02: { fileName: 'weather_cloud_02.png', width: 1792, height: 276 },
};

let imageAssetsLoaded = false;

// Preload image assets
const preLoadImageAssets = (callback) => {
  const imageAssetsCount = Object.keys(imageAssets).length;
  let imageAssetsLoadedCount = 0;

  const loadedHandler = () => {
    imageAssetsLoadedCount++;
    if (imageAssetsLoadedCount === imageAssetsCount) {
      imageAssetsLoaded = true;
      callback();
    }
  };

  Object.keys(imageAssets).forEach((imageAssetName) => {
    const imageAsset = imageAssets[imageAssetName];
    imageAsset.image = new Image();
    imageAsset.image.onload = loadedHandler;
    imageAsset.image.src = `https://s3.amazonaws.com/gerwins/weather/${imageAsset.fileName}`;
  });
};

/*
| Weather control methods
*/
const updateConditions = (event) => {
  const input = event.target;
  const name = input.name;
  const type = input.type;

  if (type === 'radio' && name === 'time_of_day') {
    canvas.className = input.value;
  }

  if (type === 'checkbox') {
    condition[name] = input.checked;
    setConditionReady();
  }
};

// const setConditionReady = () => {
//   pause();
//   assets.length = 0; // Clear assets
//   beginSpawning();
// };

/*
| Spawning timers
*/
export const beginSpawning = () => {
  if (animationId) return;

  if (condition.clouds) {
    assets.push(new Cloud({ x: -400 }));
    assets.push(new Cloud({ x: 700 }));
    assets.push(new Cloud({ x: 1400 }));
  }

  if (condition.rain) {
    timers.rain = setInterval(() => {
      assets.push(new RainDrop());
    }, 60);
  }

  if (condition.snow) {
    timers.snow = setInterval(() => {
      assets.push(new SnowFlake());
    }, 250);
  }

  if (condition.wind) {
    const spawnLeaves = () => {
      for (let i = 0, n = randomRange(0, 3); i < n; i++) {
        assets.push(new BlowingLeaf());
      }
      timers.wind = setTimeout(spawnLeaves, randomRange(500, 1500));
    };
    spawnLeaves();
  }

  if (Weather.condition.lightning) {
    const spawnLightning = () => {
      const rand = randomRange(0, 10);
      if (rand > 7) {
        assets.push(new Lightning());
      }
      timers.lightning = setTimeout(spawnLightning, randomRange(500, 7000));
    };
    spawnLightning();
  }

  animate();
};

/*
| Animation methods
*/
const pause = () => {
  cancelAnimationFrame(animationId);
  animationId = false;

  Object.values(timers).forEach((timer) => {
    if (timer) {
      clearInterval(timer);
      clearTimeout(timer);
    }
  });
};

const animate = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < assets.length; i++) {
    if (!assets[i].draw()) {
      assets.splice(i, 1);
      i--;
    }
  }

  animationId = requestAnimationFrame(animate);
};

/*
| Particle Classes
*/
class Cloud {
  constructor(options) {
    this.type = 'cloud';
    this.img = imageAssets.cloud_02;
    this.x = options.x || 0;
    this.y = randomRange(0 - this.img.height / 2, -60);
    this.xVelocity = (30 - randomRange(0, 10)) / 60; // Adjust wind speed as needed
  }

  draw() {
    this.x += this.xVelocity;
    context.drawImage(this.img.image, this.x, this.y, this.img.width, this.img.height);

    if (this.x > canvas.width) {
      this.x = 0 - this.img.width;
    }
    return true;
  }
}

class RainDrop {
  constructor() {
    this.type = 'rain_drop';
    this.x = randomRange(0, canvas.width);
    this.y = -10;
    this.width = 3;
    this.height = randomRange(15, 25);
    this.yVelocity = 8;
  }

  draw() {
    this.y += this.yVelocity;
    context.fillStyle = 'rgba(255, 255, 255, .4)';
    context.fillRect(this.x, this.y, this.width, this.height);
    return this.y <= canvas.height;
  }
}

class SnowFlake {
  constructor() {
    this.type = 'snow_flake';
    this.x = randomRange(-200, canvas.width + 200);
    this.y = -30;
    this.width = randomRange(10, 30);
    this.yVelocity = randomRange(0.8, 1.4);
  }

  draw() {
    this.y += this.yVelocity;
    context.beginPath();
    context.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
    context.fillStyle = 'rgba(255, 255, 255, 0.5)';
    context.fill();
    return this.y <= canvas.height;
  }
}

class BlowingLeaf {
  constructor() {
    this.type = 'blowing_leaf';
    this.x = randomRange(-50, canvas.width + 50);
    this.y = randomRange(canvas.height - 50, canvas.height);
    this.width = randomRange(10, 20);
    this.xVelocity = (30 - randomRange(0, 20)) / 6;
    this.yVelocity = this.xVelocity / 6;
  }

  draw() {
    this.x += this.xVelocity;
    this.y += this.yVelocity;
    context.drawImage(imageAssets.leaf.image, this.x, this.y, this.width, this.width * 2.24);
    return this.x <= canvas.width && this.x >= -50;
  }
}

class Lightning {
  constructor() {
    this.type = 'lightning';
    this.x = randomRange(0, canvas.width);
    this.opacity = 0.7;
  }

  draw() {
    context.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    context.fillRect(this.x, 0, 2, canvas.height);
    this.opacity -= 0.05;
    return this.opacity > 0;
  }
}

/*
| Initialise
*/
document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.getElementsByTagName('input');
  canvas = document.getElementById('canvas'); 
  context = canvas.getContext('2d');

  // cityEl = document.getElementById('city');
  // tempEl = document.getElementById('temp');

  // for (let i = 0; i < inputs.length; i++) {
  //   if (inputs[i].type === 'text') {
  //     inputs[i].addEventListener('keyup', updateConditions);
  //   } else {
  //     inputs[i].addEventListener('change', updateConditions);
  //   }
  // }

  // cityEl.innerHTML = 'Loading clouds...';
  preLoadImageAssets(() => {
 
    setConditionReady();
  });
});

// Utility function
const randomRange = (min, max) => Math.random() * (max - min) + min;
