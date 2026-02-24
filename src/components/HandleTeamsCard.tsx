"use client"
import { useGameStore } from "../hooks/useGameStore";

const HandleTeamsCard = () => {
  const { teams, updateTeamName, addPlayer, removePlayer, updatePlayerName } = useGameStore();

  return (
    <>
      {teams.map((team, teamIdx) => (
        <div key={teamIdx} className="space-y-6">
          <input 
            className="bg-transparent border-b-2 border-black text-xl font-black uppercase tracking-tighter focus:outline-none w-full pb-1"
            value={team.name} 
            onChange={(e) => updateTeamName(teamIdx, e.target.value)} 
            placeholder="TEAM NAME"
          />

          <div className="space-y-3">
            {team.players.map((p, pIdx) => (
              <div key={pIdx} className="flex items-center gap-2 group">
                <input 
                  className="flex-1 bg-gray-50 p-2.5 rounded-xl text-sm font-bold text-gray-700 outline-none focus:bg-gray-100 transition-all"
                  value={p.name} 
                  onChange={(e) => updatePlayerName(teamIdx, pIdx, e.target.value)} 
                  placeholder="Player"
                />
                <button 
                  className="text-gray-300 hover:text-black transition-colors px-1 text-xs" 
                  onClick={() => removePlayer(teamIdx, pIdx)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button 
            className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors pl-1"
            onClick={() => addPlayer(teamIdx, "")}
          >
            + Add Player
          </button>
        </div>
      ))}
    </>
  );
};

export default HandleTeamsCard;