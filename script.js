async function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  const result = document.getElementById('result');
  const error = document.getElementById('error');

  if (!city) return;

  result.classList.add('hidden');
  error.classList.add('hidden');

  try {
    // Step 1: Get coordinates for the city
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    const geoData = await geoRes.json();

    if (!geoData.results) {
      error.classList.remove('hidden');
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Step 2: Get weather for those coordinates
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`);
    const weatherData = await weatherRes.json();

    const current = weatherData.current;

    // Step 3: Display the results
    document.getElementById('cityName').textContent = `${name}, ${country}`;
    document.getElementById('temp').textContent = `${Math.round(current.temperature_2m)}°C`;
    document.getElementById('wind').textContent = `${current.wind_speed_10m} km/h`;
    document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('icon').textContent = getWeatherIcon(current.weather_code);
    document.getElementById('description').textContent = getWeatherDescription(current.weather_code);

    result.classList.remove('hidden');

  } catch (err) {
    error.classList.remove('hidden');
  }
}

function getWeatherIcon(code) {
  if (code === 0) return '☀️';
  if (code <= 2) return '⛅';
  if (code <= 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 57) return '🌦️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  if (code <= 99) return '⛈️';
  return '🌤️';
}

function getWeatherDescription(code) {
  if (code === 0) return 'Clear sky';
  if (code <= 2) return 'Partly cloudy';
  if (code <= 3) return 'Overcast';
  if (code <= 48) return 'Foggy';
  if (code <= 57) return 'Drizzle';
  if (code <= 67) return 'Rainy';
  if (code <= 77) return 'Snowy';
  if (code <= 82) return 'Rain showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
}

// Allow pressing Enter to search
document.getElementById('cityInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') getWeather();
});