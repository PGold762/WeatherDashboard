var searchFormEl = document.querySelector('#search-form');
var inputSearchEl = document.querySelector('#input-search');
var apiKey1 = '3ae860ddb5e34b2d1628f39024bdcf22';
var apiKey2 = '77f0a934245a7d9f55687be3efe39fc9';
var searchHistoryDiv = document.getElementById('history')
var lat, lon;

// Function to pull Weather API
var getWeatherData = function (city) {
    var apiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + ',' + 'US' + '&limit=1' + '&appid=' + apiKey1;

    var geocodingResponse = function () {
        return fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
            return response.json();            
        } else {
            displayModal('Error: ' + response.statusText);
          }
        })
        .catch(function (error) {
            displayModal('Unable to connect to Weather API');
        });
    }

    //Call the geocodingResponse
    geocodingResponse()
        .then(function (data) {
            lat = data[0].lat;
            lon = data[0].lon;

            // Adds the Search Term to the History
            addToSearchHistory(city);
    
            // Fetch current weather data
            var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&exclude=daily,minutely,hourly,alerts&appid=${apiKey2}`;
    
    
            fetch(currentWeatherUrl)
            .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                  console.log(data);
                  displayCurrentWeather(data);
                });
              } else {
                displayModal('Error: ' + response.statusText);
              }
            })
            .catch(function (error) {
                displayModal('Unable to connect to Weather API');
            });
    
            // Fetch 5 day weather data
            var fivedayWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=5&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey2}`;
    
            fetch(fivedayWeatherUrl)
            .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                console.log(data);
                displayFiveDayWeather(data);
                });
            } else {
                displayModal('Error: ' + response.statusText);
            }
            })
            .catch(function (error) {
                displayModal('Unable to connect to Weather API');
            });
        }
        );

    // Function to display the current weather data
    function displayCurrentWeather(data) {
        var currentWeatherDiv = document.getElementById('current-weather');
        var icon = data.weather[0].icon;
        var fahrenheitTemp = data.main.temp;
        var currentDate = new Date();
        var formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    

        var weatherHTML = `
          <h2>${city} (${formattedDate}) <img src="https://openweathermap.org/img/wn/${icon}.png"></h2>
          <p>Temperature: ${fahrenheitTemp}°F</p>
          <p>Humidity: ${data.main.humidity}%</p>
          <p>Wind Speed: ${data.wind.speed} m/s</p>
          `;

        currentWeatherDiv.innerHTML = weatherHTML;
      }
      // Function to display 5day weather data
      function displayFiveDayWeather(data) {
        var fiveDayWeatherDiv = document.getElementById('fiveday');
        var fiveDayWeatherHTML = `<h2>5-Day Forecast:</h2>`;

        // Loop through the data for each day
        for (var i = 0; i < data.list.length; i++) {
            var date = new Date(data.list[i].dt * 1000); 
            var formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            var icon = data.list[i].weather[0].icon;
            var fahrenheitTemp = data.list[i].main.temp;
    
            fiveDayWeatherHTML += `
            <div>
            <p>Date: ${formattedDate}</p>
            <p><img src="https://openweathermap.org/img/wn/${icon}.png"></p>
            <p>Temp: ${fahrenheitTemp}°F</p>
            <p>Humidity: ${data.list[i].main.humidity}%</p>
            <p>Wind: ${data.list[i].wind.speed} m/s</p>
            </div>
            `;
        }

        fiveDayWeatherDiv.innerHTML = fiveDayWeatherHTML;
      }

      // Function to convert Celsius to Fahrenheit
      function celsiusToFahrenheit(celsius) {
        var fahrenheit = (celsius * 9/5) + 32;
        return fahrenheit;
    }

    } // Close of Weather API

// Event Listener for Search Form 
var formSubmitHandler = function (event) {
    event.preventDefault();

    var searchTerm = inputSearchEl.value.trim();

    if (searchTerm) {
        getWeatherData(searchTerm);

        document.getElementById('input-search').value = '';
    } else { 
        displayModal('Please enter a City Name');
    }
}

// Modal Function
function displayModal(message) {
    var modal = document.getElementById('modal');
    var modalMessage = document.getElementById('modal-message');
    modalMessage.textContent = message;
    modal.style.display = 'block';
  }

  // Closing Modal Function
  function closeModal() {
    var modal = document.getElementById('modal');
    modal.style.display = 'none';
  }

  // Load Search from LocalStorage
  function loadSearchHistory() {
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        for (var i = 0; i < searchHistory.length; i++) {
        var searchHistoryItem = document.createElement('button');
        searchHistoryItem.textContent = searchHistory[i];
        searchHistoryDiv.appendChild(searchHistoryItem);
        }
  }

  // Search History Function
  var addToSearchHistory = function(city) {

    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

        if (!searchHistory.includes(city)) {
            searchHistory.push(city);

            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

            searchHistoryDiv.innerHTML = '';
        
            for (var i=0; i < searchHistory.length ; i++) {
            var searchHistoryItem = document.createElement('button');
            searchHistoryItem.textContent = searchHistory[i];
            searchHistoryDiv.appendChild(searchHistoryItem);
            }
        }
  };

  // Call LoadSearchHistory function on page load
  window.addEventListener('load', loadSearchHistory);

  // Activate Listeners
  searchFormEl.addEventListener('submit', formSubmitHandler);
  searchHistoryDiv.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON') {
        getWeatherData(e.target.textContent)
    }
  });