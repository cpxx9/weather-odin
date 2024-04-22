import '../CSS/style.css';

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

// async function getWeather(id) {
//   try {
//     const response = await fetch(
//       `http://api.weatherapi.com/v1/current.json?key=82dab6adbac749db993202938241204&q=id:${id}`
//     );
//     const data = await response.json();
//     if (response.status === 200) {
//       return data;
//     }
//     console.log('Server error:', data.error.message);
//   } catch (error) {
//     console.log('Fetch error:', error);
//   }
// }

async function getLocation(location = '') {
  const locations = [];
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/search.json?key=82dab6adbac749db993202938241204&q=${location}`
    );
    const data = await response.json();
    if (response.status !== 200) {
      console.log('Server error:', data.error.message);
    }
    locations.push(...data);
    return locations;
  } catch (error) {
    console.log('Fetch error:', error);
    return false;
  }
}

function displayResults(locationArray) {
  const domContainer = document.querySelector('.results-container');
  domContainer.textContent = '';
  console.log(locationArray);
  if (locationArray.length !== 0) {
    const locationList = document.createElement('ul');
    domContainer.appendChild(locationList);
    locationArray.forEach((location) => {
      const abbr = abbrState(location.region, 'abbr');
      const locationWrapper = document.createElement('li');
      locationWrapper.textContent = `${location.name}, ${
        abbr !== undefined ? abbr : location.region
      }`;
      locationList.appendChild(locationWrapper);
    });
  }
}

const searchInput = document.querySelector('#weatherLocation');
searchInput.addEventListener('input', (e) => {
  if (e.target.value) {
    getLocation(e.target.value).then((data) => {
      displayResults(data);
    });
  }
});