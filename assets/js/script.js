document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '41f9bf5e3b9aecf2c2f04ae50f911e90';
    const searchBtn = document.getElementById('search-btn');
    const citySearch = document.getElementById('city-search');
    const currentWeather = document.getElementById('current-weather');
    const forecast = document.getElementById('forecast');
    const favorites = document.getElementById('favorites');

    searchBtn.addEventListener('click', () => {
        const city = citySearch.value.trim();
        if (city) {
            getWeatherData(city);
        }
    });

    function getWeatherData(city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
            .then(response => response.json())
            .then(data => displayCurrentWeather(data))
            .catch(error => console.error('Error fetching weather data:', error));
    }

    function displayCurrentWeather(data) {
        currentWeather.innerHTML = `
            <h2>${data.name}</h2>
            <p>Temperature: ${data.main.temp}°F</p>
            <p>Weather: ${data.weather[0].description}</p>
        `;
    }

    function displayData(data) {
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
            const temperature = item.main.temp.toFixed(1) + '°F';
            const weatherInfo = item.weather[0].description;

            const weatherData = document.createElement('div');
            weatherData.classList.add('forecast-item');
            weatherData.innerHTML = `
            <p>${dayOfWeek}</p>
            <p>${temperature}°F</p>
            <p>${weatherInfo}</p>
        `;
            forecast.appendChild(weatherData);
        })
    }
});
});