var cityInputField = document.getElementById('city-input-field');
var searchedCitiesUL = document.getElementById('searched-cities-UL');

var URLname = 'http://api.openweathermap.org/data/2.5/';
var apikey = '3fe38ff62ad3a6ae6fd6a37601280073';

var searchedCities = [];
var lat = '';
var lon = '';

init();

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
    searchCity(cityInputField.value);
    cityInputField.value = '';
  }
});

function searchCity(userCityChoice) {
  var city = pickCity(userCityChoice);
  if (city) {
    var queryURL = URLname + 'forecast?q=' + city + '&APPID=' + apikey;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
        console.log(response);
      }
    };
    xmlhttp.open('GET', queryURL, true);
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
        searchedCities.pop();
      }
      localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
      init();
      return searchedCities[0];
    }
  } else {
    console.log(searchedCities);
    searchedCities.push(userCityChoice);
    localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
    return searchedCities[0];
  }
}
