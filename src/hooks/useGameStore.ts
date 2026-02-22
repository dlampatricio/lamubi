import {create} from "zustand"
import { GameStore } from "@/types/game";

const teams = [
    { name: 'Team A', score: 0, players: [], current_player_index: 0 },
    { name: 'Team B', score: 0, players: [], current_player_index: 0 }
]

export const useGameStore = create<GameStore>((set) => ({
  // Game State
  gameState: 'idle',
  // Turns Logic
  teams: teams,
  current_team: teams[0],
  
  updateTeamName: (index, newName) => set((state) => ({
    teams: state.teams.map((t, i) => i === index ? { ...t, name: newName } : t)
  })),

  addPlayer: (teamIndex, playerName) => set((state) => ({
    teams: state.teams.map((team, i) => 
      i === teamIndex 
        ? { ...team, players: [...team.players, { name: playerName }] } 
        : team
    )
  })),

  removePlayer: (teamIndex, playerIndex) => set((state) => ({
    teams: state.teams.map((team, i) => 
      i === teamIndex 
        ? { ...team, players: team.players.filter((_, pi) => pi !== playerIndex) } 
        : team
    )
  })),

  updatePlayerName: (teamIndex, playerIndex, newName) => set((state) => ({
  teams: state.teams.map((team, tIdx) => 
    tIdx === teamIndex 
      ? { 
          ...team, 
          players: team.players.map((player, pIdx) => 
            pIdx === playerIndex ? { ...player, name: newName } : player
          ) 
        } 
      : team
  )
})),

  startGame: () => set((state) => ({ 
    gameState: 'playing',
    teams: state.teams.map(t => ({ ...t, score: 0 })),
    current_team: { ...state.teams[0], score: 0 }
  })),

  nextTeam: () => set((state) => {
    const currentIndex = state.teams.findIndex(t => t.name === state.current_team.name);
    
    const updatedTeams = state.teams.map((team, idx) => {
      if (idx === currentIndex) {
        return {
          ...team,
          current_player_index: (team.current_player_index + 1) % team.players.length
        };
      }
      return team;
    });

    const nextTeamIndex = (currentIndex + 1) % updatedTeams.length;

    return { 
      teams: updatedTeams,
      current_team: updatedTeams[nextTeamIndex] 
    };
  }),


  correctGuess: () => set((state) => {
    const updatedTeams = state.teams.map((team) => 
      team.name === state.current_team.name 
        ? { ...team, score: team.score + 1 } 
        : team
    );

    const updatedCurrent = updatedTeams.find(t => t.name === state.current_team.name);

    return { 
      teams: updatedTeams,
      current_team: updatedCurrent || state.current_team 
    };
  }),


  endGame: () => set({ gameState: 'finished' }),

  reset: () => set((state) => {
  const resetTeams = state.teams.map((team) => ({
    ...team,
    score: 0,
    currentPlayerIndex: 0
  }));

  return {
    gameState: 'idle',
    teams: resetTeams,
    current_team: resetTeams[0]
  };
})
}));

export default useGameStore;