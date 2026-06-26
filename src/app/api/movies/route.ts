import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.TMDB_API_KEY!;

  const url = new URL('https://api.themoviedb.org/3/discover/movie');
  url.searchParams.append('api_key', API_KEY);
  url.searchParams.append('language', 'en-US');
  url.searchParams.append('vote_count.gte', '500');

  try {
    const res = await fetch(url.toString());
    const data = await res.json();

    if (!data.results?.length) {
      return NextResponse.json([], { status: 404 });
    }

    const movies = await Promise.all(
      data.results.slice(0, 100).map(async (m: any) => {
        const dRes = await fetch(
          `https://api.themoviedb.org/3/movie/${m.id}?api_key=${API_KEY}&append_to_response=credits`
        );
        const d = await dRes.json();

        return {
          id: d.id,
          title: d.title,
          poster_path: d.poster_path,
          year: d.release_date?.split('-')[0],
          rating: d.vote_average?.toFixed(1),
          overview: d.overview,
          genres: d.genres?.map((g: any) => g.name),
          director: d.credits?.crew?.find((c: any) => c.job === 'Director')?.name,
        };
      })
    );

    return NextResponse.json(movies);
  } catch {
    return NextResponse.json({ error: 'TMDB error' }, { status: 500 });
  }
}
