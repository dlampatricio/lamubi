import { create } from "zustand";
import { GameStore, Team, Movie } from "@/types/game";

const initialTeams: Team[] = [
  { name: 'Mad Max', score: 0, players: [], current_player_index: 0 },
  { name: 'La La Land', score: 0, players: [], current_player_index: 0 }
];

export const useGameStore = create<GameStore>((set, get) => ({
  // --- STATE ---
  game_state: 'idle',
  teams: initialTeams,
  current_team_index: 0,
  timer: 60,
  initial_timer: 60,

  movies: [] as Movie[],
  current_movie: null as Movie | null,

  // --- ACTIONS ---
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
            players: team.players.map((p, pIdx) => pIdx === playerIndex ? { name: newName } : p) 
          } 
        : team
    )
  })),

  setInitialTimer: (seconds) => set({ 
    initial_timer: seconds, 
    timer: seconds 
  }),

  decrementTimer: () => set((state) => ({ 
    timer: Math.max(0, state.timer - 1) 
  })),

  getNextMovie: () => set((state) => {
    const [next, ...rest] = state.movies;
    return {
      current_movie: next || null,
      movies: rest
    };
  }),

  skipMovie: () => get().getNextMovie(),

  startGame: (initial_movies: Movie[]) => {
    const [first, ...rest] = initial_movies;

    set((state) => ({ 
      game_state: 'playing',
      teams: state.teams.map(t => ({ ...t, score: 0, current_player_index: 0 })),
      current_team_index: 0,
      timer: state.initial_timer,
      movies: rest,
      current_movie: first
    }));
  },

  startActing: () => {
    set({ game_state: 'acting' });
  },

  endRound: () => set({ game_state: 'finished' }),

  // Reset suave (para jugar otra partida con los mismos equipos/jugadores)
  resetScores: () => set((state) => ({
    game_state: 'idle',
    teams: state.teams.map(t => ({ ...t, score: 0, current_player_index: 0 })),
    current_team_index: 0
  })),

  nextTeam: () => set((state) => {
    const nextIndex = (state.current_team_index + 1) % state.teams.length;
    
    // Avanzamos el puntero del jugador del equipo que acaba de terminar
    const updatedTeams = state.teams.map((team, idx) => {
      if (idx === state.current_team_index) {
        // Solo avanzamos si hay jugadores, para evitar división por cero o errores
        const nextPlayerIdx = team.players.length > 0 
          ? (team.current_player_index + 1) % team.players.length 
          : 0;
        return { ...team, current_player_index: nextPlayerIdx };
      }
      return team;
    });

    const [next, ...rest] = state.movies;

    return { 
      game_state: 'playing',
      teams: updatedTeams,
      current_team_index: nextIndex,
      timer: state.initial_timer,
      current_movie: next || null,
      movies: rest
    };
  }),

  correctGuess: () => set((state) => {
    return {
      teams: state.teams.map((team, idx) => 
        idx === state.current_team_index 
          ? { ...team, score: team.score + 1 } 
          : team 
      )
    };
  }),
}));