import React, { useState } from 'react';
import '../assets/scss/Home.scss';
import Current from './Current';
import Historical from './Historical';

// Import MUI components
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

function Home() {

  const [searchInput, setSearchInput] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();

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
      <div className='search-form'>
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
      <React.StrictMode>
          <Current parentToChild={{ lat, lon, selectedLocation }}/>
          <Historical/>
      </React.StrictMode>
    </div>
  );
}

export default Home;
