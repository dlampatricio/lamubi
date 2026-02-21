import { Movie } from '@/types/game';

export const mockMovies: Movie[] = [
  {
    id: '1',
    title: 'Inception',
    year: 2010,
    poster_path: '/image.jpg',
    difficulty: 'medium'
  },
  {
    id: '2',
    title: 'The Dark Knight',
    year: 2008,
    poster_path: '/image.jpg',
    difficulty: 'easy'
  },
  {
    id: '3',
    title: 'Interstellar',
    year: 2014,
    poster_path: '/image.jpg',
    difficulty: 'medium'
  },
  {
    id: '4',
    title: 'Pulp Fiction',
    year: 1994,
    poster_path: '/image.jpg',
    difficulty: 'hard'
  },
  {
    id: '5',
    title: 'The Matrix',
    year: 1999,
    poster_path: '/image.jpg',
    difficulty: 'medium'
  },
  {
    id: '6',
    title: 'Forrest Gump',
    year: 1994,
    poster_path: '/image.jpg',
    difficulty: 'easy'
  },
  {
    id: '7',
    title: 'The Shawshank Redemption',
    year: 1994,
    poster_path: '/image.jpg',
    difficulty: 'medium'
  },
  {
    id: '8',
    title: 'Fight Club',
    year: 1999,
    poster_path: '/image.jpg',
    difficulty: 'hard'
  },
  {
    id: '9',
    title: 'Goodfellas',
    year: 1990,
    poster_path: '/image.jpg',
    difficulty: 'hard'
  },
  {
    id: '10',
    title: 'The Godfather',
    year: 1972,
    poster_path: '/image.jpg',
    difficulty: 'medium'
  }
];

export const movieCategories = [
  'Acción',
  'Comedia',
  'Drama',
  'Ciencia Ficción',
  'Thriller',
  'Romance',
  'Terror',
  'Animación'
];

export const getRandomMovie = (difficulty?: Movie['difficulty']): Movie => {
  const filteredMovies = difficulty 
    ? mockMovies.filter(movie => movie.difficulty === difficulty)
    : mockMovies;
  
  return filteredMovies[Math.floor(Math.random() * filteredMovies.length)];
};
