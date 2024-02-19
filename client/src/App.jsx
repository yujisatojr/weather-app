import React from 'react'
import './assets/scss/App.scss';
import Current from './components/Current';
import Historical from './components/Historical';

function App() {
  return (
    <div className="App">
      <React.StrictMode>
          <Current/>
          <Historical/>
      </React.StrictMode>
    </div>
  );
}

export default App;
