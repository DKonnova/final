import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Preloader from './PreLoader';
import SearchBar from './SearchBar';
import Pagination from './Pagination'
import { REACT_APP_FOOTBALL_API_KEY } from '../settings';
import './LeaguesList.css'

const LeaguesList = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLeagues = async () => {
     setLoading(true);
     try {
        const response = await axios.get('http://localhost:8080/v4/competitions', {
          headers: { 'X-Auth-Token': REACT_APP_FOOTBALL_API_KEY}
        });
        setLeagues(response.data.competitions); // забираем данные из ответа
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };
    fetchLeagues();
  }, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value.toLowerCase());
  };
  
  const filteredLeagues = search ? leagues.filter(league => league.name.toLowerCase().includes(search)) : leagues;

  return (
    <div>
      {loading ? <Preloader /> : (
        <>
          <SearchBar onChange={handleSearchChange} />
          <div className='ligues-list'>
          {filteredLeagues.map(league => (
              <Link className='league-card' key={league.id} to={`/league/${league.id}`}>
              <div>
                <img src={league.emblem} alt={`${league.name} logo`} />
                <h3>{league.name}</h3>
              </div>
              </Link>
            ))}
          </div>
          <Pagination></Pagination>
        </>
      )}
    </div>
  );
};

export default LeaguesList;