var apiKey = "993feb0ce570f775d627f8402ae82eaf"
import * as geo_time from './geo_time.js';
  

/*
********************************************************
use latitude and longitude to send get request
for the current weather at that location

Updates html header in the function
********************************************************
*/

function get_weather(latitude, longitude){
    
    var call = 'https://api.openweathermap.org/data/2.5/weather?lat=' + String(latitude) +
     '&lon=' + String(longitude) +
     '&appid=' + apiKey; // api call for weather data
     
     var get_data = new XMLHttpRequest();
     get_data.open("GET", call);
     get_data.onload = function(){

         if (get_data.status === 200) { // if succesful

            var output = JSON.parse(get_data.responseText);
            document.getElementById("weather-desc").innerHTML = output.weather[0].description
            document.getElementById("weather-icon").innerHTML = output.weather[0].icon
            
            return output.weather[0].main

         }
         else{

            console.log('API request failed');

         }

    }
    get_data.send()
}

/*
********************************************************
Main

runs geo_time functions
updates weather and time anytime the latitude and longitude headers change.
dev mode will stop the automatic runs and updates of data
********************************************************
*/

var dev_mode = false;

if (!dev_mode) {


    geo_time.getLocation();

    var target = document.getElementById('latitude-desc')

    // Create an observer instance.
    var observer = new MutationObserver(function(mutations) {
        // console.log(target.innerText);
        var latitude = document.getElementById("latitude-desc").innerHTML
        var longitude = document.getElementById("longitude-desc").innerHTML

        var formattedLat = latitude.split(" ")[1];
        var formattedLong = longitude.split(" ")[1];

        geo_time.getTime(formattedLat, formattedLong);
        get_weather(formattedLat, formattedLong);
    });

    // Pass in the target node, as well as the observer options.
    observer.observe(target, {
        attributes:    true,
        childList:     true,
        characterData: true
    });
    
}




