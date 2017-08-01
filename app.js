// OPENING SLIDESHOW - change image every 5 seconds, borrowed from W3Schools
// Reference w3Schools
var myIndex = 0;

var openWeatherApiKey = "f038c909145fa053da114c04e7a18e47"; //Setting API keys as Variables 
var pixabayApiKey = "3992774-69c1355f0101f3df006817b90";


var lat = "";// Global variables to Parse into google maps 
var lon = "";// They will be fed from openweathermap cordinates 

window.onload = function() {
    document.getElementById("weatherSection").style.display = "none";
};
//borrowed from W3Schools
// Reference w3Schools
function carousel() {

    var i;
    var x = document.getElementsByClassName("slideshow");

    for (i = 0; i < x.length; i++) {  //BORROWED CODE FROM W3SCHOOLS REFERENCE 
        x[i].style.display = "none";
    }

    myIndex++;

    if (myIndex > x.length) {myIndex = 1}
    x[myIndex-1].style.display = "block";
    setTimeout(carousel, 5000);
};// Reference w3Schools

carousel();

// WEATHER API FOR THE CAROUSEL AKA Slideshow

// WEATHER API (Fetch cities etc.)
var cache = new Cache();// CACHE JS Fully referenced in file, caches weather data to enable quick refresh
var processResponse = function () { // Processing the reponse for the get request

    var data = JSON.parse(this.response);
    var cities = data.list; // Turning our data into a cities variable 

    cache.setItem(this.responseURL, JSON.stringify(data));

    for (i in cities) {

        var city = cities[i]; // Using a for loop we are able to seperate different elements of data 
        var weathers = city.weather;
        var h1 = document.getElementById('temp_' + city.id);
        var h2 = document.getElementById('diff_' + city.id);
        var p = document.getElementById('output_' + city.id); // turning the ID into a string and combining it with object Id simplyfying the process, opposed to hardcoding  
        var div = document.getElementById('icon_' + city.id); //Learnt a trick

        console.log(city);

        var temp = city.main.temp + "&deg;";
        var diff = city.main.temp_min + "&deg;/" + city.main.temp_max + "&deg;";//concatenating variables and ID

        h1.innerHTML = temp;
        h2.innerHTML = diff;

        var descriptions = weathers.map(
            function (weather) {
                return weather.description;
            }
        ).join(" / ");

        if (descriptions == "") { // If statement or Exception handling, if no data is present NA
            p.innerHTML = "N/A";
        } else {
            p.innerHTML = descriptions;
        }

        var iconUrls = weathers.map(
            function (weather) { //Weather function URL 
                return 'http://openweathermap.org/img/w/' + weather.icon + '.png';
            }
        );                        

        for (i in iconUrls) {

            var img = document.createElement("img");

            img.setAttribute("src", iconUrls[i]);
            img.setAttribute("style", "height:80px;width:auto;float:right;display:block");

            div.appendChild(img);
        }
    }
};

//GET JSON FUNCTION 
var request = new XMLHttpRequest();
var url = 'http://api.openweathermap.org/data/2.5/group?id=2643741,2653822,2657355&units=metric&APPID=f038c909145fa053da114c04e7a18e47'; //Cardiff, stonehenge, london Plus the API KEY


if ($value = cache.getItem(url)) {

    console.log("Weather data fetched from cache:");
    console.log($value);

} else {

    request.addEventListener('load', processResponse); //Even listener when page loads run and trigger repo
    request.open('GET', url);
    request.send();
}
// END OF CITIES OPENING SLIDE

//GET WEATHER FOR CITY TYPED BELOW
function getWeatherData(city) { //Once the city name is typed Openweathermap provides JSON data 
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
        } else {
        // code for IE6, IE5
           xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }                                                           //concatenating variables 
    var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + openWeatherApiKey;

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            populateWeatherData(JSON.parse(xhttp.responseText));
            loadMap();
            document.getElementById("errorMessage").innerHTML = "";
            document.getElementById("errorMessage").style.display = "none";
       } else {
           document.getElementById("errorMessage").innerHTML = "Error: Should'nt be too long now Buddy";
           document.getElementById("errorMessage").style.display = "block";
       }
   };

    xhttp.open("GET", url , true); // Same get function learned from Martin in Lecture with a tweek 
    xhttp.send();
}

// INITIATE MAPS
//PARSE LONG LANG INTO GOOGLE MAPS 
function loadMap() { //Load the map onto the canvas 
    var mapCanvas = document.getElementById("map");
    var mapOptions = {
      center: new google.maps.LatLng(lat, lon),
      zoom: 10
    }
    var map = new google.maps.Map(mapCanvas, mapOptions); //Initiate canvas 
}

function search() {
    var city = document.getElementById("searchbar").value //searchbar activation 
    if (cityValidation(city)) {
        getWeatherData(city);
    }
}

function cityValidation(city) {
    if (city == "") {
        document.getElementById("errorMessage").innerHTML = "Please enter a city";//Conditioning to accept cities only 
        document.getElementById("errorMessage").style.display = "block"; // More exception handling 
        return false;
    } else {
        document.getElementById("errorMessage").innerHTML = "";//should display error but havent yet 
        document.getElementById("errorMessage").style.display = "none";
        return true;
    }
}

function populateWeatherData(json) {
    lat = json.coord.lat;// Populating the long and lat with the coordinates to then be passed onto google maps 
    lon = json.coord.lon;// Part of the requirement of joining multiple API's

    document.getElementById("weatherSection").style.display = "block";
    document.getElementById("weatherHeading").innerHTML = json.name;
    document.getElementById("weatherDescription").innerHTML = json.weather[0].description;
    document.getElementById("weatherIcon").className  = "owf owf-" + json.weather[0].id;
    document.getElementById("wind").innerHTML  = "<b>Deg:</b> " + json.wind.deg + " <b>Speed:</b> " + json.wind.speed;
    document.getElementById("cloundiness").innerHTML  = json.clouds.all + "%";
    document.getElementById("pressure").innerHTML  = json.main.pressure + " hPa";
    document.getElementById("humidity").innerHTML  = json.main.humidity + "%";
    var sunrise = new Date(json.sys.sunrise*1000);
    document.getElementById("sunrise").innerHTML  = sunrise.getHours() + ":" + "0" + sunrise.getMinutes() + ":" + sunrise.getSeconds() ;
    var sunset = new Date(json.sys.sunset*1000);
    document.getElementById("sunset").innerHTML  = sunset.getHours() + ":" + "0" + sunset.getMinutes() + ":" + sunset.getSeconds() ;
    document.getElementById("Geooords").innerHTML  = "<b>Lat:</b> " + json.coord.lat + " <b>Lon:</b> " + json.coord.lon;
}

//PIXABAY BELOW//


