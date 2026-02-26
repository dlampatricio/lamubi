import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const API_KEY = process.env.TMDB_API_KEY!;
  const { searchParams } = new URL(req.url);

  const url = new URL("https://api.themoviedb.org/3/discover/movie");
  url.searchParams.append("api_key", API_KEY);
  url.searchParams.append("language", "en-US");

  const allowedKeys = [
    "with_genres",
    "with_cast",
    "with_crew",
    "with_companies",
    "with_keywords",
    "primary_release_date.gte",
    "primary_release_date.lte",
    "vote_average.gte",
    "vote_count.gte",
    "with_runtime.gte",
    "with_runtime.lte",
    "with_original_language",
    "with_origin_country",
    "sort_by"
  ];

  searchParams.forEach((value, key) => {
    if (allowedKeys.includes(key) && value && value !== "null") {
      url.searchParams.append(key, value);
    }
  });

  if (!url.searchParams.has("sort_by")) {
    url.searchParams.append("sort_by", "popularity.desc");
  }

  try {
    const res = await fetch(url.toString());
    const data = await res.json();

    if (!data.results?.length) {
      return NextResponse.json([], { status: 404 });
    }

    const movies = await Promise.all(
      data.results.slice(0, 10).map(async (m: any) => {
        const dRes = await fetch(
          `https://api.themoviedb.org/3/movie/${m.id}?api_key=${API_KEY}&append_to_response=credits`
        );
        const d = await dRes.json();

        return {
          id: d.id,
          title: d.title,
          poster_path: d.poster_path,
          year: d.release_date?.split("-")[0],
          rating: d.vote_average?.toFixed(1),
          overview: d.overview,
          genres: d.genres?.map((g: any) => g.name),
          director: d.credits?.crew?.find((c: any) => c.job === "Director")?.name,
          cast: d.credits?.cast?.slice(0, 3).map((a: any) => a.name),
          runtime: d.runtime,
          original_language: d.original_language
        };
      })
    );

    return NextResponse.json(movies);
  } catch {
    return NextResponse.json({ error: "TMDB error" }, { status: 500 });
  }
}