import { GameMode, GameStore, ImpostorState, Movie, Player, Team } from '@/types/game';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialTeams: Team[] = [
  { name: 'Mad Max', score: 0, players: [], current_player_index: 0 },
  { name: 'La La Land', score: 0, players: [], current_player_index: 0 },
];

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // --- STATE ---
      game_state: 'idle',
      gameMode: 'charades' as GameMode,
      players: [] as Player[],
      impostorState: 'revealing' as ImpostorState,
      revealIndex: 0,
      impostorIndex: null,
      eliminatedIndices: [] as number[],
      debate_timer: 60,
      teams: initialTeams,
      current_team_index: 0,
      timer: 60,
      initial_timer: 60,
      movies: [] as Movie[],
      current_movie: null as Movie | null,

      // --- ACTIONS ---
      setGameMode: (mode) => set({ gameMode: mode }),

      addIndividualPlayer: (name) =>
        set((state) => ({
          players: [...state.players, { name: name || `Player ${state.players.length + 1}` }],
        })),

      removeIndividualPlayer: (index) =>
        set((state) => ({
          players: state.players.filter((_, i) => i !== index),
        })),

      updateIndividualPlayerName: (index, name) =>
        set((state) => ({
          players: state.players.map((p, i) => (i === index ? { name } : p)),
        })),

      updateTeamName: (index, newName) =>
        set((state) => ({
          teams: state.teams.map((t, i) => (i === index ? { ...t, name: newName } : t)),
        })),

      addPlayer: (teamIndex, playerName) =>
        set((state) => ({
          teams: state.teams.map((team, i) =>
            i === teamIndex
              ? {
                  ...team,
                  players: [
                    ...team.players,
                    { name: playerName || `Player ${team.players.length + 1}` },
                  ],
                }
              : team
          ),
        })),

      removePlayer: (teamIndex, playerIndex) =>
        set((state) => ({
          teams: state.teams.map((team, i) =>
            i === teamIndex
              ? { ...team, players: team.players.filter((_, pi) => pi !== playerIndex) }
              : team
          ),
        })),

      updatePlayerName: (teamIndex, playerIndex, newName) =>
        set((state) => ({
          teams: state.teams.map((team, tIdx) =>
            tIdx === teamIndex
              ? {
                  ...team,
                  players: team.players.map((p, pIdx) =>
                    pIdx === playerIndex ? { name: newName } : p
                  ),
                }
              : team
          ),
        })),

      setInitialTimer: (seconds) =>
        set({
          initial_timer: seconds,
          timer: seconds,
        }),

      setDebateTimer: (seconds) =>
        set({ debate_timer: seconds }),

      startImpostorGame: (initial_movies: Movie[]) => {
        const [first, ...rest] = initial_movies;
        const players = get().players;
        const impostorIdx = Math.floor(Math.random() * players.length);
        set({
          game_state: 'playing',
          current_movie: first,
          movies: rest,
          impostorIndex: impostorIdx,
          impostorState: 'revealing',
          revealIndex: 0,
          eliminatedIndices: [],
          timer: get().debate_timer,
        });
      },

      nextReveal: () => {
        const state = get();
        const nextIdx = state.revealIndex + 1;
        if (nextIdx >= state.players.length) {
          set({ impostorState: 'word_wait', revealIndex: nextIdx });
        } else {
          set({ revealIndex: nextIdx });
        }
      },

      startDebate: () =>
        set((state) => ({
          impostorState: 'debate',
          timer: state.debate_timer,
        })),

      stopDebate: () =>
        set({ impostorState: 'voting' }),

      eliminatePlayer: (index) => {
        const state = get();
        const newEliminated = [...state.eliminatedIndices, index];
        const isImpostor = index === state.impostorIndex;
        const activeCount = state.players.length - newEliminated.length;
        const impostorStillIn =
          state.impostorIndex !== null && !newEliminated.includes(state.impostorIndex);
        const nonImpostorCount = impostorStillIn ? activeCount - 1 : activeCount;

        if (isImpostor || nonImpostorCount <= 1) {
          set({ eliminatedIndices: newEliminated, impostorState: 'result' });
        } else {
          set({ eliminatedIndices: newEliminated, impostorState: 'word_wait' });
        }
      },

      decrementTimer: () =>
        set((state) => ({
          timer: Math.max(0, state.timer - 1),
        })),

      prepareGame: () =>
        set((state) => ({
          game_state: 'loading',
          teams: state.teams.map((t) => ({ ...t, score: 0, current_player_index: 0 })),
          current_team_index: 0,
          timer: state.initial_timer,
          movies: [],
          current_movie: null,
        })),

      skipMovie: () => {
        const state = get();
        if (state.movies.length === 0) {
          state.refillMovies();
          return;
        }
        set({
          current_movie: state.movies[0],
          movies: state.movies.slice(1),
        });
        if (get().movies.length < 3) {
          get().refillMovies();
        }
      },

      startGame: (initial_movies: Movie[]) => {
        const [first, ...rest] = initial_movies;
        set((state) => ({
          game_state: 'playing',
          teams: state.teams.map((t) => ({ ...t, score: 0, current_player_index: 0 })),
          current_team_index: 0,
          timer: state.initial_timer,
          movies: rest,
          current_movie: first,
        }));
      },

      startActing: () => {
        set({ game_state: 'acting' });
      },

      endRound: () => set({ game_state: 'finished' }),

      resetScores: () =>
        set((state) => ({
          game_state: 'idle',
          teams: state.teams.map((t) => ({ ...t, score: 0, current_player_index: 0 })),
          current_team_index: 0,
          movies: [],
          current_movie: null,
        })),

      resetGame: () =>
        set((state) => ({
          game_state: 'idle',
          impostorIndex: null,
          impostorState: 'revealing' as ImpostorState,
          revealIndex: 0,
          eliminatedIndices: [],
          teams: state.gameMode === 'charades'
            ? initialTeams.map((t) => ({
                ...t,
                players: [],
                score: 0,
                current_player_index: 0,
              }))
            : state.teams,
          current_team_index: 0,
          timer: 60,
          initial_timer: 60,
          movies: [],
          current_movie: null,
        })),

      nextTeam: () => {
        const state = get();
        if (state.movies.length === 0) {
          state.refillMovies();
          return;
        }
        const nextIndex = (state.current_team_index + 1) % state.teams.length;
        const updatedTeams = state.teams.map((team, idx) => {
          if (idx === state.current_team_index) {
            const nextPlayerIdx =
              team.players.length > 0 ? (team.current_player_index + 1) % team.players.length : 0;
            return { ...team, current_player_index: nextPlayerIdx };
          }
          return team;
        });

        set({
          game_state: 'playing',
          teams: updatedTeams,
          current_team_index: nextIndex,
          timer: state.initial_timer,
          current_movie: state.movies[0],
          movies: state.movies.slice(1),
        });
        if (get().movies.length < 3) {
          get().refillMovies();
        }
      },

      correctGuess: () =>
        set((state) => ({
          teams: state.teams.map((team, idx) =>
            idx === state.current_team_index ? { ...team, score: team.score + 1 } : team
          ),
        })),

      refillMovies: async () => {
        try {
          const res = await fetch('/api/movies?count=8');
          const newMovies = await res.json();
          if (Array.isArray(newMovies) && newMovies.length > 0) {
            set((state) => ({
              movies: [...state.movies, ...newMovies],
            }));
          }
        } catch (e) {
          console.error('Refill movies failed:', e);
        }
      },
    }),
    {
      name: 'lamubi-game',
      partialize: (state) => ({
        gameMode: state.gameMode,
        players: state.players,
        impostorState: state.impostorState,
        revealIndex: state.revealIndex,
        impostorIndex: state.impostorIndex,
        eliminatedIndices: state.eliminatedIndices,
        teams: state.teams,
        current_team_index: state.current_team_index,
        timer: state.timer,
        initial_timer: state.initial_timer,
        debate_timer: state.debate_timer,
        movies: state.movies,
        current_movie: state.current_movie,
        game_state: state.game_state,
      }),
    }
  )
);
