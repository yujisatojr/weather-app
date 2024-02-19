import React, { useState, useEffect } from 'react';
import '../assets/scss/Current.scss';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'left',
}));

function Current({ parentToChild }) {

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
          } else {
            console.error('Error fetching weather data');
          }
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [lat, lon]);

  return (
      <Item>
        {weatherData ? (
          <div className="weather-container">
            <div className="location">{selectedLocation ? selectedLocation.name : 'Enter a city to search.'}</div>
            <div className="weather-info">
              <div className="temperature">
                <img src={`https://openweathermap.org/img/wn/${weatherData.icon_id}@2x.png`} alt="Weather Icon" />
                {weatherData.temp_c}°C
              </div>
              <div className="time-description">
                <div className="time">{weatherData.current_time}</div>
                <div className="description">{weatherData.main_weather}</div>
                <div className="description">{weatherData.description}</div>
              </div>
            </div>
            <div className="additional-info">
              <div className="precipitation">Precipitation: </div>
              <div className="wind">Humidity: {weatherData.humidity}</div>
              <div className="wind">Latitude: {weatherData.latitude}</div>
              <div className="wind">Longitude: {weatherData.longitude}</div>
            </div>
          </div>
        ) : (
          <p>{selectedLocation ? 'Loading weather data...' : 'Enter a city to search.'}</p>
        )}
      </Item>
  );
}

export default Current;
