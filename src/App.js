import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LeagueDetailPage from './components/LeagueDetail';
import LeaguesList from './components/LeaguesList';
import TeamsList from './components/TeamsList';
import TeamDetailPage from './components/TeamDetail';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LeaguesList />} />
          <Route path="/league/:leagueId" element={<LeagueDetailPage />} />
          <Route path="/teams" element={<TeamsList /> } />
          <Route path="/team/:teamId" element={<TeamDetailPage /> } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

