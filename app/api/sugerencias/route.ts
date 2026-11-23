
import { NextRequest, NextResponse } from "next/server";
import { buscarTodo } from "@/lib/tmdb";
import { normalizarPaginaBusqueda } from "@/lib/tmdb-paginacion";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  const pagina = normalizarPaginaBusqueda(
    request.nextUrl.searchParams.get("page") ?? undefined
  );

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [], page: 1, total_pages: 1 });
  }

  try {
    const datos = await buscarTodo(q, pagina);

    const peliculas = datos.results.filter(
      (item) => item.tipo === "pelicula"
    );
    const series = datos.results.filter((item) => item.tipo === "serie");
    const tanda = [];

    for (let indice = 0; tanda.length < 8; indice += 1) {
      const pelicula = peliculas[indice];
      const serie = series[indice];
      if (!pelicula && !serie) {
        break;
      }
      if (pelicula) {
        tanda.push(pelicula);
      }
      if (serie && tanda.length < 8) {
        tanda.push(serie);
      }
    }

    const resultados = tanda.map((item) => ({
      id: item.id,
      titulo: item.title ?? item.name ?? "",
      poster: item.poster_path ?? null,
      anio: (item.release_date ?? item.first_air_date ?? "").slice(0, 4),
      tipo: item.tipo,
    }));

    return NextResponse.json({
      results: resultados,
      page: datos.page ?? pagina,
      total_pages: datos.total_pages ?? 1,
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudieron cargar las sugerencias" },
      { status: 500 }
    );
  }
}

