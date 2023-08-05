var searchFormEl = document.querySelector('#search-form');
var inputSearchEl = document.querySelector('#input-search');

// Event Listener for Search Form 
var formSubmitHandler = function (event) {
    event.preventDefault();

    var searchTerm = inputSearchEl.value.trim();

    if (searchTerm) {
        getWeatherApi(searchTerm);

        searchFormEl.textContent = '';
    } else { 
        displayModal('Please enter a City Name');
    }

}

// Function to pull Weather API
var getWeatherApi = function (city) {
    var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + ',' + 'US' + '&limit=5' + '&appid=3ae860ddb5e34b2d1628f39024bdcf22';

    fetch(apiUrl)
        .then(function (response)
        if (response.ok) {
            console.log(response);
            response.json().then(function (data) {
              console.log(data);
              displayRepos(data, city);
            });
          } else {
            displayModal('Error: ' + response.statusText);
          }
        })
        .catch(function (error) {
            displayModal('Unable to connect to Weather API');
        });

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