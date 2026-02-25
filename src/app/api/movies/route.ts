import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const API_KEY = process.env.TMDB_API_KEY;
  const { searchParams } = new URL(req.url);
  
  const id = searchParams.get('id');
  const type = searchParams.get('type');

  let url = '';

  // Lógica de construcción de URL según la categoría
  if (type === 'company' && id) {
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_companies=${id}&sort_by=vote_count.desc`;
  } else if (type === 'keyword' && id) {
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_keywords=${id}&sort_by=popularity.desc`;
  } else {
    // Default: Top Rated (con un toque de aleatoriedad en la página)
    const randomPage = Math.floor(Math.random() * 5) + 1;
    url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=${randomPage}`;
  }

  try {
    const listRes = await fetch(url);
    const listData = await listRes.json();
    
    // Mezclamos y limitamos a 15 películas
    const randomResults = listData.results.sort(() => 0.5 - Math.random()).slice(0, 15);

    const detailedMovies = await Promise.all(
      randomResults.map(async (m: any) => {
        const detailRes = await fetch(
          `https://api.themoviedb.org/3/movie/${m.id}?api_key=${API_KEY}&append_to_response=credits`
        );
        const d = await detailRes.json();
        
        return {
          id: d.id,
          title: d.title,
          poster_path: d.poster_path,
          year: d.release_date?.split('-')[0],
          rating: d.vote_average.toFixed(1),
          overview: d.overview,
          genres: d.genres?.map((g: any) => g.name).slice(0, 2),
          director: d.credits?.crew?.find((p: any) => p.job === "Director")?.name || "Unknown",
          country: d.production_countries?.[0]?.name || "USA"
        };
      })
    );

    return NextResponse.json(detailedMovies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}