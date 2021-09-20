var cityInput = document.querySelector('#city-input');
var cityBtn = document.querySelector('#search-btn');
var cityNameEl = document.querySelector('#city-name');
var cityArr = [];
var apiKey = 'bab1286e896abbf2b3fbf496f8054549'

var formHandler = function(event) {
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
                var lon = data.coord['lon'];
                var lat = data.coord['lat'];
                cityForecast(city, lon, lat);

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

var cityForecast = function(city, lon, lat) {
    var oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${apiKey}`;
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
    var temp = document.querySelector(element);
    var elementText = Math.round(temperature);
    temp.textContent = elementText;
};

var currentForecast = function(forecast) {
    
    var getForecast = document.querySelector('.city-forecast');
    getForecast.classList.remove('hide');

    var weatherIcon = document.querySelector('#today-icon');
    var currentIcon = forecast.current.weather[0].icon;
    weatherIcon.setAttribute('src', `http://openweathermap.org/img/wn/${currentIcon}.png`);
    weatherIcon.setAttribute('alt', forecast.current.weather[0].main)

    displayTemp('#current-temp', forecast.current['temp']);
    displayTemp('#current-feels-like', forecast.current['feels_like']);
    displayTemp('#current-high', forecast.daily[0].temp.max);
    displayTemp('#current-low', forecast.daily[0].temp.min);

    var currentCondition = document.querySelector('#current-condition');
    currentCondition.textContent = forecast.current.weather[0].description
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');

    var currentHumidity = document.querySelector('#current-humidity');
    currentHumidity.textContent = forecast.current['humidity'];

    var currentWind = document.querySelector('#current-wind-speed')
    currentWind.textContent = forecast.current['wind_speed'];

    var uvi = document.querySelector('#current-uvi')
    var currentUvi = forecast.current['uvi'];
    uvi.textContent = currentUvi;

};

var fiveDayForecast = function(forecast) { 
    
    for (var i = 1; i < 6; i++) {
        var date = document.querySelector('#date-' + i);
        date.textContent = moment().add(i, 'days').format('M/D/YYYY');

        var iconImg = document.querySelector('#icon-' + i);
        var iconCode = forecast.daily[i].weather[0].icon;
        iconImg.setAttribute('src', `http://openweathermap.org/img/wn/${iconCode}.png`);
        iconImg.setAttribute('alt', forecast.daily[i].weather[0].main);

        displayTemp('#temp-' + i, forecast.daily[i].temp.day);
        displayTemp('#high-' + i, forecast.daily[i].temp.max);
        displayTemp('#low-' + i, forecast.daily[i].temp.min);

        var humidity = document.querySelector('#humidity-' + i);
        humidity.textContent = forecast.daily[i].humidity;
    }
};

var saveCity = function(city) {

    for (var i = 0; i < cityArr.length; i++) {
        if (city === cityArr[i]) {
            cityArr.splice(i, 1);
        }
    }

    cityArr.push(city);
    localStorage.setItem('cities', JSON.stringify(cityArr));
};

var loadCities = function() {
    cityArr = JSON.parse(localStorage.getItem('cities'));

    if (!cityArr) {
        cityArr = [];
        return false;
    } else if (cityArr.length > 7) {
        cityArr.shift();
    }

    var recent = document.querySelector('#recent-cities');
    var cityListUl = document.createElement('ul');
    cityListUl.className = 'list-group list-group-flush city-list';
    recent.appendChild(cityListUl);

    for (var i = 0; i < cityArr.length; i++) {
        var cityListItem = document.createElement('button');
        cityListItem.setAttribute('type', 'button');
        cityListItem.className = 'list-group-item';
        cityListItem.setAttribute('value', cityArr[i]);
        cityListItem.textContent = cityArr[i];
        cityListUl.prepend(cityListItem);
    }

    var cityList = document.querySelector('.city-list');
    cityList.addEventListener('click', selectRecent)
};

var selectRecent = function(event) {
    var clickedCity = event.target.getAttribute('value');

    coordinates(clickedCity);
};

var displayTemp = function(element, temperature) {
    var temp = document.querySelector(element);
    var elementText = Math.round(temperature);
    temp.textContent = elementText;
};

loadCities();
cityBtn.addEventListener('click', formHandler)

cityInput.addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
        cityBtn.click();
    }
});