import React, { useState, useEffect } from 'react';
import '../assets/scss/Current.scss';

function Current() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    // Fetch current weather data via proxy
    const fetchWeatherData = async () => {
      try {
        const response = await fetch('/current_weather');
        if (response.ok) {
          const data = await response.json();
          setWeatherData(data);
        } else {
          console.error('Error fetching weather data');
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
    fetchWeatherData();
  }, []);

  return (
    <div>
      {weatherData ? (
        <div>
          <p>Current Time: {weatherData.current_time}</p>
          <p>Description: {weatherData.description}</p>
          <p>Humidity: {weatherData.humidity}</p>
          <p>Icon ID: {weatherData.icon_id}</p>
          <img src={`https://openweathermap.org/img/wn/${weatherData.icon_id}@2x.png`} alt="Weather Icon" />
          <p>Latitude: {weatherData.latitude}</p>
          <p>Longitude: {weatherData.longitude}</p>
          <p>Main Weather: {weatherData.main_weather}</p>
          <p>Temperature (C): {weatherData.temp_c}</p>
          <p>Temperature (F): {weatherData.temp_f}</p>
          <p>Unix Datetime: {weatherData.unix_datetime}</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
}

export default Current;
