'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PlayerChart() {
  const [batsmanData, setBatsmanData] = useState([]);
  const [bowlerData, setBowlerData] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [role, setRole] = useState('batter');
  const [allPlayers, setAllPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetch('/batsman.csv')
      .then((res) => res.text())
      .then((data) => {
        const rows = data.trim().split('\n').slice(1).map((row) => {
          const [player_name, over, min_runs, max_runs, avg_runs] = row.split(',');
          return {
            player_name,
            over: +over,
            min_runs: +min_runs,
            max_runs: +max_runs,
            avg_runs: +avg_runs,
          };
        });
        setBatsmanData(rows);
        setAllPlayers((prev) => [...new Set([...prev, ...rows.map((r) => r.player_name)])]);
      });

    fetch('/bowlers.csv')
      .then((res) => res.text())
      .then((data) => {
        const rows = data.trim().split('\n').slice(1).map((row) => {
          const [player_name, over, total_wickets] = row.split(',');
          return {
            player_name,
            over: +over,
            total_wickets: +total_wickets,
          };
        });
        setBowlerData(rows);
        setAllPlayers((prev) => [...new Set([...prev, ...rows.map((r) => r.player_name)])]);
      });
  }, []);

  const filteredBatsman = batsmanData.filter((d) => d.player_name === playerName);
  const filteredBowler = bowlerData.filter((d) => d.player_name === playerName);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPlayers = allPlayers.filter((player) =>
    player.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlayerSelect = (player) => {
    setPlayerName(player);
    setIsDropdownOpen(false);
  };

  const handleInputBlur = (e) => {
    if (e.relatedTarget && e.relatedTarget.closest('.dropdown-list')) {
      return;
    }
    setIsDropdownOpen(false);
  };

  return (
    <section className="p-6 w-full bg-dark-900 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Player Stats</h2>
      <div className="flex gap-6 mb-6 justify-center flex-wrap">
        <div className="w-full sm:w-1/3 relative">
          <label className="block mb-2 text-sm font-medium">Select Player:</label>
          <input
            type="text"
            className="w-full p-3 rounded-lg border-2 border-gray-700 bg-dark-800 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition duration-300"
            value={playerName}
            onChange={handleSearchChange}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={handleInputBlur}
            placeholder="Search for a player"
          />
          {isDropdownOpen && (
            <div className="dropdown-list absolute z-10 w-full bg-dark-800 rounded-lg mt-1 max-h-48 overflow-auto border border-gray-700">
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((player) => (
                  <div
                    key={player}
                    className="px-4 py-2 text-white hover:bg-blue-600 cursor-pointer"
                    onClick={() => handlePlayerSelect(player)}
                  >
                    {player}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No players found</div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-end gap-6">
          <div className="flex items-center gap-4 text-sm">
            <label
              className={`cursor-pointer text-gray-400 font-medium flex items-center gap-2 transition duration-200 ${
                role === 'batter' ? 'text-blue-500' : ''
              }`}
            >
              <input
                type="radio"
                value="batter"
                checked={role === 'batter'}
                onChange={() => setRole('batter')}
                className="appearance-none h-5 w-5 border-2 border-gray-500 rounded-full bg-dark-800 checked:bg-blue-600 checked:border-blue-600 transition duration-200"
              />
              <span>Batter</span>
            </label>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <label
              className={`cursor-pointer text-gray-400 font-medium flex items-center gap-2 transition duration-200 ${
                role === 'bowler' ? 'text-red-500' : ''
              }`}
            >
              <input
                type="radio"
                value="bowler"
                checked={role === 'bowler'}
                onChange={() => setRole('bowler')}
                className="appearance-none h-5 w-5 border-2 border-gray-500 rounded-full bg-dark-800 checked:bg-red-600 checked:border-red-600 transition duration-200"
              />
              <span>Bowler</span>
            </label>
          </div>
        </div>
      </div>

      {role === 'batter' && filteredBatsman.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={filteredBatsman}>
            <XAxis dataKey="over" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="min_runs" stroke="#5e72e4" strokeWidth={3} name="Min Runs" />
            <Line type="monotone" dataKey="max_runs" stroke="#2dce89" strokeWidth={3} name="Max Runs" />
            <Line type="monotone" dataKey="avg_runs" stroke="#f4b400" strokeWidth={3} name="Avg Runs" />
          </LineChart>
        </ResponsiveContainer>
      ) : role === 'bowler' && filteredBowler.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={filteredBowler}>
            <XAxis dataKey="over" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total_wickets" stroke="#e60000" strokeWidth={3} name="Total Wickets" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="mt-6 w-full flex justify-center">
          <div className="bg-red-600 text-white p-6 rounded-lg shadow-lg text-center w-80">
            <h3 className="text-xl font-semibold">Oops!</h3>
            <p className="text-md mt-2">
              The selected player is not a <span className="font-bold">{role}</span>.
            </p>
            <p className="mt-4 text-sm">
              Please select a valid player for the selected role to view their stats.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
