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

  const fetchOptions = { next: { revalidate: 3600 } } as RequestInit;

  try {
    // Fetch 2-3 páginas aleatorias de discover para tener un pool diverso
    const pagesToFetch = Math.min(Math.max(Math.ceil((count * 3) / 20), 2), 5);
    const pageNumbers: number[] = [];
    while (pageNumbers.length < pagesToFetch) {
      const p = Math.floor(Math.random() * 100) + 1;
      if (!pageNumbers.includes(p)) pageNumbers.push(p);
    }

    const discoverUrl = (page: number) => {
      const url = new URL('https://api.themoviedb.org/3/discover/movie');
      url.searchParams.append('api_key', API_KEY);
      url.searchParams.append('language', 'en-US');
      url.searchParams.append('sort_by', 'vote_average.desc');
      url.searchParams.append('vote_count.gte', '1000');
      url.searchParams.append('vote_average.gte', '7');
      url.searchParams.append('page', String(page));
      return url.toString();
    };

    const pageResults = await Promise.all(
      pageNumbers.map((p) =>
        fetch(discoverUrl(p), fetchOptions).then((r) => r.json() as Promise<{ results: TMDBMovieResult[] }>)
      )
    );

    const allMovies = pageResults.flatMap((d) => d.results ?? []);

    if (allMovies.length === 0) {
      return NextResponse.json([], { status: 404 });
    }

    // Shuffle
    for (let i = allMovies.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allMovies[i], allMovies[j]] = [allMovies[j], allMovies[i]];
    }

    // Solo pedimos detalles de las que vamos a devolver (count, no todo el pool)
    const selected = allMovies.slice(0, count);

    const results = await Promise.allSettled(
      selected.map(async (m) => {
        const dRes = await fetch(
          `https://api.themoviedb.org/3/movie/${m.id}?api_key=${API_KEY}&append_to_response=credits`,
          fetchOptions
        );
        const d: TMDBMovieDetail = await dRes.json();

        return {
          id: d.id,
          title: d.title,
          poster_path: d.poster_path,
          year: d.release_date?.split('-')[0] ?? 'N/A',
          rating: d.vote_average?.toFixed(1) ?? '0',
          overview: d.overview || 'No overview available',
          genres: d.genres?.map((g) => g.name) ?? [],
          director: d.credits?.crew?.find((c) => c.job === 'Director')?.name,
        } satisfies MovieResult;
      })
    );

    const movies = results
      .filter((r): r is PromiseFulfilledResult<MovieResult> => r.status === 'fulfilled')
      .map((r) => r.value);

    if (movies.length === 0) {
      console.error(
        'All TMDB detail requests failed:',
        results.filter((r): r is PromiseRejectedResult => r.status === 'rejected').map((r) => r.reason)
      );
      return NextResponse.json({ error: 'No movies could be loaded' }, { status: 500 });
    }

    return NextResponse.json(movies);
  } catch (err) {
    console.error('TMDB API error:', err);
    return NextResponse.json({ error: 'TMDB error' }, { status: 500 });
  }
}
