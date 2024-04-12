const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezoneEl = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = '068a026e8350090d6cfec1712ba4474f'; // Replace with your OpenWeather API key

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12 : hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';

    timeEl.innerHTML = `${hoursIn12HrFormat < 10 ? '0' : ''}${hoursIn12HrFormat}:${minutes < 10 ? '0' : ''}${minutes} <span id="am-pm">${ampm}</span>`;
    dateEl.innerHTML = `${days[day]}, ${date} ${months[month]}`;
}, 1000);

getWeatherData();

function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        const { latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
            .then(res => res.json())
            .then(data => {
                showWeatherData(data);
            });
    });
}

function showWeatherData(data) {
    const { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

    timezoneEl.innerHTML = data.timezone;
    countryEl.innerHTML = `${data.lat.toFixed(2)}N, ${data.lon.toFixed(2)}E`;

    currentWeatherItemsEl.innerHTML = `
        <div class="weather-item">
            <div>Humidity</div>
            <div>${humidity}%</div>
        </div>
        <div class="weather-item">
            <div>Pressure</div>
            <div>${pressure} hPa</div>
        </div>
        <div class="weather-item">
            <div>Wind Speed</div>
            <div>${wind_speed} m/s</div>
        </div>
        <div class="weather-item">
            <div>Sunrise</div>
            <div>${new Date(sunrise * 1000).toLocaleTimeString()}</div>
        </div>
        <div class="weather-item">
            <div>Sunset</div>
            <div>${new Date(sunset * 1000).toLocaleTimeString()}</div>
        </div>
    `;

    const currentDay = data.daily[0];
    currentTempEl.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${currentDay.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
        <div class="other">
            <div class="day">${days[new Date(currentDay.dt * 1000).getDay()]}</div>
            <div class="temp">Night -${currentDay.temp.night}°C</div>
            <div class="temp">Day -${currentDay.temp.day}°C</div>
        </div>
    `;

    let otherDayForecast = '';
    data.daily.slice(1, 8).forEach(day => {
        otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${days[new Date(day.dt * 1000).getDay()]}</div>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}°C</div>
                <div class="temp">Day - ${day.temp.day}°C</div>
            </div>
        `;
    });

    weatherForecastEl.innerHTML = otherDayForecast;
}