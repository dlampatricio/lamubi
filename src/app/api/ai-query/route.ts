import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `
You are a world-class film analyst and TMDB query architect.

Your job:
- Fully understand ANY user movie request, regardless of complexity
- Infer implicit intent, quality expectations, era, tone, popularity
- Convert intent into an OPTIMAL TMDB /discover/movie query

RULES:
1. You MUST always return a valid TMDB discover query
2. If user intent is vague → infer best mainstream interpretation
3. If user intent is complex → combine filters intelligently
4. NEVER hallucinate unsupported TMDB parameters
5. If no constraints exist → default to high-quality popular films
6. Languages and countries MUST be ISO codes only (es, fr, ko / US, FR, CU)

AVAILABLE OUTPUT STRUCTURE (JSON ONLY):

{
  "people": { "cast": [], "crew": [] },
  "companies": [],
  "genres": [],
  "keywords": [],
  "languages": [],
  "countries": [],
  "date_range": { "gte": null, "lte": null },
  "runtime": { "gte": null, "lte": null },
  "quality": { "vote_average_gte": null, "vote_count_gte": null },
  "sort_by": "popularity.desc",
  "interpretation": "One sentence explaining intent"
}

ADAPTIVE QUALITY RULES:
- If searching for niche/foreign cinema (e.g., Cuba, Mongolia), set vote_count.gte to 0 or 5.
- If searching for Blockbusters, set vote_count.gte to 500.
- If searching for specific actors/directors, set vote_count.gte to 50.

IMPORTANT:
- Use ISO codes for languages and countries
- Genres must be real TMDB genres
- Dates must be YYYY-MM-DD
`;

const GENRE_MAP: Record<string, number> = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  sciencefiction: 878,
  thriller: 53,
  war: 10752,
  western: 37
};

async function resolveTMDBEntity(query: string, type: "person" | "company" | "keyword") {
  const url = `https://api.themoviedb.org/3/search/${type}?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data?.results?.[0]?.id ?? null;
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        temperature: 0.15,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ]
      })
    });

    const aiData = await aiRes.json();
    const raw = aiData.choices?.[0]?.message?.content;
    const jsonMatch = raw?.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response");

    const parsed = JSON.parse(jsonMatch[0]);

    const genreIds = parsed.genres
      ?.map((g: string) => GENRE_MAP[g.toLowerCase().replace(/\s/g, "")])
      .filter(Boolean)
      .join(",");

    const castIds = await Promise.all(parsed.people.cast.map((p: string) => resolveTMDBEntity(p, "person")));
    const crewIds = await Promise.all(parsed.people.crew.map((p: string) => resolveTMDBEntity(p, "person")));
    const companyIds = await Promise.all(parsed.companies.map((c: string) => resolveTMDBEntity(c, "company")));
    const keywordIds = await Promise.all(parsed.keywords.map((k: string) => resolveTMDBEntity(k, "keyword")));

    const finalQuery: any = {
      with_cast: castIds.filter(Boolean).join(",") || undefined,
      with_crew: crewIds.filter(Boolean).join(",") || undefined,
      with_companies: companyIds.filter(Boolean).join(",") || undefined,
      with_keywords: keywordIds.filter(Boolean).join(",") || undefined,
      with_genres: genreIds || undefined,
      "primary_release_date.gte": parsed.date_range?.gte || undefined,
      "primary_release_date.lte": parsed.date_range?.lte || undefined,
      "with_runtime.gte": parsed.runtime?.gte || undefined,
      "with_runtime.lte": parsed.runtime?.lte || undefined,
      "vote_average.gte": parsed.quality?.vote_average_gte || undefined,
      "vote_count.gte": parsed.quality?.vote_count_gte || (parsed.countries?.length > 0 ? 0 : 50),

      with_original_language: parsed.languages?.[0] || undefined,
      with_origin_country: parsed.countries?.[0] || undefined,
      sort_by: parsed.sort_by || "popularity.desc",
      interpretation: parsed.interpretation
    };

    // 🔐 Normalización ISO
    if (finalQuery.with_original_language?.length !== 2) delete finalQuery.with_original_language;
    if (finalQuery.with_origin_country?.length !== 2) delete finalQuery.with_origin_country;

    // 🔐 Fallback absoluto
    if (
      !finalQuery.with_cast &&
      !finalQuery.with_crew &&
      !finalQuery.with_keywords &&
      !finalQuery.with_genres
    ) {
      finalQuery.sort_by = "vote_average.desc";
      finalQuery["vote_count.gte"] = 300;
    }

    const cleanQuery = Object.fromEntries(
      Object.entries(finalQuery).filter(([_, v]) => v !== undefined && v !== null && v !== "")
    );

    return NextResponse.json(cleanQuery);

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}