export interface GameStore {  
  game_state: 'idle' | 'playing' | 'acting' | 'finished';
  teams: Team[];
  current_team_index: number;
  timer: number;
  initial_timer: number;
  updateTeamName: (index: number, name: string) => void;
  addPlayer: (teamIndex: number, playerName: string) => void;
  removePlayer: (teamIndex: number, playerIndex: number) => void;
  updatePlayerName: (teamIndex: number, playerIndex: number, newName: string) => void
  setInitialTimer: (seconds: number) => void;
  decrementTimer: () => void;
  startGame: () => void;
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