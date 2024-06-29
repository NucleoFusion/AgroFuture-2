
// const apiUrl = "http://api.weatherapi.com/v1/forecast.json?key=12dcd3381a2242c08f794750242906&q=New%20Delhi&days=31";

// fetch(apiUrl)
//   .then(response => response.json())
//   .then(data => {
    
//    for (let i = 0; i <30; i++) {    
//     let totalPrecipitation = data.forecast.forecastday[i].day.totalprecip_mm;
//     let rain_chance= data.forecast.forecastday[i].day.daily_chance_of_rain;
//     let text = data.forecast.forecastday[i].day.condition.text;
  
//     console.log(`Total Precipitation (mm): ${data.forecast.forecastday[i].day.totalprecip_mm}`);
//     console.log(`chances of rain(%): ${rain_chance}`);
//     console.log(` ${text}`);
//     }
    
//   })
//   .catch(error => {
//     console.error("Error fetching weather data:", error);
//   });

// weather.js

const apiUrl = "http://api.weatherapi.com/v1/forecast.json?key=12dcd3381a2242c08f794750242906&q=New%20Delhi&days=31";

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const weatherContainer = document.getElementById("weather-container");

    for (let i = 0; i < 30; i++) {
        const totalPrecipitation = data.forecast.forecastday[i].day.totalprecip_mm;
        const rainChance = data.forecast.forecastday[i].day.daily_chance_of_rain;
        const conditionText = data.forecast.forecastday[i].day.condition.text;

        // Create a weather card for each day
        const weatherCard = document.createElement("div");
        weatherCard.classList.add("weather-card");
        weatherCard.innerHTML = `
            <p>Date: ${data.forecast.forecastday[i].date}</p>
            <p>Total Precipitation (mm): ${totalPrecipitation}</p>
            <p>Chance of Rain (%): ${rainChance}</p>
            <p>Condition: ${conditionText}</p>
        `;

        weatherContainer.appendChild(weatherCard);
    }
  })
  .catch(error => {
    console.error("Error fetching weather data:", error);
  });

