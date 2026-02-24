import { create } from "zustand";
import { GameStore, Team, Movie } from "@/types/game";

// Estado inicial fuera para poder resetear fácilmente
const initialTeams: Team[] = [
  { name: 'Team A', score: 0, players: [], current_player_index: 0 },
  { name: 'Team B', score: 0, players: [], current_player_index: 0 }
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

  setMovies: (movies: Movie[]) => set({ movies }),

  getNextMovie: () => set((state) => {
    const [next, ...rest] = state.movies;
    return {
      current_movie: next || null,
      movies: rest
    };
  }),

  skipMovie: () => set((state) => {
    const [next, ...rest] = state.movies;
    return {
      current_movie: next || null,
      movies: rest
    };
  }),

  startGame: (initial_movies: Movie[]) => set((state) => ({ 
    game_state: 'playing',
    teams: state.teams.map(t => ({ ...t, score: 0, current_player_index: 0 })),
    current_team_index: 0,
    timer: state.initial_timer,
    movies: initial_movies,
    current_movie: null
  })),

  startActing: () => {
    get().getNextMovie(); 
    set({ game_state: 'acting' });
  },

  endRound: () => set({ game_state: 'finished' }),

  // Reset total (volver a la configuración inicial)
  endGame: () => set({
    game_state: 'idle',
    teams: initialTeams.map(t => ({ ...t })), // Copia nueva
    current_team_index: 0,
    timer: 60
  }),

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

    return { 
      game_state: 'playing',
      teams: updatedTeams,
      current_team_index: nextIndex,
      timer: state.initial_timer,
      current_movie: null
    };
  }),

  correctGuess: () => {
    get().getNextMovie();
    set((state) => ({
      teams: state.teams.map((team, idx) => 
        idx === state.current_team_index 
          ? { ...team, score: team.score + 1 } 
          : team 
      )
    }));
  },
}));