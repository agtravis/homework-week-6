var cityInputField = document.getElementById('city-input-field');
var searchedCitiesUL = document.getElementById('searched-cities-UL');
var currentCityElement = document.getElementById('current-city');
var currentDateElement = document.getElementById('current-date');
var currentIcon = document.getElementById('current-icon');
var currentTemperature = document.getElementById('current-temperature');
var currentHumidity = document.getElementById('current-humidity');
var currentWindSpeed = document.getElementById('current-wind-speed');
var currentUVIndex = document.getElementById('current-uv-index');

var URLname = 'https://api.openweathermap.org/data/2.5/';
var apikey = '3fe38ff62ad3a6ae6fd6a37601280073';

var searchedCities = [];
var lat = '';
var lon = '';
var lostCity = '';
var d = new Date();

currentDateElement.textContent =
  '(' + (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear() + ')';

for (var i = 1; i <= 5; ++i) {
  var nextDay = new Date(d);
  nextDay.setDate(nextDay.getDate() + i);
  document.getElementById('forecast-' + i + '-date').textContent =
    nextDay.getMonth() +
    1 +
    '/' +
    nextDay.getDate() +
    '/' +
    nextDay.getFullYear();
}

init();

navigator.geolocation.getCurrentPosition(showPosition);

cityInputField.addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    cityInputField.value = capitalize(cityInputField.value);
    searchCity(cityInputField.value);
    cityInputField.value = '';
  }
});

searchedCitiesUL.addEventListener('click', function(event) {
  var element = event.target;
  if (element.matches('li')) {
    searchCity(element.textContent);
  }
});

function init() {
  searchedCities = JSON.parse(localStorage.getItem('searchedCities'));
  if (searchedCities) {
    renderSearchedCities();
  } else {
    searchedCities = [];
  }
}

function renderSearchedCities() {
  searchedCitiesUL.innerHTML = '';
  for (var i = 0; i < searchedCities.length; ++i) {
    var searchedCity = searchedCities[i];
    var li = document.createElement('li');
    li.textContent = searchedCity;
    li.setAttribute('class', 'searched-city');
    searchedCitiesUL.appendChild(li);
  }
}

function showPosition(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  currentCity(lat, lon);
}

function currentCity(lat, lon) {
  var queryURL =
    URLname + 'weather?lat=' + lat + '&lon=' + lon + '&APPID=' + apikey;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(this.responseText);
      searchCity(response.name);
      currentUV(lat, lon);
    }
  };
  xmlhttp.open('GET', queryURL, true);
  xmlhttp.send();
}

function currentUV(lat, lon) {
  var queryURLUVindex =
    'https://api.openweathermap.org/data/2.5/uvi?appid=' +
    apikey +
    '&lat=' +
    lat +
    '&lon=' +
    lon;
  var xmlhttpUVindex = new XMLHttpRequest();
  xmlhttpUVindex.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var responseUVIndex = JSON.parse(this.responseText);
      currentUVIndex.textContent = responseUVIndex.value;
    }
  };
  xmlhttpUVindex.open('GET', queryURLUVindex, true);
  xmlhttpUVindex.send();
}

function searchCity(userCityChoice) {
  var city = pickCity(userCityChoice);
  if (city) {
    var queryURL = URLname + 'forecast?q=' + city + '&APPID=' + apikey;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById('app').classList.remove('hide');
        var response = JSON.parse(this.responseText);
        currentInfo(response);
        lat = response.city.coord.lat;
        lon = response.city.coord.lon;
        currentUV(lat, lon);
        // var hours = d.getHours();
        // d.setHours(12);
        // var currentUTC = getUTC(d);
        // d.setHours(hours);
        // searchObj(response, currentUTC);
        forecast(response);
      }
    };
    xmlhttp.open('GET', queryURL, true);
    xmlhttp.onload = function() {
      if (this.status == 404) {
        alert(searchedCities[0] + ' is not a valid city name.');
        searchedCities.shift();
        if (searchedCities.length < 8 && lostCity !== '') {
          searchedCities.push(lostCity);
        }
        localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
        init();
      }
    };
    xmlhttp.send();
  }
}

function currentInfo(response) {
  currentCityElement.textContent =
    response.city.name + ', ' + response.city.country;
  currentIcon.setAttribute(
    'src',
    'https://openweathermap.org/img/wn/' +
      response.list[0].weather[0].icon +
      '@2x.png'
  );
  currentTemperature.textContent = (
    (response.list[0].main.temp - 273.15) * (9 / 5) +
    32
  ).toFixed(1);
  currentHumidity.textContent = response.list[0].main.humidity;
  var windSpeedMPS = response.list[0].wind.speed;
  var windSpeedMPH = Math.round(((windSpeedMPS * 3600) / 1610.3) * 1000) / 1000;
  currentWindSpeed.textContent = windSpeedMPH.toFixed(1);
}

function forecast(response) {
  for (var i = 1; i <= 5; ++i) {
    document
      .getElementById('forecast-' + i + '-image')
      .setAttribute(
        'src',
        'https://openweathermap.org/img/wn/' +
          response.list[i * 8 - 1].weather[0].icon +
          '@2x.png'
      );
    document.getElementById('forecast-' + i + '-temperature').textContent = (
      (response.list[i * 8 - 1].main.temp - 273.15) * (9 / 5) +
      32
    ).toFixed(1);
    document.getElementById('forecast-' + i + '-humidity').textContent =
      response.list[i * 8 - 1].main.humidity;
  }
}

function pickCity(userCityChoice) {
  if (searchedCities) {
    if (!userCityChoice) {
      alert('Please enter a city');
    } else {
      var city = userCityChoice;
      if (!searchedCities.includes(city)) {
        searchedCities.unshift(city);
      } else if (searchedCities.includes(city)) {
        searchedCities.splice(searchedCities.indexOf(city), 1);
        searchedCities.unshift(city);
      }
      while (searchedCities.length > 8) {
        lostCity = searchedCities[8];
        searchedCities.pop();
      }
      localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
      init();
      return searchedCities[0];
    }
  } else {
    searchedCities.push(userCityChoice);
    localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
    return searchedCities[0];
  }
}

function capitalize(userCityChoice) {
  userCityChoice = userCityChoice.toLowerCase();
  userCityChoice = userCityChoice.split(' ');
  for (var i = 0; i < userCityChoice.length; ++i) {
    userCityChoice[i] =
      userCityChoice[i].charAt(0).toUpperCase() + userCityChoice[i].slice(1);
  }
  return userCityChoice.join(' ');
}

// function getUTC(d) {
//   var n = d.getTime();
//   n = n / 1000;
//   n = n - (n % 10800);
//   return n;
// }

// function searchObj(obj, query) {
//   for (var key in obj) {
//     var value = obj[key];

//     if (typeof value === 'object') {
//       searchObj(value, query);
//     }

//     if (value === query) {
//       console.log('property=' + key + ' value=' + value + 'index=');
//     }
//   }
// }
