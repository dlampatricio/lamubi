import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { GameState, GameActions, Player, Movie, Team } from '@/types/game';
import { getRandomMovie } from '@/data/mockMovies';

const initialState: GameState = {
  teams: [
    { id: 'team-red', name: 'Equipo Rojo', players: [], score: 0, color: 'red' },
    { id: 'team-blue', name: 'Equipo Azul', players: [], score: 0, color: 'blue' }
  ],
  currentTeamIndex: 0,
  currentPlayerIndex: 0,
  gameSettings: {
    roundTime: 60, // 60 seconds per round
    pointsPerCorrectGuess: 10,
    maxRounds: 3
  },
  isGameActive: false,
  currentRound: 1,
  timeRemaining: 60, // Will be synced with roundTime when game starts
  currentMovie: null,
  isTimerRunning: false,
  selectedCategory: 'Todas',
  availableCategories: ['Todas', 'Acción', 'Comedia', 'Drama', 'Ciencia Ficción', 'Thriller', 'Romance', 'Terror', 'Animación'],
  gamePhase: 'setup'
};

export const useGameStore = create<GameState & GameActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Team management
        addTeam: (name: string, color: 'red' | 'blue') => {
          // Teams are pre-created, just update names
          set((state) => ({
            teams: state.teams.map(team => 
              team.color === color ? { ...team, name } : team
            )
          }));
        },

        addPlayerToTeam: (teamId: string, playerName: string) => {
          const newPlayer: Player = {
            id: Date.now().toString(),
            name: playerName.trim(),
            score: 0,
            hasPlayedCurrentRound: false
          };
          
          set((state) => ({
            teams: state.teams.map(team =>
              team.id === teamId
                ? { ...team, players: [...team.players, newPlayer] }
                : team
            )
          }));
        },

        removePlayerFromTeam: (teamId: string, playerId: string) => {
          set((state) => ({
            teams: state.teams.map(team =>
              team.id === teamId
                ? { ...team, players: team.players.filter(player => player.id !== playerId) }
                : team
            )
          }));
        },

        removeTeam: (teamId: string) => {
          // Teams are pre-created, just clear players
          set((state) => ({
            teams: state.teams.map(team =>
              team.id === teamId
                ? { ...team, players: [], score: 0 }
                : team
            )
          }));
        },

        // Legacy player management (for compatibility)
        addPlayer: (name: string) => {
          const state = get();
          // Add to the team with fewer players
          const teamWithFewerPlayers = state.teams.reduce((prev, current) => 
            prev.players.length < current.players.length ? prev : current
          );
          get().addPlayerToTeam(teamWithFewerPlayers.id, name);
        },

        removePlayer: (id: string) => {
          set((state) => ({
            teams: state.teams.map(team => ({
              ...team,
              players: team.players.filter(player => player.id !== id)
            }))
          }));
        },

        updatePlayerScore: (playerId: string, points: number) => {
          set((state) => ({
            teams: state.teams.map(team => ({
              ...team,
              players: team.players.map(player =>
                player.id === playerId
                  ? { ...player, score: player.score + points }
                  : player
              )
            }))
          }));
        },

        resetPlayersScores: () => {
          set((state) => ({
            teams: state.teams.map(team => ({
              ...team,
              score: 0,
              players: team.players.map(player => ({
                ...player,
                score: 0,
                hasPlayedCurrentRound: false
              }))
            }))
          }));
        },

        // Game control
        startGame: () => {
          const state = get();
          const totalPlayers = state.teams.reduce((sum, team) => sum + team.players.length, 0);
          if (totalPlayers === 0) return;
          
          set({
            isGameActive: true,
            gamePhase: 'playing',
            currentRound: 1,
            currentTeamIndex: 0,
            currentPlayerIndex: 0,
            timeRemaining: state.gameSettings.roundTime // Use configured roundTime
          });
          
          // Set first movie
          get().setCurrentMovie(getRandomMovie());
        },

        endGame: () => {
          set({
            isGameActive: false,
            gamePhase: 'game-over',
            isTimerRunning: false,
            currentMovie: null
          });
        },

        nextPlayer: () => {
          const state = get();
          const currentTeam = state.teams[state.currentTeamIndex];
          
          // Move to next player in current team
          if (currentTeam && state.currentPlayerIndex < currentTeam.players.length - 1) {
            set({
              currentPlayerIndex: state.currentPlayerIndex + 1,
              timeRemaining: state.gameSettings.roundTime,
              currentMovie: getRandomMovie(),
              isTimerRunning: false
            });
          } else {
            // Move to next team
            const nextTeamIndex = (state.currentTeamIndex + 1) % state.teams.length;
            
            // Check if we've completed a round
            if (nextTeamIndex === 0) {
              if (state.currentRound >= state.gameSettings.maxRounds) {
                get().endGame();
              } else {
                set({
                  gamePhase: 'round-end',
                  currentTeamIndex: nextTeamIndex,
                  currentPlayerIndex: 0
                });
              }
            } else {
              set({
                currentTeamIndex: nextTeamIndex,
                currentPlayerIndex: 0,
                timeRemaining: state.gameSettings.roundTime,
                currentMovie: getRandomMovie(),
                isTimerRunning: false
              });
            }
          }
        },

        startNextTurn: () => {
          const state = get();
          set({
            gamePhase: 'playing',
            timeRemaining: state.gameSettings.roundTime,
            currentMovie: getRandomMovie(),
            isTimerRunning: false
          });
        },

        updateTeamScore: (teamId: string, points: number) => {
          set((state) => ({
            teams: state.teams.map(team =>
              team.id === teamId
                ? { ...team, score: team.score + points }
                : team
            )
          }));
        },

        nextRound: () => {
          const state = get();
          set({
            currentRound: state.currentRound + 1,
            currentTeamIndex: 0,
            currentPlayerIndex: 0,
            gamePhase: 'playing',
            timeRemaining: state.gameSettings.roundTime,
            teams: state.teams.map(team => ({
              ...team,
              players: team.players.map(player => ({
                ...player,
                hasPlayedCurrentRound: false
              }))
            }))
          });
          
          get().setCurrentMovie(getRandomMovie());
        },

        // Timer control
        startTimer: () => {
          set({ isTimerRunning: true });
        },

        stopTimer: () => {
          set({ isTimerRunning: false });
        },

        resetTimer: () => {
          const state = get();
          set({ 
            timeRemaining: state.gameSettings.roundTime,
            isTimerRunning: false 
          });
        },

        decrementTime: () => {
          const state = get();
          if (state.timeRemaining > 0 && state.isTimerRunning) {
            const newTime = state.timeRemaining - 1;
            set({ timeRemaining: newTime });
            
            if (newTime === 0) {
              // Time's up, move to next player
              get().stopTimer();
              get().nextPlayer();
            }
          }
        },

        // Movie management
        setCurrentMovie: (movie: Movie) => {
          set({ currentMovie: movie });
        },

        markGuessAsCorrect: () => {
          const state = get();
          const currentTeam = state.teams[state.currentTeamIndex];
          if (currentTeam && state.currentMovie) {
            get().updateTeamScore(
              currentTeam.id,
              state.gameSettings.pointsPerCorrectGuess
            );
            get().stopTimer();
            set({ gamePhase: 'intermission' });
          }
        },

        skipMovie: () => {
          get().setCurrentMovie(getRandomMovie());
          get().resetTimer();
        },

        // Game settings management
        updateRoundTime: (time: number) => {
          set((state) => ({
            gameSettings: {
              ...state.gameSettings,
              roundTime: time
            },
            timeRemaining: time // Update current time remaining too
          }));
        },

        // Category management
        selectCategory: (category: string) => {
          set({ selectedCategory: category });
        },

        // Game phase management
        setGamePhase: (phase: GameState['gamePhase']) => {
          set({ gamePhase: phase });
        },

        // Reset
        resetGame: () => {
          set({
            ...initialState,
            teams: get().teams.map(team => ({
              ...team,
              score: 0,
              players: team.players.map(player => ({
                ...player,
                score: 0,
                hasPlayedCurrentRound: false
              }))
            }))
          });
        }
      }),
      {
        name: 'cinemimica-game-store',
        partialize: (state) => ({
          teams: state.teams,
          gameSettings: state.gameSettings,
          timeRemaining: state.timeRemaining
        })
      }
    )
  )
);

// Selectors for easier access to common state
export const useCurrentPlayer = () => {
  const store = useGameStore();
  const currentTeam = store.teams[store.currentTeamIndex];
  const currentPlayer = currentTeam?.players[store.currentPlayerIndex] || null;
  return currentPlayer;
};

export const useCurrentTeam = () => {
  const store = useGameStore();
  return store.teams[store.currentTeamIndex] || null;
};

export const useGamePhase = () => useGameStore((state) => state.gamePhase);
export const useTeams = () => useGameStore((state) => state.teams);
export const useCurrentMovie = () => useGameStore((state) => state.currentMovie);
export const useTimer = () => useGameStore((state) => ({
  timeRemaining: state.timeRemaining,
  isTimerRunning: state.isTimerRunning
}));
