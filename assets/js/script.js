document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '41f9bf5e3b9aecf2c2f04ae50f911e90';
    const searchBtn = document.getElementById('search-btn');
    const citySearch = document.getElementById('city-search');
    const currentWeather = document.getElementById('current-weather');
    const forecast = document.getElementById('forecast');
    const favoriteList = document.getElementById('favorite-list');
    const saveFavoriteBtn = document.getElementById('save-favorite-btn');

    searchBtn.addEventListener('click', async () => {
        const city = citySearch.value.trim();
        if (city) {
            const isValidCity = await validateCity(city);
            if (isValidCity) {
                getWeatherData(city);
            } else {
                alert('Invalid city name. Please enter a valid city.');
            }
        }
    });

    saveFavoriteBtn.addEventListener('click', async () => {
        const city = citySearch.value.trim();
        if (city) {
            const isValidCity = await validateCity(city);
            if (isValidCity) {
                saveFavorite(city);
            } else {
                alert('Invalid city name. Please enter a valid city.');
            }
        }
    });

    favoriteList.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            const city = event.target.getAttribute('data-city');
            getWeatherData(city);
        } else if (event.target.tagName === 'BUTTON') {
            const city = event.target.parentElement.getAttribute('data-city');
            removeFavorite(city);
        }
    });

    function getWeatherData(city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
            .then(response => response.json())
            .then(data => {
                displayCurrentWeather(data);
                getForecastData(data.coord.lat, data.coord.lon);
            })
            .catch(error => console.error('Error fetching weather data:', error));
    }

    function displayCurrentWeather(data) {
        currentWeather.innerHTML = `
            <h2>${data.name}</h2>
            <p>Temperature: ${data.main.temp}°F</p>
            <p>Weather: ${data.weather[0].description}</p>
        `;
    }

    function getForecastData(lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
            .then(response => response.json())
            .then(data => displayData(data))
            .catch(error => console.error('Error fetching forecast data:', error));
    }

    function displayData(data) {
        forecast.innerHTML = '';

        const displayedDays = [];

        data.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
            const temperature = item.main.temp.toFixed(1) + '°F';
            const weatherInfo = item.weather[0].description;

            if (!displayedDays.includes(dayOfWeek)) {
                displayedDays.push(dayOfWeek);

                const weatherData = document.createElement('div');
                weatherData.classList.add('forecast-item');
                weatherData.innerHTML = `
                    <p>${dayOfWeek}</p>
                    <p>${temperature}</p>
                    <p>${weatherInfo}</p>
                `;
                forecast.appendChild(weatherData);

                if (displayedDays.length === 6) return;
            }
        });
    }

    async function validateCity(city) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`);
            const data = await response.json();
            return data.cod === 200;
        } catch (error) {
            console.error('Error validating city:', error);
            return false;
        }
    }

    function saveFavorite(city) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (!favorites.includes(city)) {
            favorites.push(city);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            displayFavorites();
        }
    }

    function removeFavorite(city) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites = favorites.filter(fav => fav !== city);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
    }

    function displayFavorites() {
        favoriteList.innerHTML = '';
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            li.setAttribute('data-city', city);
            li.style.cursor = 'pointer';
            const button = document.createElement('button');
            button.textContent = 'Remove';
            li.appendChild(button);
            favoriteList.appendChild(li);
        });
    }
    
    displayFavorites();
});