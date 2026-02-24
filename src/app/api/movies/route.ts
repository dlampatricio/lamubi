import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.TMDB_API_KEY;
  const BASE_URL = 'https://api.themoviedb.org/3';

  try {
    // Página aleatoria para variar los resultados
    const randomPage = Math.floor(Math.random() * 15) + 1;
    
    const res = await fetch(
      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${randomPage}&vote_count.gte=10000`,
      { next: { revalidate: 0 } }
    );

    if (!res.ok) return NextResponse.json({ error: 'Failed to connect to TMDB' }, { status: 500 });

    const data = await res.json();

    // Limpiamos los datos antes de enviarlos al cliente
    const movies = data.results
      .filter((m: any) => m.title.length < 30) 
      .map((m: any) => ({
        id: m.id,
        title: m.title.toUpperCase(),
        poster_path: m.poster_path,
        year: m.release_date ? new Date(m.release_date).getFullYear() : undefined,
        rating: Math.round(m.vote_average * 10) / 10,
      }))
      .sort(() => Math.random() - 0.5);

    return NextResponse.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}