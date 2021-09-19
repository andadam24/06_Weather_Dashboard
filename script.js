var cityInput = document.querySelector('#city-input');
var cityBtn = document.querySelector('#search-btn');
var cityNameEl = document.querySelector('#city-name');
var cityArr = [];
var apiKey = 'bab1286e896abbf2b3fbf496f8054549'

var handler = function(event) {
    var selectedCity = cityInput
        .value
        .trim()
        .toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');

    if (selectedCity) {
        coordinates(selectedCity);
        cityInput.value = '';
    } else {
        alert('Pick a city!');
    };
};

var coordinates = function(city) {
    var currentWeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(currentWeatherApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var lon = data.coord['long'];
                var lat = data.coord['lat'];
                cityForecast(city, long, lat);

                if (document.querySelector('.city-list')) {
                    document.querySelector('.city-list').remove();
                }

                saveCity(city);
                loadCities();
            });
        } else {
            alert(`Error: ${response.statusText}`)
        }
    })
    .catch(function(error) {
        alert('Unable to load.');
    })
};

var cityForecast = function(city, long, lat) {
    var oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=imperial&exclude=minutely,hourly,alerts&appid=${apiKey}`;
    fetch(oneCallApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {

                cityNameEl.textContent = `${city} (${moment().format("M/D/YYYY")})`; 

                console.log(data)

                currentForecast(data);
                fiveDayForecast(data);
            });
        }
    })
};

var temperature = function(element, temperature) {
    var tempEl = document.querySelector(element);
    var elementText = Math.round(temperature);
    tempEl.textContent = elementText;
};

var currentForecast = function(forecast) {
    
    var forecastEl = document.querySelector('.city-forecast');
    forecastEl.classList.remove('hide');

    var weatherIconEl = document.querySelector('#today-icon');
    var currentIcon = forecast.current.weather[0].icon;
    weatherIconEl.setAttribute('src', `http://openweathermap.org/img/wn/${currentIcon}.png`);
    weatherIconEl.setAttribute('alt', forecast.current.weather[0].main)

    displayTemp('#current-temp', forecast.current['temp']);
    displayTemp('#current-feels-like', forecast.current['feels_like']);
    displayTemp('#current-high', forecast.daily[0].temp.max);
    displayTemp('#current-low', forecast.daily[0].temp.min);

    var currentConditionEl = document.querySelector('#current-condition');
    currentConditionEl.textContent = forecast.current.weather[0].description
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');

    var currentHumidityEl = document.querySelector('#current-humidity');
    currentHumidityEl.textContent = forecast.current['humidity'];

    var currentWindEl = document.querySelector('#current-wind-speed')
    currentWindEl.textContent = forecast.current['wind_speed'];

    var uviEl = document.querySelector('#current-uvi')
    var currentUvi = forecast.current['uvi'];
    uviEl.textContent = currentUvi;

};

var fiveDayForecast = function(forecast) { 
    
    for (var i = 1; i < 6; i++) {
        var dateP = document.querySelector('#date-' + i);
        dateP.textContent = moment().add(i, 'days').format('M/D/YYYY');

        var iconImg = document.querySelector('#icon-' + i);
        var iconCode = forecast.daily[i].weather[0].icon;
        iconImg.setAttribute('src', `http://openweathermap.org/img/wn/${iconCode}.png`);
        iconImg.setAttribute('alt', forecast.daily[i].weather[0].main);

        displayTemp('#temp-' + i, forecast.daily[i].temp.day);
        displayTemp('#high-' + i, forecast.daily[i].temp.max);
        displayTemp('#low-' + i, forecast.daily[i].temp.min);

        var humiditySpan = document.querySelector('#humidity-' + i);
        humiditySpan.textContent = forecast.daily[i].humidity;
    }
}