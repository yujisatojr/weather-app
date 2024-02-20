import React, { useState } from 'react';
import '../assets/scss/Home.scss';
import { styled } from '@mui/material/styles';

// Import child components
import Current from './Current';
import Historical from './Historical';

// Import MUI framework for styling
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

function Home() {

  const [searchInput, setSearchInput] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [lat, setLat] = useState(32.7763);
  const [lon, setLon] = useState(-96.7969);

  const [weatherData, setWeatherData] = useState(null);

  const handleWeatherDataChange = (data) => {
    setWeatherData(data);
  };

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

  return (
    <div className='weather-app-root'>
      <h1>Weather Dashboard 🌤️</h1>
      <div className='search-form-wrapper'>
        <div style={{ width: '100%', position: 'relative' }}>
          <Paper
          className='search-form'
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
            <List className='search-form-result'>
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
      </div>
      <Item>
        <React.StrictMode>
            <Current parentToChild={{ lat, lon, selectedLocation }} onWeatherDataChange={handleWeatherDataChange}/>
            <Historical parentToChild={{ lat, lon, selectedLocation, weatherData }}/>
        </React.StrictMode>
      </Item>
    </div>
  );
}

export default Home;
