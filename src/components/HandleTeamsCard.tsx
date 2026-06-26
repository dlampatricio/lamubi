'use client';
import { useGameStore } from '../hooks/useGameStore';

const HandleTeamsCard = () => {
  const { teams, updateTeamName, addPlayer, removePlayer, updatePlayerName } = useGameStore();

  return (
    <div className="flex flex-col gap-16 w-full max-w-lg mx-auto md:mx-0">
      {teams.map((team, teamIdx) => (
        <div key={teamIdx} className="group relative">
          <div className="flex items-center gap-3 mb-6">
            <input
              className="bg-transparent border-b-2 border-gray-100 focus:border-black text-3xl font-black uppercase tracking-tighter focus:outline-none w-full pb-2 transition-all placeholder:text-gray-100"
              value={team.name}
              onChange={(e) => updateTeamName(teamIdx, e.target.value)}
              placeholder="TEAM NAME"
            />
          </div>

          <div className="space-y-3">
            {team.players.map((p, pIdx) => (
              <div key={pIdx} className="flex items-center gap-3 group/item">
                <input
                  className="flex-1 bg-gray-50/50 hover:bg-gray-50 border border-transparent focus:border-gray-100 rounded-2xl text-[15px] font-black uppercase tracking-wider text-black outline-none transition-all"
                  value={p.name}
                  onChange={(e) => updatePlayerName(teamIdx, pIdx, e.target.value)}
                  placeholder="ADD PLAYER NAME..."
                />
                <button
                  className="opacity-0 group-hover/item:opacity-100 text-gray-300 hover:text-red-500 transition-all px-2 text-[10px]"
                  onClick={() => removePlayer(teamIdx, pIdx)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            className="mt-3 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors flex items-center gap-2 group/btn"
            onClick={() => addPlayer(teamIdx, '')}
          >
            <span className="text-xl leading-none group-hover/btn:scale-125 transition-transform">
              +
            </span>
            <p className="text-[10px] mt-1.5">Add Player</p>
          </button>

          {teamIdx < teams.length - 1 && <div className="mt-16 border-b border-gray-50 w-full" />}
        </div>
      ))}
    </div>
  );
};

export default HandleTeamsCard;
