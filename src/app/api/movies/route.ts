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

interface TMDBDiscoverResponse {
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

  const url = new URL('https://api.themoviedb.org/3/discover/movie');
  url.searchParams.append('api_key', API_KEY);
  url.searchParams.append('language', 'en-US');
  url.searchParams.append('vote_count.gte', '500');

  try {
    const res = await fetch(url.toString());
    const data: TMDBDiscoverResponse = await res.json();

    if (!data.results?.length) {
      return NextResponse.json([], { status: 404 });
    }

    const results = await Promise.allSettled(
      data.results.slice(0, count).map(async (m) => {
        const dRes = await fetch(
          `https://api.themoviedb.org/3/movie/${m.id}?api_key=${API_KEY}&append_to_response=credits`
        );
        const d: TMDBMovieDetail = await dRes.json();

        return {
          id: d.id,
          title: d.title,
          poster_path: d.poster_path,
          year: d.release_date?.split('-')[0],
          rating: d.vote_average?.toFixed(1),
          overview: d.overview,
          genres: d.genres?.map((g) => g.name),
          director: d.credits?.crew?.find((c) => c.job === 'Director')?.name,
        };
      })
    );

    const movies = (results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => (r as PromiseFulfilledResult<MovieResult>).value)
      .filter(Boolean) as MovieResult[]);

    if (movies.length === 0) {
      console.error('All TMDB detail requests failed:', results.filter((r): r is PromiseRejectedResult => r.status === 'rejected').map(r => r.reason));
      return NextResponse.json({ error: 'No movies could be loaded' }, { status: 500 });
    }

    return NextResponse.json(movies);
  } catch (err) {
    console.error('TMDB API error:', err);
    return NextResponse.json({ error: 'TMDB error' }, { status: 500 });
  }
}
