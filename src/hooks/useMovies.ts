import { useState } from 'react';
import { Movie } from '@/types/game';

export const useMovies = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovieBatch = async (): Promise<Movie[]> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/movies');
      if (!response.ok) throw new Error('Error en la API');
      
      const data = await response.json();
      return data as Movie[];
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchMovieBatch, isLoading };
};