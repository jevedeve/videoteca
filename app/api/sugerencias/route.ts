
import { NextRequest, NextResponse } from "next/server";
import { buscarTodo } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const datos = await buscarTodo(q);

    const resultados = (datos.results ?? [])
      .slice(0, 8)
      .map((item: {
        id: number;
        title?: string;
        name?: string;
        poster_path?: string | null;
        release_date?: string;
        first_air_date?: string;
        tipo: "pelicula" | "serie";
      }) => ({
        id: item.id,
        titulo: item.title ?? item.name ?? "",
        poster: item.poster_path ?? null,
        anio: (
          item.release_date ??
          item.first_air_date ??
          ""
        ).slice(0, 4),
        tipo: item.tipo,
      }));

    return NextResponse.json({ results: resultados });
  } catch {
    return NextResponse.json(
      { error: "No se pudieron cargar las sugerencias" },
      { status: 500 }
    );
  }
}

