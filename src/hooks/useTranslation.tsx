'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface Translations {
  [key: string]: string;
}

const en: Translations = {
  lang: 'en',
  siteTitle: 'La Mubi',
  siteDescription: 'Cinema Mimic Experience',

  welcomeTo: 'Welcome to',
  enter: 'Enter',
  localMultiplayer: 'Local Multiplayer \u2022 No Account Needed',

  gameSetup: 'Game Setup',
  lobby: 'Lobby',
  selectGameMode: 'Select Game Mode',
  charades: 'Charades',
  charadesDesc: 'Act out movies for your team without speaking',
  impostor: 'Impostor',
  impostorDesc: 'Find the player who doesn\u2019t know the movie',

  revealingTitle: 'Look at the screen',
  revealingImpostor: 'You are the IMPOSTOR!',
  revealingAImpostor: 'You are an IMPOSTOR!',
  revealingImpostorHint: 'Fake it \u2014 you don\u2019t know the movie.',
  revealingMovieHint: 'Memorize the movie details.',
  tapToContinue: 'Tap to continue',
  tapToReveal: 'Tap to reveal',
  passTo: 'Pass to',
  wordRound: 'Word Round',
  wordRoundDesc: 'Each player says one word related to the movie.',
  eliminatedNotImpostor: '{name} was not the impostor.',
  eliminatedNotAImpostor: '{name} was not an impostor.',
  eliminatedImpostor: '{name} was an IMPOSTOR!',
  startDebate: 'Start Debate',
  stopDebate: 'Stop Debate',
  voteToEliminate: 'Who is the impostor?',
  voteToEliminatePlural: 'Who are the impostors?',
  noEliminate: "Don't eliminate",
  impostorWins: 'The IMPOSTOR wins!',
  impostorsWin: 'The IMPOSTORS win!',
  nonImpostorsWin: 'The players win!',
  theImpostorWas: 'The impostor was',
  theImpostorsWere: 'The impostors were',
  backToLobby: 'Back to Lobby',
  playersReady: '{count} player(s) ready',
  nameAllPlayers: 'Name all players to begin',
  beginMatch: 'Begin Match',

  nextPerformer: 'Next Performer',
  player: 'Player',
  memorizeInstructions:
    'Memorize the movie details. You will act it out for your team without speaking.',
  imReady: "I'm Ready",
  skipMovie: 'Skip this movie',
  skippedToast: 'Skipped \u2014 loading next movie...',

  actingNow: 'Acting Now',
  guessed: 'Guessed!',
  surrender: 'Surrender',
  giveUp: 'Give Up',
  cancel: 'Cancel',

  roundSummary: 'Round Summary',
  results: 'Results',
  theMovieWas: 'The Movie Was',
  nextUp: 'Next Up',
  nextTurn: 'Next Turn',
  finishGame: 'Finish Game / Lobby',

  currentStandings: 'Current Standings',
  team: 'Team',

  loading: 'Loading...',
  tapToFlip: 'Tap to flip',
  rating: 'Rating',
  synopsis: 'Synopsis',
  noDescription: 'No description available.',
  director: 'Director',
  unknown: 'Unknown',
  genres: 'Genres',
  na: 'N/A',

  roundTimer: 'Round Timer',
  debateTimer: 'Debate Timer',
  impostorCount: 'Impostors',

  impHowToPlayStep1:
    'Non-impostor players see the movie card with title, year, rating, synopsis, director, and genres.',
  impHowToPlayStep2: 'One player is the IMPOSTOR and does not see the movie.',
  impHowToPlayStep2_plural: '{count} players are the IMPOSTORS and do not see the movie.',
  impHowToPlayStep3:
    'Players take turns saying a word related to the movie. The impostor must blend in.',
  impHowToPlayStep3_plural:
    'Players take turns saying a word related to the movie. The impostors must blend in.',
  impHowToPlayStep4:
    'After the debate, everyone votes on who the impostor is. The impostor wins if not caught.',
  impHowToPlayStep4_plural:
    'After the debate, everyone votes on who the impostors are. The impostors win if not all are caught.',
  impHowToPlayStep5: 'If the impostor is caught, the other players win.',
  impHowToPlayStep5_plural: 'If the impostors are caught, the other players win.',

  teamNamePlaceholder: 'TEAM NAME',
  playerNamePlaceholder: 'PLAYER NAME',
  addPlayer: 'Add Player',
  playersLabel: 'Players',

  howToPlay: 'How to Play',

  howToPlayStep1: 'Form teams of 2 or more players.',
  howToPlayStep2:
    'Each round, one player is the performer. They see a movie card with title, year, rating, synopsis, director, and genres.',
  howToPlayStep3:
    'The performer acts out the movie for their team WITHOUT speaking or making sounds.',
  howToPlayStep4:
    'The team tries to guess the movie title within the time limit. A correct guess earns a point!',
  howToPlayStep5: 'Players take turns performing. The team with the most points at the end wins.',

  toggleTheme: 'Toggle theme',
  toggleLang: 'English',
  watchlist: 'See in Letterboxd',
};

