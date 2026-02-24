"use client"
import { useGameStore } from "../hooks/useGameStore";

const HandleTeamsCard = () => {
  const { teams, updateTeamName, addPlayer, removePlayer, updatePlayerName } = useGameStore();

  return (
    <div className="space-y-4">
      {teams.map((team, teamIdx) => (
        <div key={teamIdx} className="border p-4">
          <input 
            className="border p-2 w-full mb-2"
            value={team.name} 
            onChange={(e) => updateTeamName(teamIdx, e.target.value)} 
          />

          <ul className="mb-2">
            {team.players.map((p, pIdx) => (
              <li key={pIdx} className="flex gap-2 mb-1">
                <input 
                  className="border p-2 flex-1"
                  value={p.name} 
                  onChange={(e) => updatePlayerName(teamIdx, pIdx, e.target.value)} 
                  placeholder="Player Name"
                />
                <button 
                  className="bg-red-500 text-white px-2 py-1" 
                  onClick={() => removePlayer(teamIdx, pIdx)}
                >
                  X
                </button>
              </li>
            ))}
          </ul>

          <button 
            className="text-blue-600 text-sm"
            onClick={() => addPlayer(teamIdx, "")}
          >
            + Add Player
          </button>
        </div>
      ))}
    </div>
  );
};

export default HandleTeamsCard;