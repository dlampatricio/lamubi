export interface GameStore {  
  game_state: 'idle' | 'playing' | 'acting' | 'finished';
  teams: Team[];
  current_team_index: number;
  timer: number;
  initial_timer: number;
  movies: Movie[];
  current_movie: Movie | null;
  category: CategoryConfig;
  updateTeamName: (index: number, name: string) => void;
  addPlayer: (teamIndex: number, playerName: string) => void;
  removePlayer: (teamIndex: number, playerIndex: number) => void;
  updatePlayerName: (teamIndex: number, playerIndex: number, newName: string) => void
  setInitialTimer: (seconds: number) => void;
  decrementTimer: () => void;
  setMovies: (movies: Movie[]) => void;
  getNextMovie: () => void;
  skipMovie: () => void;
  setCategory: (config: CategoryConfig) => void;
  startGame: (movies: Movie[]) => void;
  startActing: () => void;
  endRound: () => void;
  endGame: () => void;
  resetScores: () => void;
  nextTeam: () => void;
  correctGuess: () => void;
}

export interface Team {
    name: string;
    score: number;
    players: Player[];
    current_player_index: number;
}

export interface Player {
    name: string;
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  year: string;
  rating: string;
  overview?: string;
  genres?: string[];
  director?: string;
  country?: string;
}

export interface CategoryConfig {
  id: string | null;
  type: 'company' | 'keyword' | 'top_rated' | 'custom';
  name: string;
  theme: string;
}