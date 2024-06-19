import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Pagination from './Pagination';
import Preloader from './PreLoader';
import { REACT_APP_FOOTBALL_API_KEY } from '../settings';
import getDateString from './utils';

const LeagueDetailPage = () => {
  const { leagueId } = useParams();
  const [matches, setMatches] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, [currentPage, filterDate, leagueId]);

  const fetchMatches = async () => {
    setLoading(true);
        try {
      const response = await axios.get(`http://localhost:8080/v4/competitions/${leagueId}/matches`, {
        headers: { 'X-Auth-Token': REACT_APP_FOOTBALL_API_KEY},
        params: {
          dateFrom: filterDate || undefined,
          dateTo: filterDate || undefined
        }
      });
      console.log("API response data:", response.data);

      const fetchedMatches = response.data.matches.map(match => ({
        date: match.utcDate ? match.utcDate.split('T')[0] : null,
        time: matches.utcDate ? match.utcDate.split('T')[1].split('Z')[0]: null,
        status: matches.status,
        homeTeam: matches.homeTeam.name,
        awayTeam: matches.awayTeam.name,
        score: {
          fullTime: `${matches.score.fullTime.homeTeam} - ${matches.score.fullTime.awayTeam}`,
          extraTime: `${matches.score.extraTime.homeTeam} - ${matches.score.extraTime.awayTeam}`,
          penalties: `${matches.score.penalties.homeTeam} - ${matches.score.penalties.awayTeam}`,
        }
      }));
      setMatches(fetchedMatches);
      setTotalPages(Math.ceil(fetchedMatches.length / 10));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching matches', err);
      setError(err.message ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  const matchesToDisplay = matches.slice((currentPage - 1) * 10, currentPage * 10);

  if (loading) {
    return <Pagination> </Pagination>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Link to="/">Back to Home</Link>
      <h2>League Matches</h2>
      <input
        type="date"
        value={filterDate}
        onChange={e => setFilterDate(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Teams</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {matchesToDisplay.map((match, index) => (
            <tr key={index}>
              <td>{match.date}</td>
              <td>{match.time}</td>
              <td>{match.status}</td>
              <td>{`${match.homeTeam} vs ${match.awayTeam}`}</td>
              <td>{`${match.score.fullTime}, ${match.score.extraTime}, ${match.score.penalties}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default LeagueDetailPage;
