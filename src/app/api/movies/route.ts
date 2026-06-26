import { NextRequest, NextResponse } from 'next/server';

interface TMDBMovieResult {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
}

interface TMDBGenre {
  id: number;
  name: string;
}

interface TMDBCredit {
  job: string;
  name: string;
}

interface TMDBMovieDetail {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genres: TMDBGenre[];
  credits: { crew: TMDBCredit[] };
}

interface TMDBPopularResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: TMDBMovieResult[];
}

interface MovieResult {
  id: number;
  title: string;
  poster_path: string;
  year: string;
  rating: string;
  overview: string;
  genres: string[];
  director: string | undefined;
}

export async function GET(request: NextRequest) {
  const API_KEY = process.env.TMDB_API_KEY!;
  const count = Math.min(Math.max(Number(request.nextUrl.searchParams.get('count')) || 8, 1), 20);

  // Cuántas películas queremos obtener del pool (mínimo 50, máximo 200)
  const poolSize = Math.min(Math.max(count * 5, 50), 200);

  try {
    // Obtener la primera página para conocer total de páginas
    const discoverUrl = new URL('https://api.themoviedb.org/3/discover/movie');
    discoverUrl.searchParams.append('api_key', API_KEY);
    discoverUrl.searchParams.append('language', 'en-US');
    discoverUrl.searchParams.append('sort_by', 'vote_average.desc');
    discoverUrl.searchParams.append('vote_count.gte', '1000');
    discoverUrl.searchParams.append('vote_average.gte', '7');

    const firstRes = await fetch(discoverUrl.toString());
    const firstData: TMDBPopularResponse = await firstRes.json();

    if (!firstData.results?.length) {
      return NextResponse.json([], { status: 404 });
    }

    // Calcular cuántas páginas necesitamos (asumiendo 20 por página)
    const moviesPerPage = 20;
    const pagesNeeded = Math.ceil(poolSize / moviesPerPage);
    const totalPages = Math.min(firstData.total_pages, 500); // TMDB limita a 500 páginas

    // Seleccionar páginas aleatorias
    const pageNumbers: number[] = [];
    const availablePages = Math.min(totalPages, 100); // Usamos máximo 100 páginas para no sobrecargar

    // Generar números de página aleatorios únicos
    while (pageNumbers.length < Math.min(pagesNeeded, availablePages)) {
      const randomPage = Math.floor(Math.random() * availablePages) + 1;
      if (!pageNumbers.includes(randomPage)) {
        pageNumbers.push(randomPage);
      }
    }

    // Obtener todas las páginas seleccionadas en paralelo
    const pageRequests = pageNumbers.map(async (pageNum) => {
      const url = new URL('https://api.themoviedb.org/3/discover/movie');
      url.searchParams.append('api_key', API_KEY);
      url.searchParams.append('language', 'en-US');
      url.searchParams.append('sort_by', 'vote_average.desc');
      url.searchParams.append('vote_count.gte', '1000');
      url.searchParams.append('vote_average.gte', '7');
      url.searchParams.append('page', pageNum.toString());

      const res = await fetch(url.toString());
      const data: TMDBPopularResponse = await res.json();
      return data.results || [];
    });

    const pageResults = await Promise.all(pageRequests);

    // Combinar todas las películas de todas las páginas
    const allMovies = pageResults.flat();

    // Mezclar aleatoriamente
    for (let i = allMovies.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allMovies[i], allMovies[j]] = [allMovies[j], allMovies[i]];
    }

    // Seleccionar las que vamos a procesar (limitado al poolSize)
    const selectedMovies = allMovies.slice(0, poolSize);

    if (selectedMovies.length === 0) {
      return NextResponse.json([], { status: 404 });
    }

    // Obtener detalles de cada película
    const results = await Promise.allSettled(
      selectedMovies.map(async (m) => {
        const dRes = await fetch(
          `https://api.themoviedb.org/3/movie/${m.id}?api_key=${API_KEY}&append_to_response=credits`
        );
        const d: TMDBMovieDetail = await dRes.json();

        return {
          id: d.id,
          title: d.title,
          poster_path: d.poster_path,
          year: d.release_date?.split('-')[0] || 'N/A',
          rating: d.vote_average?.toFixed(1) || '0',
          overview: d.overview || 'No overview available',
          genres: d.genres?.map((g) => g.name) || [],
          director: d.credits?.crew?.find((c) => c.job === 'Director')?.name,
        };
      })
    );

    let movies = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => (r as PromiseFulfilledResult<MovieResult>).value)
      .filter(Boolean) as MovieResult[];

    if (movies.length === 0) {
      console.error(
        'All TMDB detail requests failed:',
        results
          .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
          .map((r) => r.reason)
      );
      return NextResponse.json({ error: 'No movies could be loaded' }, { status: 500 });
    }

    // Mezclar nuevamente y limitar al count solicitado
    for (let i = movies.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [movies[i], movies[j]] = [movies[j], movies[i]];
    }

    movies = movies.slice(0, count);

    return NextResponse.json(movies);
  } catch (err) {
    console.error('TMDB API error:', err);
    return NextResponse.json({ error: 'TMDB error' }, { status: 500 });
  }
}
