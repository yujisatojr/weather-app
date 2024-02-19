import React, { useState, useEffect } from 'react';
import '../assets/scss/Current.scss';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'left',
}));

function Current() {
  const [weatherData, setWeatherData] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(`/current_weather?lat=${lat}&lon=${lon}`);
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
  }, [lat, lon]);

  const handleSearchSubmit = async () => {
    try {
      const response = await fetch(`/coordinates?city_name=${searchInput}`);
      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      } else {
        console.error('Error fetching location data');
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  const handleLocationClick = (clickedLat, clickedLon, clickedLocation) => {
    setLat(clickedLat);
    setLon(clickedLon);
    setSelectedLocation({ lat: clickedLat, lon: clickedLon, name: clickedLocation });
    setLocations([]);
  };

  console.log(selectedLocation)

  return (
    <div className='current_weather_root'>
      <div className='current_weather_form' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchSubmit();
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search City"
            inputProps={{ 'aria-label': 'search city' }}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>

        {locations.length > 0 && (
          <List className='current_weather_form_result'>
            {locations.map((location) => (
              <ListItem disablePadding key={location.lat + location.lon} onClick={() => handleLocationClick(location.lat, location.lon, location.location)}>
                <ListItemButton>
                  <ListItemText>{location.location}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </div>

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
    </div>
  );
}

export default Current;
