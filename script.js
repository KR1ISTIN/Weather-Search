//when user searches a city
//the current weather will pop up
//----needs humidity, temp, wind
//-----needs icon to match the weather currently
// will need a input form, button, that button needs a click event, then wil call the api function to run
// the click event needs to run the fetch call
// fetch call needs to return humidity, temp, wind for current and 5 days after
//the search needs to be added to the local storage and then back out on the page in under history
// after the city pops up with weather clear the search input

var APIKEY = "f89dbb67571b01e0fbeabaf6589c21ac" // this would not be here in real life coding 
var button = $("#button");
var newCity = $("#newCity");
var currentStatus = $("#status");
var iconEm = $("#icon");
var tempOf = $("#temp");
var humidOf = $("#humid");
var windOf = $("#wind");
var dateOf = $("#date");

button.on("click", function(){
    var city= $("#search").val() //getting the value from the search box
    callWeatherAPI(city);
    saveNewCity(city); // these are calling the two functions when button is clicked
  
})

function callWeatherAPI(city){
    function getWeather(weatherUrl) {
        return fetch(weatherUrl)
        .then(function(response) {
            return response.json()
        })
    } // below is the weather URL
    getWeather(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIKEY}`) // *CONTAINS* the lat and lon data *NEEDED* for forecast url
    .then(function(data) {
        var lat = data[0].lat;
        var lon = data[0].lon;
        var destinationUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKEY}` // *USES* the lat and lon data to return weather data needed
    
        getWeather(destinationUrl) // *FETCHES* *NEW* URL (the one above now)
        .then(function (weather) { 
            console.log(weather) // current weather
            
            var dateEl = weather.dt; 
            var date = new Date(dateEl*1000);
            date = date.toLocaleDateString("en-US");
            // all current weather values
            var cityName = weather.name; // current city name
            var currentWeather = weather.weather[0].main; // current status of city weather
            var icon = weather.weather[0].icon;
            icon = `http://openweathermap.org/img/w/${icon}.png`;
            var temp = weather.main.temp;
            var humid = weather.main.humidity;
            var windSpeed = weather.wind.speed;
            newCity.text(cityName);
            currentStatus.text("Current Status: " + currentWeather);
            iconEm.attr("src",icon);
            tempOf.text(temp + "℉");
            humidOf.text(humid + "%");
            windOf.text(windSpeed + "mph");
            dateOf.text(date)  
            var forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKEY}`   
            // all forecasted weather values
            getWeather(forecastUrl)
            .then(function(forecast) {
                var id = 1
                for(var i = 0; i < forecast.list.length; i++) {
                    if(forecast.list[i].dt_txt.includes("12:00:00")) {
                        console.log(forecast.list[i]);
                        
                        var nextDate = forecast.list[i].dt; 
                        var date = new Date(nextDate*1000);
                        date = date.toLocaleDateString("en-US");

                        var futureTemp = forecast.list[i].main.temp;
                        var windSpeed = forecast.list[i].wind.speed;
                        var humid = forecast.list[i].main.humidity;
                        var icon = forecast.list[i].weather[0].icon;
                        icon = `http://openweathermap.org/img/w/${icon}.png`;
                        $(`#${id}`).children("h5").text(date);
                        $(`#${id}`).children(".icon").attr("src", icon);
                        $(`#${id}`).children(".temp").text("Temp: " + futureTemp + "℉");
                        $(`#${id}`).children(".wind").text("Wind Speed: " + windSpeed + "mph");
                        $(`#${id}`).children(".humid").text("Humidity: " + humid + "%");
                        id++
                    }
                }
                
            })
        })
  
        city= $("#search").val("") // clears search box after search has been completed
    })
}

// Thanks to my tutor who really helped me understand local storage, 
function saveNewCity(cityName){
    var cities = JSON.parse(localStorage.getItem("city")) || []; 
    if (!cities.includes(cityName)){ // if no strings are in local storage then continue the following
        cities.push(cityName) // add cityName to array called cities
        localStorage.setItem("city", JSON.stringify(cities)); // updating the array value to the "city" key 

    showSavedCities()
    }
}

function showSavedCities(){
    var cities = JSON.parse(localStorage.getItem("city")) || [];
    $("#city-buttons").empty();
    for (let index = 0; index < cities.length; index++) {
        const city = cities[index]; // city is input value which will be equal to a certain index value
        const btn = getButtonCityButton(city) // creates a button variable that is the function getButtonCityButton below and takes city as an argument
        $("#city-buttons").append(btn); // appends the button above with the data from the function below in getButtonCityButton
    }
}

function getButtonCityButton(city){
   var html =  `
   <button style="margin-top: .2em"class="btn btn-primary" 
   onclick="callWeatherAPI('${city}')">${city}</button>`
   return $(html);
}

showSavedCities()