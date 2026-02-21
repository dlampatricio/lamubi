export interface Player {
  id: string;
  name: string;
  score: number;
  hasPlayedCurrentRound: boolean;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  score: number;
  color: 'red' | 'blue';
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  poster_path: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameState {
  // Teams
  teams: Team[];
  currentTeamIndex: number;
  currentPlayerIndex: number; // Index within current team's players
  
  // Game configuration
  gameSettings: {
    roundTime: number; // in seconds
    pointsPerCorrectGuess: number;
    maxRounds: number;
  };
  
  // Current game state
  isGameActive: boolean;
  currentRound: number;
  timeRemaining: number;
  currentMovie: Movie | null;
  isTimerRunning: boolean;
  
  // Categories
  selectedCategory: string;
  availableCategories: string[];
  
  // Game phases
  gamePhase: 'setup' | 'playing' | 'intermission' | 'round-end' | 'game-over';
}

export type GameActions = {
  // Team management
  addTeam: (name: string, color: 'red' | 'blue') => void;
  removeTeam: (teamId: string) => void;
  addPlayerToTeam: (teamId: string, playerName: string) => void;
  removePlayerFromTeam: (teamId: string, playerId: string) => void;
  updateTeamScore: (teamId: string, points: number) => void;
  
  // Legacy player management (for compatibility)
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  updatePlayerScore: (playerId: string, points: number) => void;
  resetPlayersScores: () => void;
  
  // Game control
  startGame: () => void;
  endGame: () => void;
  nextPlayer: () => void;
  nextRound: () => void;
  startNextTurn: () => void;
  
  // Game settings management
  updateRoundTime: (time: number) => void;
  
  // Timer control
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  decrementTime: () => void;
  
  // Movie management
  setCurrentMovie: (movie: Movie) => void;
  markGuessAsCorrect: () => void;
  skipMovie: () => void;
  
  // Category management
  selectCategory: (category: string) => void;
  
  // Game phase management
  setGamePhase: (phase: GameState['gamePhase']) => void;
  
  // Reset
  resetGame: () => void;
};
