import '../CSS/style.css';
import '../CSS/reset.css';
import _ from 'lodash';

function abbrState(input, to) {
  const states = [
    ['Arizona', 'AZ'],
    ['Alabama', 'AL'],
    ['Alaska', 'AK'],
    ['Arkansas', 'AR'],
    ['California', 'CA'],
    ['Colorado', 'CO'],
    ['Connecticut', 'CT'],
    ['Delaware', 'DE'],
    ['Florida', 'FL'],
    ['Georgia', 'GA'],
    ['Hawaii', 'HI'],
    ['Idaho', 'ID'],
    ['Illinois', 'IL'],
    ['Indiana', 'IN'],
    ['Iowa', 'IA'],
    ['Kansas', 'KS'],
    ['Kentucky', 'KY'],
    ['Louisiana', 'LA'],
    ['Maine', 'ME'],
    ['Maryland', 'MD'],
    ['Massachusetts', 'MA'],
    ['Michigan', 'MI'],
    ['Minnesota', 'MN'],
    ['Mississippi', 'MS'],
    ['Missouri', 'MO'],
    ['Montana', 'MT'],
    ['Nebraska', 'NE'],
    ['Nevada', 'NV'],
    ['New Hampshire', 'NH'],
    ['New Jersey', 'NJ'],
    ['New Mexico', 'NM'],
    ['New York', 'NY'],
    ['North Carolina', 'NC'],
    ['North Dakota', 'ND'],
    ['Ohio', 'OH'],
    ['Oklahoma', 'OK'],
    ['Oregon', 'OR'],
    ['Pennsylvania', 'PA'],
    ['Rhode Island', 'RI'],
    ['South Carolina', 'SC'],
    ['South Dakota', 'SD'],
    ['Tennessee', 'TN'],
    ['Texas', 'TX'],
    ['Utah', 'UT'],
    ['Vermont', 'VT'],
    ['Virginia', 'VA'],
    ['Washington', 'WA'],
    ['West Virginia', 'WV'],
    ['Wisconsin', 'WI'],
    ['Wyoming', 'WY'],
  ];

  if (to === 'abbr') {
    input = input.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
    for (let i = 0; i < states.length; i += 1) {
      if (states[i][0] == input) {
        return states[i][1];
      }
    }
  } else if (to === 'name') {
    input = input.toUpperCase();
    for (let i = 0; i < states.length; i += 1) {
      if (states[i][1] === input) {
        return states[i][0];
      }
    }
  }
}

function showLoader() {
  const loader = document.querySelector('.loader');
  loader.style.display = 'block';
}

function hideLoader() {
  const loader = document.querySelector('.loader');
  loader.style.display = 'none';
}

async function getWeather(id) {
  showLoader();
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=08b3b4bc92cf4cc2ac8181252242204&q=${id}&days=3`
    );
    const data = await response.json();
    if (response.status !== 200) {
      console.log('Server error:', data.error.message);
      return false;
    }
    return data;
  } catch (error) {
    console.log('Fetch error:', error);
    return false;
  } finally {
    hideLoader();
  }
}

async function getLocation(location = '') {
  const locations = [];
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=08b3b4bc92cf4cc2ac8181252242204&q=${location}`
    );
    const data = await response.json();
    if (response.status !== 200) {
      console.log('Server error:', data.error.message);
      return false;
    }
    locations.push(...data);
    return locations;
  } catch (error) {
    console.log('Fetch error:', error);
    return false;
  }
}

function processWeatherData(data) {
  const forecast = data.forecast.forecastday;
  const proccessedWeatherData = [];
  forecast.forEach((day) => {
    proccessedWeatherData.push({
      icon: `${day.day.condition.icon}`,
      avgtemp: `${day.day.avgtemp_f}`,
      text: `${day.day.condition.text}`,
      mintemp: `${day.day.mintemp_f}`,
      maxtemp: `${day.day.maxtemp_f}`,
    });
  });

  return proccessedWeatherData;
}

function displayWeather(data) {
  const newData = processWeatherData(data);
  const forecastCards = document.querySelectorAll('.forecast-card');
  forecastCards.forEach((card) => {
    const newCard = card;
    newCard.children[1].src = newData[newCard.dataset.id].icon;
    newCard.children[2].textContent = newData[newCard.dataset.id].avgtemp;
    newCard.children[3].textContent = newData[newCard.dataset.id].text;
    newCard.children[4].textContent = `Low: ${
      newData[newCard.dataset.id].mintemp
    }`;
    newCard.children[5].textContent = `High: ${
      newData[newCard.dataset.id].maxtemp
    }`;
  });
}

function displaySearchResults(locationArray) {
  const domContainer = document.querySelector('.results-container');
  domContainer.textContent = '';
  if (locationArray.length !== 0) {
    const locationList = document.createElement('ul');
    domContainer.appendChild(locationList);
    locationArray.forEach((location, index) => {
      const abbr = abbrState(location.region, 'abbr');
      const locationWrapper = document.createElement('li');
      locationWrapper.classList.add('location-list-item');
      locationWrapper.dataset.locationIndex = index;
      locationWrapper.textContent = `${location.name}, ${
        abbr !== undefined ? abbr : location.region
      }`;
      locationList.appendChild(locationWrapper);
      if (index < locationArray.length - 1) {
        locationList.appendChild(document.createElement('hr'));
      }
    });
  }
}

/* -------------- END FUNCTIONS -------------- */
let locations = [];
const searchInput = document.querySelector('#weatherLocation');
const searchResults = document.querySelector('.results-container');

navigator.geolocation.getCurrentPosition((position) => {
  getLocation(`${position.coords.latitude},${position.coords.longitude}`).then(
    (locationData) => {
      getWeather(locationData[0].name).then((weatherData) => {
        displayWeather(weatherData);
      });
    }
  );
});

searchInput.addEventListener('input', (e) => {
  if (e.target.value) {
    getLocation(e.target.value).then((data) => {
      locations = [...data];
      displaySearchResults(data);
    });
  }
});

searchInput.addEventListener('search', () => {
  searchResults.textContent = '';
});

document.addEventListener('click', (e) => {
  if (e.target.className === 'location-list-item') {
    getWeather(`id:${locations[e.target.dataset.locationIndex].id}`).then(
      (data) => displayWeather(data)
    );
    searchResults.textContent = '';
  }
});
