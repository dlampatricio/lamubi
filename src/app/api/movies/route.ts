import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.TMDB_API_KEY;
  
  try {
    // 1. Obtenemos películas populares (o una lista aleatoria)
    const listRes = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${Math.floor(Math.random() * 10) + 1}`
    );
    const listData = await listRes.json();
    
    // 2. Tomamos una muestra aleatoria de los resultados
    const randomMovies = listData.results.sort(() => 0.5 - Math.random()).slice(0, 15);

    // 3. Obtenemos detalles profundos de cada película (para géneros y créditos)
    const detailedMovies = await Promise.all(
      randomMovies.map(async (m: any) => {
        const detailRes = await fetch(
          `https://api.themoviedb.org/3/movie/${m.id}?api_key=${API_KEY}&append_to_response=credits`
        );
        const details = await detailRes.json();
        
        const director = details.credits?.crew?.find((person: any) => person.job === "Director")?.name;

        // Extraemos el nombre del primer país de producción
        const country = details.production_countries?.[0]?.name || "Unknown";

        return {
          id: details.id,
          title: details.title,
          poster_path: details.poster_path,
          year: details.release_date?.split('-')[0],
          rating: details.vote_average.toFixed(1),
          overview: details.overview,
          genres: details.genres?.map((g: any) => g.name).slice(0, 2),
          director: director || "Unknown",
          country: country // <--- Nueva propiedad
        };
      })
    );

    return NextResponse.json(detailedMovies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}