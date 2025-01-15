function getWeather() {
    const apiKey = '3e7b750536c96316b738f4c45b4acea3';
    const city = document.getElementById('city').value.trim();

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = new URL('https://api.openweathermap.org/data/2.5/weather');
    currentWeatherUrl.searchParams.append('q', city);
    currentWeatherUrl.searchParams.append('appid', apiKey);
    currentWeatherUrl.searchParams.append('units', 'metric');

    const forecastUrl = new URL('https://api.openweathermap.org/data/2.5/forecast');
    forecastUrl.searchParams.append('q', city);
    forecastUrl.searchParams.append('appid', apiKey);
    forecastUrl.searchParams.append('units', 'metric');

    fetch(currentWeatherUrl)
     .then(response => response.json())
     .then(data => {
        if (data.cod !== 200) {
            throw new Error(data.message);
        }
        displayWeather(data);
        })
        .catch(error => { 
            console.error('Error fetching current weather data', error);
            alert('Error fetching current weather data. Please try again.');
        });

        fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
           if (data.cod !== "200") {
               throw new Error(data.message);
           }
           displayHourlyForecast(data.list);
           })
           .catch(error => { 
               console.error('Error fetching forecast data', error);
               alert('Error fetching forecast data. Please try again.');
           });
   }
   

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === 404) {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
        return;
    }
     else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode= data.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`; // Correct icon URL


        const temperatureHTML = `<p>${temperature}°C</p>`;
        const weatherHTML = `<p>${cityName}</p><p>${description}</p>`;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();

    }
}    

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

        const hourlyItemHtml = `
        <div class="hourly-item">
            <span>${hour}:00</span>
            <img src="${iconUrl}" alt="Hourly Weather Icon">
            <span>${temperature}°C</span>
        </div>`;
        
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}


function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}
