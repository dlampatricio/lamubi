export interface GameStore {
  teams: Team[];
  current_team: Team;
  gameState: 'idle' | 'playing' | 'finished';
  startGame: () => void;
  nextTeam: () => void;
  correctGuess: () => void;
  endGame: () => void;
  reset: () => void;
  updateTeamName: (index: number, name: string) => void;
  addPlayer: (teamIndex: number, playerName: string) => void;
  removePlayer: (teamIndex: number, playerIndex: number) => void;
  updatePlayerName: (teamIndex: number, playerIndex: number, newName: string) => void;
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