const es: Translations = {
  lang: 'es',
  siteTitle: 'La Mubi',
  siteDescription: 'Experiencia de Mímica Cinematográfica',

  welcomeTo: 'Bienvenido a',
  enter: 'Entrar',
  localMultiplayer: 'Multijugador Local \u2022 Sin Cuenta',

  gameSetup: 'Configuración',
  lobby: 'Sala',
  selectGameMode: 'Seleccionar Modo',
  charades: 'Charadas',
  charadesDesc: 'Actúa películas para tu equipo sin hablar',
  impostor: 'Impostor',
  impostorDesc: 'Encuentra al jugador que no conoce la película',

  revealingTitle: 'Mira la pantalla',
  revealingImpostor: '¡Eres el IMPOSTOR!',
  revealingAImpostor: '¡Eres un IMPOSTOR!',
  revealingImpostorHint: 'Finge \u2014 no conoces la película.',
  revealingMovieHint: 'Memoriza los detalles de la película.',
  tapToContinue: 'Toca para continuar',
  tapToReveal: 'Toca para revelar',
  passTo: 'Pasar a',
  wordRound: 'Ronda de Palabras',
  wordRoundDesc: 'Cada jugador dice una palabra relacionada con la película.',
  eliminatedNotImpostor: '{name} no era el impostor.',
  eliminatedNotAImpostor: '{name} no era un impostor.',
  eliminatedImpostor: '¡{name} era un IMPOSTOR!',
  startDebate: 'Iniciar Debate',
  stopDebate: 'Detener Debate',
  voteToEliminate: '¿Quién es el impostor?',
  voteToEliminatePlural: '¿Quiénes son los impostores?',
  noEliminate: 'No eliminar',
  impostorWins: '¡El IMPOSTOR gana!',
  impostorsWin: '¡Los IMPOSTORES ganan!',
  nonImpostorsWin: '¡Los jugadores ganan!',
  theImpostorWas: 'El impostor era',
  theImpostorsWere: 'Los impostores eran',
  backToLobby: 'Volver a la Sala',
  playersReady: '{count} jugador(es) listo(s)',
  nameAllPlayers: 'Nombra todos los jugadores para empezar',
  beginMatch: 'Comenzar Partida',

  nextPerformer: 'Siguiente Actor',
  player: 'Jugador',
  memorizeInstructions:
    'Memoriza los detalles de la película. Deberás actuarla para tu equipo sin hablar.',
  imReady: 'Listo',
  skipMovie: 'Saltar película',
  skippedToast: 'Saltada \u2014 cargando siguiente película...',

  actingNow: 'Actuando',
  guessed: '¡Adivinado!',
  surrender: 'Rendirse',
  giveUp: 'Abandonar',
  cancel: 'Cancelar',

  roundSummary: 'Resumen de Ronda',
  results: 'Resultados',
  theMovieWas: 'La Película Era',
  nextUp: 'Siguiente',
  nextTurn: 'Siguiente Turno',
  finishGame: 'Finalizar / Sala',

  currentStandings: 'Clasificación',
  team: 'Equipo',

  loading: 'Cargando...',
  tapToFlip: 'Toca para girar',
  rating: 'Puntuación',
  synopsis: 'Sinopsis',
  noDescription: 'Sin descripción disponible.',
  director: 'Director',
  unknown: 'Desconocido',
  genres: 'Géneros',
  na: 'N/A',

  roundTimer: 'Temporizador',
  debateTimer: 'Tiempo de Debate',
  impostorCount: 'Impostores',

  impHowToPlayStep1:
    'Los jugadores que no son impostores ven la tarjeta con título, año, puntuación, sinopsis, director y géneros.',
  impHowToPlayStep2: 'Un jugador es el IMPOSTOR y no ve la película.',
  impHowToPlayStep2_plural: '{count} jugadores son los IMPOSTORES y no ven la película.',
  impHowToPlayStep3:
    'Los jugadores se turnan diciendo una palabra relacionada con la película. El impostor debe fingir.',
  impHowToPlayStep3_plural:
    'Los jugadores se turnan diciendo una palabra relacionada con la película. Los impostores deben fingir.',
  impHowToPlayStep4:
    'Después del debate, todos votan quién es el impostor. El impostor gana si no lo descubren.',
  impHowToPlayStep4_plural:
    'Después del debate, todos votan quiénes son los impostores. Los impostores ganan si no atrapan a todos.',
  impHowToPlayStep5: 'Si descubren al impostor, los demás ganan.',
  impHowToPlayStep5_plural: 'Si atrapan a los impostores, los demás ganan.',

  teamNamePlaceholder: 'NOMBRE DEL EQUIPO',
  playerNamePlaceholder: 'NOMBRE DEL JUGADOR',
  addPlayer: 'Añadir Jugador',
  playersLabel: 'Jugadores',

  howToPlay: 'Cómo Jugar',

  howToPlayStep1: 'Forma equipos de 2 o más jugadores.',
  howToPlayStep2:
    'En cada ronda, un jugador es el actor. Ve una tarjeta con título, año, puntuación, sinopsis, director y géneros de una película.',
  howToPlayStep3:
    'El actor debe representar la película para su equipo SIN hablar ni hacer sonidos.',
  howToPlayStep4:
    'El equipo intenta adivinar el título dentro del tiempo límite. ¡Un acierto suma un punto!',
  howToPlayStep5: 'Los jugadores se turnan para actuar. Gana el equipo con más puntos al final.',

  toggleTheme: 'Cambiar tema',
  toggleLang: 'Español',
  watchlist: 'Ver en Letterboxd',
};

const all = { en, es } as const;
type Lang = keyof typeof all;
type Key = keyof typeof en;

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: Key, params?: Record<string, string | number>) => string;
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: (k) => all.en[k],
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('lamubi-lang') as Lang | null;
    if (stored && (stored === 'en' || stored === 'es')) {
      setLangState(stored);
      document.documentElement.lang = stored === 'es' ? 'es' : 'en';
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('lamubi-lang', l);
    document.documentElement.lang = l === 'es' ? 'es' : 'en';
  };

  const t = (key: Key, params?: Record<string, string | number>): string => {
    let text = all[lang][key] ?? key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  if (!mounted) {
    const stub: LangContextType = {
      lang: 'en',
      setLang,
      t: (key, params) => {
        let text = all.en[key] ?? key;
        if (params) {
          Object.entries(params).forEach(([k, v]) => {
            text = text.replace(`{${k}}`, String(v));
          });
        }
        return text;
      },
    };
    return <LangContext.Provider value={stub}>{children}</LangContext.Provider>;
  }

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useTranslation = () => useContext(LangContext);
