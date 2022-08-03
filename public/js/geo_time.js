var latitude, longitude, localdate; // declaring global variables
var refreshRate = 60; // in seconds, refresh rate of weather, time, location

/*
********************************************************
updateTime updates the current localdate variable by one second each second.
Stops when the counter updateTimer reaches a specified value.
Uses refreshRate to determine when to stop.
********************************************************
*/

export function updateTime(localdate) {
    console.log("HELLO");
    var updateTimer = 0;
    
    var quit = setInterval(function(){

        if (updateTimer === (refreshRate - 1)) { // refreshRate minus one to ensure smoothe timing
            clearInterval(quit);
        }
        $("#countryType").on("change", function (){
            clearInterval(quit);
        });

        localdate.setSeconds(localdate.getSeconds() + 1); // continually update time
        var currentHour = localdate.getHours();
        var currentMinute = localdate.getMinutes();
        var updatedMinute = "";
        

        if(currentMinute < 10) { // add a 0 if minutes are single digit
            updatedMinute = "0" + String(currentMinute);
            
        } else {
            updatedMinute = String(currentMinute);
        }

        if (currentHour < 12) { // AM
            if (currentHour === 0) {
                document.getElementById('time-desc').innerHTML = "12:" + updatedMinute + " AM";
            } else {
                document.getElementById('time-desc').innerHTML = String(currentHour) + ":" + updatedMinute + " AM";
            }
            

        } else { // PM

            if (currentHour === 12) {
                document.getElementById('time-desc').innerHTML = (String(currentHour) + ":" + updatedMinute + " PM");
            } else {
                document.getElementById('time-desc').innerHTML = (String(currentHour % 12) + ":" + updatedMinute + " PM");
            }
            
        }

        updateTimer += 1;

    }, 1000)
    return 0;
}

/*
********************************************************
Function to get the sunrise and sunset times for a
specific location.
Used to determine morning start time and evening end times.
Assigns time-period value to morning, afternoon, evening, and night
********************************************************
*/

export function getSunStat (latitude, longitude) {
    

    var curr_time = document.getElementById("time-desc").innerHTML;
    var curr_hour = parseInt(curr_time.split(':')[0]);
    var curr_min = parseInt(curr_time.split(':')[1].split(' ')[0]);
    var mornOrAfter = curr_time.split(':')[1].split(' ')[1];
    
    var call = 'https://api.sunrise-sunset.org/json?lat=' + String(latitude) + 
        '&lng=' + String(longitude) + '&formatted=0';

    console.log(call);

    var get_data = new XMLHttpRequest();
    get_data.open("GET", call);

    get_data.onload = function(){
        
        if (get_data.status === 200) {
            var output = JSON.parse(get_data.responseText);

            var sunriseTime = new Date(output.results.sunrise);
            var sunsetTime = new Date(output.results.sunset);

            // Morning: sunrise - 11AM
            // Afternoon: 11AM - 5PM
            // Evening: 5PM - sunset
            // Night : sunset - sunrise

            if (sunriseTime.getHours() <= curr_hour && curr_hour < 11 && mornOrAfter === 'AM') { 
               // if current time falls in morning time range
                if (sunriseTime.getHours() === curr_hour && sunriseTime.getMinutes() <= curr_min) {
                    
                    document.getElementById("time-period").innerHTML = "morning";
                
                } else if (sunriseTime.getHours() < curr_hour) {
                    
                    document.getElementById("time-period").innerHTML = "morning";
                }

            } else if ((11 === curr_hour && mornOrAfter === 'AM') || (curr_hour === 12 && mornOrAfter === 'PM') || (curr_hour < 5 && mornOrAfter === 'PM')) {
                // if current time falls between afternoon times, also includes checks for switching between AM and PM
                document.getElementById("time-period").innerHTML = "afternoon";
            
            } else if (5 <= curr_hour && curr_hour <= (sunsetTime.getHours() % 12) && mornOrAfter === 'PM') {
                // if current time falls in evening range
                if (curr_hour === (sunsetTime.getHours() % 12) && curr_min <= sunsetTime.getMinutes()) {

                    document.getElementById("time-period").innerHTML = "evening";
                
                } else if (5 <= curr_hour && curr_hour <= (sunsetTime.getHours() % 12)){

                    document.getElementById("time-period").innerHTML = "evening";
                }
            } else {
                // only other time period the current time could be if not the others
                document.getElementById("time-period").innerHTML = "night";
            }
            
        }
    }

    get_data.send();

}

/*
********************************************************
Function to get the current time based on latitude and logitude 
Constantly refreshes to keep the time up to date
********************************************************
*/

