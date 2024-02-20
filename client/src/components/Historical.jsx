import React, { useState, useEffect } from 'react';
import '../assets/scss/Historical.scss';
import Divider from '@mui/material/Divider';

function parseDayOfWeek(dateString) {
  
  const date = new Date(dateString);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayIndex = date.getDay();

  return weekdays[dayIndex];
}

function Historical({ parentToChild }) {

  const { lat, lon, weatherData } = parentToChild;

  const [historicalWeather, setHistoricalWeather] = useState([]);

  useEffect(() => {
    const fetchHistoricalWeather = async () => {
      if (!lat || !lon || !weatherData?.unix_datetime) {
        console.error('Missing required parameters');
        return;
      }
  
      const apiEndpoint = '/historical_weather';
      const historicalWeatherData = [];
  
      // Calculate and call the endpoint for each of the last 7 days
      for (let i = 1; i <= 7; i++) {
        const unixTime = weatherData.unix_datetime - i * 86400;
        const url = `${apiEndpoint}?lat=${lat}&lon=${lon}&time=${unixTime}`;
  
        try {
          const response = await fetch(url);
          const data = await response.json();
  
          if (response.ok) {
            historicalWeatherData.push(data);
          } else {
            console.error(`Error fetching historical weather for day ${i}`);
          }
        } catch (error) {
          console.error(`Error fetching historical weather for day ${i}: ${error.message}`);
        }
      }
      setHistoricalWeather(historicalWeatherData);
    };
  
    if (weatherData !== null) {
      fetchHistoricalWeather();
    }
  }, [lat, lon, weatherData]);

  return (
    <div>
      {historicalWeather.length > 0 && (
      <div className='historical-root'>
        <Divider/>
        <div className='historical-weather-container'>
          <div>
            <h3>Last 7 days:</h3>
            <div className='history-wrapper' >
            {historicalWeather.map((weather, index) => (
              <div className='history-value' key={index}>
                <div className='date'>{ parseDayOfWeek(weather.current_time) }</div>
                <div className='weather-info'>
                  <img src={`https://openweathermap.org/img/wn/${weather.icon_id}@2x.png`} alt="Weather Icon" />
                  <div className='temperature'>
                    {weather.temp_f}°
                  </div>
                </div>
                <div className='weather-details'>
                  { weather.weather_description.charAt(0).toUpperCase() + weather.weather_description.slice(1) }
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

export default Historical;
