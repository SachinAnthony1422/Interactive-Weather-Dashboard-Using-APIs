const apiKey = '80de3a740287e6f167fbf7733f59ab83'; // Replace with your actual OpenWeatherMap API key

const getWeatherData = async (city) => {
  try {
    const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);

    if (!currentRes.ok || !forecastRes.ok) throw new Error("City not found");

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    displayCurrentWeather(currentData);
    displayForecast(forecastData);
    renderChart(forecastData.list.filter(item => item.dt_txt.includes("12:00:00")));
  } catch (error) {
    alert("Could not retrieve weather information. Please try again.");
    console.error(error);
  }
};

function displayCurrentWeather(data) {
  document.getElementById("city-name").innerText = data.name;
  document.getElementById("temperature").innerText = `Temperature: ${data.main.temp}°C`;
  document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;
  document.getElementById("wind-speed").innerText = `Wind Speed: ${data.wind.speed} km/h`;
}

function displayForecast(data) {
  const forecastContainer = document.getElementById("forecast-container");
  forecastContainer.innerHTML = '';

  const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));
  dailyData.forEach(day => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h4>${new Date(day.dt_txt).toDateString()}</h4>
      <p>Temp: ${day.main.temp}°C</p>
      <p>${day.weather[0].main}</p>
    `;
    forecastContainer.appendChild(div);
  });
}

function renderChart(data) {
  const ctx = document.getElementById("forecastChart").getContext("2d");
  const labels = data.map(item => new Date(item.dt_txt).toLocaleDateString());
  const temps = data.map(item => item.main.temp);

  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Temperature (°C)',
        data: temps,
        borderColor: 'blue',
        backgroundColor: 'lightblue',
        tension: 0.4,
      }]
    }
  });
}

function searchCity() {
  const city = document.getElementById("cityInput").value.trim();
  if (city) getWeatherData(city);
}
