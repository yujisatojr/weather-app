import React, { useState, useEffect } from 'react';
import '../assets/scss/Current.scss';
import AirIcon from '@mui/icons-material/Air';
import WaterIcon from '@mui/icons-material/Water';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

function Current({ parentToChild, onWeatherDataChange }) {

  const { lat, lon, selectedLocation } = parentToChild;
  
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Check if lat and lon are defined before making the API call
        if (lat !== undefined && lon !== undefined) {
          const response = await fetch(`/current_weather?lat=${lat}&lon=${lon}`);
          if (response.ok) {
            const data = await response.json();
            setWeatherData(data);
            // Pass weatherData to parent component
            onWeatherDataChange(data);
          } else {
            console.error('Error fetching weather data');
          }
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lon]);

  return (
    <div>
      {weatherData ? (
        <div className="weather-container">
          <h2 className="location">{selectedLocation ? selectedLocation.name : 'Dallas, Texas (US)'}</h2>
          <div className='location-geocodes'>
            <div className="lat">Latitude: {weatherData.latitude}</div>
            <div className="lon">Longitude: {weatherData.longitude}</div>
          </div>
          <div className="weather-info">
            <div className="temperature">
              <img src={`https://openweathermap.org/img/wn/${weatherData.icon_id}@2x.png`} alt="Weather Icon" />
              <span>{weatherData.temp_f}</span>°F
            </div>
            <div className="time-description">
              <div className="time">{weatherData.current_time}</div>
              <div className="description">{weatherData.main_weather} / {weatherData.description.charAt(0).toUpperCase() + weatherData.description.slice(1)}</div>
            </div>
          </div>
          <div className="additional-info">
            <div className='info-left'>
              <div className="precipitation"><WaterDropIcon/>Precipitation: {Math.round(weatherData.precipitation * 100)}%</div>
              <div className="humidity"><WaterIcon/>Humidity: {weatherData.humidity}%</div>
              <div className="wind"><AirIcon/>Wind speed: {weatherData.wind_speed}m/s</div>
            </div>
          </div>
        </div>
      ) : (
        <p>{selectedLocation ? 'Loading weather data...' : 'Please enter a city to search.'}</p>
      )}
    </div>
  );
}

export default Current;
