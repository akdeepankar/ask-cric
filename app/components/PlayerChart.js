'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

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
  const filteredPlayers = allPlayers.filter((player) =>
    player.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handlePlayerSelect = (player) => {
    setPlayerName(player);
    setIsDropdownOpen(false);
  };

  return (
    <section className="p-6 w-full bg-[#0f0f1b] text-[#00ffe7] font-mono rounded-2xl shadow-[0_0_20px_#00ffe7]">
      <h2 className="text-2xl font-bold mb-6 text-center drop-shadow-[0_0_8px_#00ffe7]">
        ⚔️ Player Battle Stats ⚔️
      </h2>

      {/* Top Controls: Dropdown + Role Selection */}
      <div className="flex flex-col md:flex-row md:items-end gap-6 mb-6">
        {/* Player Dropdown */}
        <div className="w-full md:w-1/3 relative">
          <label className="block mb-2 text-sm font-semibold tracking-wide">🥎 Choose Your Champion:</label>
          <button
            type="button"
            className="w-full p-2 rounded-lg border border-[#00ffe7] bg-[#1a1a2e] text-left focus:ring-4 ring-[#00ffe7]/50 transition-all duration-300"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            {playerName || 'Select a Player'}
          </button>

          {isDropdownOpen && (
            <div className="dropdown-list absolute z-20 w-full bg-[#1a1a2e] rounded-lg mt-1 max-h-60 overflow-auto border border-[#00ffe7] shadow-[0_0_15px_#00ffe7]">
              <div className="p-2">
                <input
                  type="text"
                  className="w-full p-2 rounded-md bg-[#0f0f1b] text-[#00ffe7] border border-[#00ffe7]/30 focus:outline-none"
                  placeholder="Search player..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((player) => (
                  <div
                    key={player}
                    className="px-4 py-2 hover:bg-[#00ffe7]/20 cursor-pointer transition-all duration-200"
                    onMouseDown={() => handlePlayerSelect(player)} // ✅ MouseDown instead of Click
                  >
                    {player}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-400">No players found</div>
              )}
            </div>
          )}
        </div>

        {/* Role Selection Radio Buttons */}
        <div className="flex gap-6 text-[#00ffe7]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="batter"
              checked={role === 'batter'}
              onChange={() => setRole('batter')}
              className="accent-[#00ffe7] w-4 h-4"
            />
            <span className="font-semibold hover:text-white transition-all duration-200">Batter</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="bowler"
              checked={role === 'bowler'}
              onChange={() => setRole('bowler')}
              className="accent-[#ff4444] w-4 h-4"
            />
            <span className="font-semibold hover:text-white transition-all duration-200">Bowler</span>
          </label>
        </div>
      </div>

      {/* Chart or Message */}
      <div className="border border-[#00ffe7]/20 rounded-xl p-4 shadow-inner bg-[#12121e]">
        {role === 'batter' && filteredBatsman.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
  <LineChart data={filteredBatsman}>
    <XAxis dataKey="over" stroke="#00ffe7" />
    <YAxis stroke="#00ffe7" />
    
    {/* Customized Tooltip */}
    <Tooltip
      contentStyle={{
        backgroundColor: '#1a1a2e', // Dark background for the tooltip
        border: '1px solid #00ffe7', // Light border for visibility
        opacity: 0.9, // Slight transparency to make it readable but not too harsh
        color: '#fff', // White text for readability
        fontWeight: 'bold', // Make text bold for clarity
      }}
    />
    
    <Legend />
    <Line type="monotone" dataKey="min_runs" stroke="#00fff7" strokeWidth={2} />
    <Line type="monotone" dataKey="max_runs" stroke="#ff00ff" strokeWidth={2} />
    <Line type="monotone" dataKey="avg_runs" stroke="#ffff00" strokeWidth={2} />
  </LineChart>
</ResponsiveContainer>

        ) : role === 'bowler' && filteredBowler.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={filteredBowler}>
              <XAxis dataKey="over" stroke="#00ffe7" />
              <YAxis stroke="#00ffe7" />
                  {/* Customized Tooltip */}
                    <Tooltip
                    contentStyle={{
                        backgroundColor: '#1a1a2e', // Dark background for the tooltip
                        border: '1px solid #00ffe7', // Light border for visibility
                        opacity: 0.9, // Slight transparency to make it readable but not too harsh
                        color: '#fff', // White text for readability
                        fontWeight: 'bold', // Make text bold for clarity
                    }}
                    />
              <Legend />
              <Line type="monotone" dataKey="total_wickets" stroke="#ff4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="mt-8 text-center text-[#ff4c4c]">
            <h3 className="text-xl font-semibold">🚫 No Stats Available</h3>
            <p className="mt-2">The selected player is not a <span className="capitalize">{role}</span>.</p>
            <p className="text-sm mt-2 text-gray-500">Try selecting a different role or player.</p>
          </div>
        )}
      </div>
    </section>
  );
}
