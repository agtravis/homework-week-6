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
// console.log(d);
// console.log(d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear());
// console.log(d.getUTCDate());
currentDateElement.textContent =
  '(' + (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear() + ')';

console.log(d);
var tomorrow = new Date(d);
tomorrow.setDate(tomorrow.getDate() + 1);
console.log(tomorrow);

var twoDaysFromNow = new Date(d);
twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
console.log(twoDaysFromNow);
var threeDaysFromNow = new Date(d);
threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
console.log(threeDaysFromNow);
var fourDaysFromNow = new Date(d);
fourDaysFromNow.setDate(fourDaysFromNow.getDate() + 4);
console.log(fourDaysFromNow);

init();

navigator.geolocation.getCurrentPosition(showPosition);

function showPosition(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  currentCity(lat, lon);
}

function currentCity(lat, lon) {
  // console.log('lat: ' + lat + '\nlon: ' + lon);
  var queryURL =
    URLname + 'weather?lat=' + lat + '&lon=' + lon + '&APPID=' + apikey;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(this.responseText);
      // console.log(response);
      // currentCityElement.textContent =
      //   response.name + ', ' + response.sys.country;
      searchCity(response.name);
      currentIcon.setAttribute(
        'src',
        'https://openweathermap.org/img/wn/' +
          response.weather[0].icon +
          '@2x.png'
      );
      currentTemperature.textContent = (
        (response.main.temp - 273.15) * (9 / 5) +
        32
      ).toFixed(1);
      currentHumidity.textContent = response.main.humidity;
      currentWindSpeed.textContent = response.wind.speed;
      // (0K − 273.15) × 9/5 + 32 = -459.7°F
    }
  };
  xmlhttp.open('GET', queryURL, true);
  xmlhttp.onload = function() {
    currentUV(lat, lon);
  };
  xmlhttp.send();
}

function currentUV(lat, lon) {
  lat = Math.round(lat);
  lon = Math.round(lon);
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

function init() {
  searchedCities = JSON.parse(localStorage.getItem('searchedCities'));
  console.log(searchedCities);
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

function capitalize(userCityChoice) {
  userCityChoice = userCityChoice.toLowerCase();
  userCityChoice = userCityChoice.split(' ');
  for (var i = 0; i < userCityChoice.length; ++i) {
    userCityChoice[i] =
      userCityChoice[i].charAt(0).toUpperCase() + userCityChoice[i].slice(1);
  }
  return userCityChoice.join(' ');
}

function searchCity(userCityChoice) {
  var city = pickCity(userCityChoice);
  if (city) {
    var queryURL = URLname + 'forecast?q=' + city + '&APPID=' + apikey;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
        console.log(response);
        currentCityElement.textContent =
          response.city.name + ', ' + response.city.country;
        currentIcon.setAttribute(
          'src',
          'https://openweathermap.org/img/wn/' +
            response.list[0].weather[0].icon +
            '@2x.png'
        );
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
        console.log(lostCity);
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
