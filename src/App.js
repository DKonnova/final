import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LeagueDetailPage from './components/LeagueDetail';
import LeaguesList from './components/LeaguesList';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LeaguesList />} />
          <Route path="/league/:leagueId" element={<LeagueDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