export function getTime (latitude, longitude) {
    
    
    console.log("Sending API request for lat: " + String(latitude) + ", and long: " + String(longitude));
    var targetDate = new Date();
    var timestamp = targetDate.getTime()/1000 + targetDate.getTimezoneOffset() * 60;
    var call = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + String(latitude) + '%2C' + 
        String(longitude) + '&timestamp=' + String(timestamp) + '&key=AIzaSyAPpLrAadNQo_7G5Yy3y6806ZC1nm6JR6w'; // api call

    var get_data = new XMLHttpRequest();
    get_data.open("GET", call);

    get_data.onload = function(){ // Run after recieving data from get request
        
        if (get_data.status === 200) { // if succesful

            var output = JSON.parse(get_data.responseText);

            if (output.status == 'OK') { // if succesful
                
                var offsets = output.dstOffset * 1000 + output.rawOffset * 1000; // get offsets in milliseconds
                localdate = new Date(timestamp * 1000 + offsets); // put offest in date object
                var refreshDate = new Date(); // get new current date after elapsed time
                var millisecondselapsed = refreshDate - targetDate;
                localdate.setMilliseconds(localdate.getMilliseconds()+ millisecondselapsed);
                
                updateTime(localdate); // call updateTime function to increase time on html

            }
        }
        else{
            alert('Request failed.  Returned status of ' + get_data.status)
        }
    }
    
    get_data.send() // send request
    
}

/*
********************************************************
If geolocation is succesful then update html headers
********************************************************
*/

function geolocationSuccess(position) { // if geolocation was a success
    
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    document.getElementById("latitude-desc").innerHTML = "Latitude: " + String(latitude);
    document.getElementById("longitude-desc").innerHTML = "Longitude: " + String(longitude);

}
    
/*
********************************************************
If geolocation is unsuccesful then output error
Usually caused by user not clicking allow on share location
********************************************************
*/

function geolocationError(positionError) { // if there was an error geolocating (most likely denied permissions)
    document.getElementById("error").innerHTML += "Error: " + positionError.message + "<br />";
}
    
/*
********************************************************
determines if geolocation is possible and if so 
grab a generalized location for the user
********************************************************
*/

export function getLocation () {
    console.log("Locating User....");
    if (navigator.geolocation) {
        var positionOptions = {
            enableHighAccuracy: false
        };
        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, positionOptions); // get current lat and long
    } else {
        console.log("Error in geolocation");
    }
}

/*
********************************************************
Getter functions for lat and long
********************************************************
*/

export function getLat() {
    return latitude;
}

export function getLong() {
    return longitude;
}

/*
********************************************************
devMode checks if force environment is turned on and if so
 it will change the latitude and longitude to the desired country
 When these elements are updated it prompts the rest of the data to
  update off of those values
********************************************************
*/

export function devMode() {
    console.log("dev mode check...");
    if (localStorage.getItem("forceLoc") == "true") {
        let countryDropDown = document.getElementById("countryType");
        let lat = document.getElementById("latitude-desc");
        let long = document.getElementById("longitude-desc");
        console.log("Changing lat and long for desired country");
        switch(countryDropDown.value) {
            case "JP":
                lat.innerHTML = "Latitude: 35.652831";
                long.innerHTML = "Longitude: 139.839478";
                break;
            case "EG":
                lat.innerHTML = "Latitude: 30.033333";
                long.innerHTML = "Longitude: 31.233334";
                break;
            case "FR":
                lat.innerHTML = "Latitude: 48.864716";
                long.innerHTML = "Longitude: 2.349014";
                break;
            case "BR":
                lat.innerHTML = "Latitude: -23.533773";
                long.innerHTML = "Longitude: -46.625290";
                break;
            case "US":
                lat.innerHTML = "Latitude: 32.7767";
                long.innerHTML = "Longitude: -96.7970";
                break;        
        }
        
    }
}

/*
********************************************************
main

uses the changes in the time-desc header to track time passed and 
refreshes based on the refreshRate variable
********************************************************
*/

$("#countryType").on("change", devMode);

    var target = document.getElementById('time-desc')
    var counter = 0;

    // Create an observer instance.
    var observer = new MutationObserver(function(mutations) {
        counter += 1;

        if (counter === refreshRate) {
            if (localStorage.getItem("forceEnv") != "true") {
                getLocation();
            }
            counter = 0;
        } else if (counter === 1) {
            getSunStat(latitude, longitude);
        }

    });

    // Pass in the target node, as well as the observer options.
    observer.observe(target, {
        attributes:    true,
        childList:     true,
        characterData: true
    });

    