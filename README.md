# Weather Dashboard App

On navigating to the web-page for the first time, the user will be presented with a blank page (save for a header and a footer), and a prompt from the browser to allow location to be detected. Once the user clicks to allow, the landing page is displayed.

The landing page is divided into three distinct sections:

## Current Information

The current location is displayed in the current information box, along with the date (for the user's timezone). An icon representing the current weather also displays, along with the temperature in Farenheit, the humidity, the wind speed in Miles per Hour, and the UV index.

## Forecast

There are 5 cards displaying the weather forecast for the current location, each representing exactly 24 hours ahead of the previous card (or 24 hours from now for the date for _tomorrow_), and the relevant date is displayed (again, in the user's timezone). Each card shows a weather icon, the temperatur, and the humidty for that date.

## Search

On page load, the city searched for is the current city based on geolocation. All additional searches will be saved and presented according to the order in which they were searched. The user can click on a previous search instead of typing if they choose. Once 8 searches have been made, each further search will cause the oldest search to be dropped to make room for the new search. All these searches are stored in the user's local storage, so the list will populate automatically next time the user visits.

If the user search is invalid for any reason, the list will bring back the dropped search (if one was dropped), and will not store invalid searches, or duplicate searches.

## The Code

There are five declared variables they have a type assigned by format, but no value. These are global variables which will need to be accessed by multiple functions, or need to store their value after a function has run. In particular is the variable `lostCity`, which will hold a string that might be called upon if an AJAX call fails.

The first thing that happens on page load is the current date is displayed. Next, a for loop runs to set the forecast dates using the current date as a starting point, and each loop adds the iterator to the current date to get the date represented by the iterator in the future. Also the iterator is used to make the `getElementById` more dynamic.

The `init` function is called to fill the previous search history from local storage.

The geolocation API is called to get the current location, and that in turn calls the function which first establishes the global variables for latitude and longitude coordinates, and then runs the `currentCity` function, passing the coordinates to the function. These variables are global because they can be set by the geolocation API, or a user search AJAX query response.

## Current Weather API

The `currentCity` function calls the `weather` API. this is for current information, and uses the `lat` and `lon` coordinates (stored as variables and passed into this function) as parameters. If this response is successful, the response object is stored as a variable and calls 2 further functions, `searchCity` which gets passed the response `name` property (as `response.name`), and the `currentUV`, which gets passed the coordinates.

## Current UV Index API

This is the second 3rd party API utilized (geolocation is connected to Chrome). This returns the UV index for the current day only.

## 'pickCity' function

This function is called by the `searchCity` function. This function is a helper function. The city can be searched for in more than one way: The user can type it in or click it and a string is passed, or the page detected the name of the city as part of the AJAX response received from the geolocation API and passes a property of that response object. However it is passed, by the time it hits this function the variable represents a string.

This function performs a series of checks to make sure the user entered something and then to decide what to do with the value. This function keeps the array organized, limits the length of the array, and saves any cities removed from the array so it can be recalled if necessary. It also interacts with the local storage to display the most recent array of cities each time it is called.

It will always return the zero indexed city to its call.

In theory the array will never be empty because it is given a value as soon as the user allows their location to be accessed.

## 'searchCity' function

After checking user input and configuring the array of cities and associated HTML, the function runs with the users input or geolocation city name. If successful, this function stores the response as a variable and passes it to update the `currentInfo` and `forecast` functions, and also the `currentUV` function again using the coordinates.

If it fails, the failure will alert the user that their city choice is not valid, and removes the 'bad' search from the array, and pushes any deleted items from the array back to the end.

## `currentInfo` and `forecast` functions

These functions parse the AJAX response and tell the HTML what to display.

I also have another helper function that will take the user's input and put it in title case.

## Going Further

There were a few things in creating this app that were not essential to the brief, but that I would like to implement at some point:

1. I could not figure out how to get the time-zone to display the date for the current city, the dates displayed are always based on the user's time-zone. I was refraining from using Moment.js, and perhaps this might have made it possible. I could have a huge array for every city in each timezone, or there might be another 3rd party API I could use to figure out timezones, and use that to update the date.
1. The forecasts are always for 24 hour periods. I wanted to display the forecast for a set time each day, perhaps 12noon. I could not figure out how to do this. I was able to use a search to navigate to a targeted UTC, but I stopped short of being able to manipulate it to my needs. I have deliberaly left that code in my script but commented out, should I wish to return to it. All it does at present is it gets the UTC to a value that will be matched in the response object (The UTC array objects are all 10800 seconds apart, 3 hours, so all I had to do was get the current UTC and shave off the remainder when divided by 10800, but first converting the milliseconds), and logs it to the console.

I wanted to just use native JavaScript for this project. I do use Bootstrap to help with responsiveness, and to make it look like my other projects in terms of consistent style, but I wanted to refrain from linking to any other libraries - Moment.js and jQuery in particular. I am familiar with the `$.ajax` `'GET'` requests since they are simple, and I feel like I had a little more flexibility in handling my `404` response from using JavaScript instead.

## Technology Used

- [Bootsrap](https://getbootstrap.com/)
- [OpenWeather Map](https://api.openweathermap.org)
