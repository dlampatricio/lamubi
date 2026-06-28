export type GameMode = 'charades' | 'impostor';
export type ImpostorState = 'revealing' | 'word_wait' | 'debate' | 'voting' | 'result';

export interface GameStore {
  game_state: 'idle' | 'loading' | 'playing' | 'acting' | 'finished';
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  teams: Team[];
  players: Player[];
  addIndividualPlayer: (name: string) => void;
  removeIndividualPlayer: (index: number) => void;
  updateIndividualPlayerName: (index: number, name: string) => void;
  impostorState: ImpostorState;
  revealIndex: number;
  impostorIndex: number | null;
  eliminatedIndices: number[];
  startImpostorGame: (movies: Movie[]) => void;
  nextReveal: () => void;
  startDebate: () => void;
  stopDebate: () => void;
  eliminatePlayer: (index: number) => void;
  skipElimination: () => void;
  current_team_index: number;
  timer: number;
  initial_timer: number;
  debate_timer: number;
  setDebateTimer: (seconds: number) => void;
  movies: Movie[];
  current_movie: Movie | null;
  updateTeamName: (index: number, name: string) => void;
  addPlayer: (teamIndex: number, playerName: string) => void;
  removePlayer: (teamIndex: number, playerIndex: number) => void;
  updatePlayerName: (teamIndex: number, playerIndex: number, newName: string) => void;
  setInitialTimer: (seconds: number) => void;
  decrementTimer: () => void;
  prepareGame: () => void;
  skipMovie: () => void;
  startGame: (movies: Movie[]) => void;
  startActing: () => void;
  endRound: () => void;
  resetScores: () => void;
  resetGame: () => void;
  nextTeam: () => void;
  correctGuess: () => void;
  refillMovies: () => Promise<void>;
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
}
