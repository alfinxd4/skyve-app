import "../../src/css/main.css";

const getLocation = document.querySelector('#btn-get-location');
const latCoordinates = document.querySelector('#lat');
const longCoordinates = document.querySelector('#long');
const countryCode = document.querySelector('#country-code');
const cityName = document.querySelector('#city-name');
const regionName = document.querySelector('#region-name');
const countryName = document.querySelector('#country-name');

const locationInfo = document.querySelector('#location-info');


const baseUrl = "http://ip-api.com/json";

const getCoordinates = (coordinates) => {
  navigator.geolocation.getCurrentPosition((position)=>{
   const lat =  position.coords.latitude;
   const long =  position.coords.longitude;
   coordinates(lat,long);
  })
}

// Fungsi untuk render response JSON
const renderLocationInfo = (data) => {
  countryCode.innerText = data.countryCode;
  cityName.innerText = data.city;
  regionName.innerText = data.regionName;
  countryName.innerText = data.country;
  getCoordinates((lat,long)=>{
    longCoordinates.innerText = long;
    latCoordinates.innerText = lat;
  })

};



getLocation.addEventListener('click',()=>{
  // 
 locationInfo.classList.remove('invisible');
//  
    getCoordinates((lat,long)=>{
      // 
      fetch(`${baseUrl}/?lat=${lat}&long=${long}`)
      .then((response) => {
        return response.json();
      })
      // 
      .then((responseJson)=>{
        // showResponseMessage(responseJson.message);
        console.log(responseJson);
        // 
        renderLocationInfo(responseJson);
    })
    // 
    .catch((error)=>{
      console.error('Error:', error); 
      // showResponseMessage(error);
    })
  })
  alert("tengs e lot")
    });

 

// /?lat=-6.4484817&long=106.7905652