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
                getCityForecast(city, long, lat);

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
}