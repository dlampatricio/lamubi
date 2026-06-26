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
  playersReady: '{count} player(s) ready',
  nameAllPlayers: 'Name all players to begin',
  beginMatch: 'Begin Match',

  loadingMovie: 'Loading movie...',
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

  teamNamePlaceholder: 'TEAM NAME',
  playerNamePlaceholder: 'PLAYER NAME',
  addPlayer: 'Add Player',

  toggleTheme: 'Toggle theme',
  toggleLang: 'Español',
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
  playersReady: '{count} jugador(es) listo(s)',
  nameAllPlayers: 'Nombra todos los jugadores para empezar',
  beginMatch: 'Comenzar Partida',

  loadingMovie: 'Cargando película...',
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

  teamNamePlaceholder: 'NOMBRE DEL EQUIPO',
  playerNamePlaceholder: 'NOMBRE DEL JUGADOR',
  addPlayer: 'Añadir Jugador',

  toggleTheme: 'Cambiar tema',
  toggleLang: 'English',
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
