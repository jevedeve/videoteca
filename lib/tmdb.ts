const TMDB_URL = "https://api.themoviedb.org/3";

type SerieGuardada = {
  tmdbId: number;
  titulo: string;
  poster: string | null;
};

type TemporadaTMDB = {
  season_number: number;
  name: string;
  air_date: string | null;
  poster_path: string | null;
  overview: string | null;
};

type DetallesSerieTMDB = {
  name?: string;
  poster_path: string | null;
  overview: string | null;
  seasons?: TemporadaTMDB[];
};

export type TemporadaFutura = {
  tmdbId: number;
  tituloSerie: string;
  numero: number;
  fechaEstreno: string;
  poster: string | null;
  sinopsis: string | null;
  trailerUrl: string | null;
};

function esFechaISO(fecha: string | null): fecha is string {
  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return false;
  }

  const fechaUTC = new Date(`${fecha}T00:00:00.000Z`);

  return (
    Number.isFinite(fechaUTC.getTime()) &&
    fechaUTC.toISOString().slice(0, 10) === fecha
  );
}

function sumarDoceMeses(fechaISO: string): string {
  const fecha = new Date(`${fechaISO}T00:00:00.000Z`);
  const mesOriginal = fecha.getUTCMonth();

  fecha.setUTCFullYear(fecha.getUTCFullYear() + 1);
  if (fecha.getUTCMonth() !== mesOriginal) {
    fecha.setUTCDate(0);
  }

  return fecha.toISOString().slice(0, 10);
}

async function obtenerDetallesSerie(tmdbId: number, clave: string) {
  const url = new URL(`${TMDB_URL}/tv/${tmdbId}`);
  url.searchParams.set("api_key", clave);
  url.searchParams.set("language", "es-ES");

  const respuesta = await fetch(url, {
    next: { revalidate: 21600 },
  });

  if (!respuesta.ok) {
    throw new Error(`Error al consultar la serie ${tmdbId} en TMDB`);
  }

  return (await respuesta.json()) as DetallesSerieTMDB;
}

async function mapConcurrenciaLimitada<T, R>(
  elementos: T[],
  limite: number,
  transformar: (elemento: T) => Promise<R>
): Promise<R[]> {
  const resultados = new Array<R>(elementos.length);
  let siguienteIndice = 0;

  const trabajadores = Array.from(
    { length: Math.min(limite, elementos.length) },
    async () => {
      while (siguienteIndice < elementos.length) {
        const indice = siguienteIndice++;
        resultados[indice] = await transformar(elementos[indice]);
      }
    }
  );

  await Promise.all(trabajadores);
  return resultados;
}

export async function buscarPeliculas(titulo: string) {
  const clave = process.env.TMDB_API_KEY;

  if (!clave) {
    throw new Error("Falta la clave API de TMDB");
  }

  const url = new URL(`${TMDB_URL}/search/movie`);
  url.searchParams.set("api_key", clave);
  url.searchParams.set("query", titulo);
  url.searchParams.set("language", "es-ES");

  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error("Error al consultar TMDB");
  }

  return respuesta.json();
}

export async function buscarSeries(titulo: string) {
  const clave = process.env.TMDB_API_KEY;

  if (!clave) {
    throw new Error("Falta la clave API de TMDB");
  }

  const url = new URL(`${TMDB_URL}/search/tv`);
  url.searchParams.set("api_key", clave);
  url.searchParams.set("query", titulo);
  url.searchParams.set("language", "es-ES");

  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error("Error al consultar TMDB");
  }

  return respuesta.json();
}

export async function buscarTodo(titulo: string) {
  const [peliculas, series] = await Promise.all([
    buscarPeliculas(titulo),
    buscarSeries(titulo),
  ]);

  return {
    results: [
      ...(peliculas.results ?? []).map(
        (item: { id: number }) => ({
          ...item,
          tipo: "pelicula",
        })
      ),
      ...(series.results ?? []).map(
        (item: { id: number }) => ({
          ...item,
          tipo: "serie",
        })
      ),
    ],
  };
}
export async function obtenerPlataformas(
  tmdbId: number,
  tipo: "pelicula" | "serie"
) {
  const clave = process.env.TMDB_API_KEY;

  if (!clave) {
    throw new Error("Falta la clave API de TMDB");
  }

  const categoria = tipo === "serie" ? "tv" : "movie";

  const url = new URL(
    `${TMDB_URL}/${categoria}/${tmdbId}/watch/providers`
  );

  url.searchParams.set("api_key", clave);

  const respuesta = await fetch(url, {
    next: { revalidate: 86400 },
  });

  if (!respuesta.ok) {
    throw new Error("Error al consultar las plataformas");
  }

  const datos = await respuesta.json();

  return datos.results?.ES ?? null;
}
export async function obtenerTrailer(
  tmdbId: number,
  tipo: "pelicula" | "serie"
): Promise<string | null> {
  const clave = process.env.TMDB_API_KEY;
  if (!clave) return null;

  const categoria = tipo === "serie" ? "tv" : "movie";

  for (const idioma of ["es-ES", "en-US"]) {
    const url = new URL(
      `${TMDB_URL}/${categoria}/${tmdbId}/videos`
    );

    url.searchParams.set("api_key", clave);
    url.searchParams.set("language", idioma);

    const respuesta = await fetch(url, {
      next: { revalidate: 86400 },
    });

    if (!respuesta.ok) continue;

    const datos = await respuesta.json();

    const trailers = (datos.results ?? []).filter(
      (video: {
        site: string;
        type: string;
        key: string;
      }) =>
        video.site === "YouTube" &&
        video.type === "Trailer" &&
        video.key
    );

    const trailer =
      trailers.find(
        (video: { official?: boolean }) =>
          video.official === true
      ) ?? trailers[0];

    if (trailer) {
      return `https://www.youtube.com/watch?v=${encodeURIComponent(trailer.key)}`;
    }
  }

  return null;
}
export async function obtenerPeliculasEnCartelera() {
  const clave = process.env.TMDB_API_KEY;

  if (!clave) {
    throw new Error("Falta la clave API de TMDB");
  }

  const url = new URL(`${TMDB_URL}/movie/now_playing`);

  url.searchParams.set("api_key", clave);
  url.searchParams.set("language", "es-ES");
  url.searchParams.set("region", "ES");
  url.searchParams.set("page", "1");

  const respuesta = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!respuesta.ok) {
    throw new Error("Error al consultar la cartelera");
  }

  return respuesta.json();
}
export async function obtenerProximosEstrenos() {
  const clave = process.env.TMDB_API_KEY;

  if (!clave) {
    throw new Error("Falta la clave API de TMDB");
  }

  const url = new URL(`${TMDB_URL}/movie/upcoming`);

  url.searchParams.set("api_key", clave);
  url.searchParams.set("language", "es-ES");
  url.searchParams.set("region", "ES");
  url.searchParams.set("page", "1");

  const respuesta = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!respuesta.ok) {
    throw new Error("Error al consultar los próximos estrenos");
  }

  return respuesta.json();
}

export async function obtenerSeriesEnEmision() {
  const clave = process.env.TMDB_API_KEY;

  if (!clave) {
    throw new Error("Falta la clave API de TMDB");
  }

  const url = new URL(`${TMDB_URL}/tv/on_the_air`);

  url.searchParams.set("api_key", clave);
  url.searchParams.set("language", "es-ES");
  url.searchParams.set("page", "1");

  const respuesta = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!respuesta.ok) {
    throw new Error("Error al consultar las series en emisión");
  }

  return respuesta.json();
}

export async function obtenerProximasSeries() {
  const clave = process.env.TMDB_API_KEY;

  if (!clave) {
    throw new Error("Falta la clave API de TMDB");
  }

  const hoy = new Date();
  const fechaLimite = new Date(hoy.getTime());
  fechaLimite.setUTCDate(fechaLimite.getUTCDate() + 90);

  const url = new URL(`${TMDB_URL}/discover/tv`);

  url.searchParams.set("api_key", clave);
  url.searchParams.set("language", "es-ES");
  url.searchParams.set("first_air_date.gte", hoy.toISOString().slice(0, 10));
  url.searchParams.set(
    "first_air_date.lte",
    fechaLimite.toISOString().slice(0, 10)
  );
  url.searchParams.set("sort_by", "first_air_date.asc");
  url.searchParams.set("page", "1");

  const respuesta = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!respuesta.ok) {
    throw new Error("Error al consultar las próximas series");
  }

  return respuesta.json();
}

export async function obtenerProximasTemporadas(
  series: SerieGuardada[]
): Promise<TemporadaFutura[]> {
  const seriesUnicas = Array.from(
    new Map(series.map((serie) => [serie.tmdbId, serie])).values()
  );

  if (seriesUnicas.length === 0) {
    return [];
  }

  const clave = process.env.TMDB_API_KEY;
  if (!clave) {
    throw new Error("Falta la clave API de TMDB");
  }

  const hoy = new Date().toISOString().slice(0, 10);
  const limite = sumarDoceMeses(hoy);
  const detalles = await mapConcurrenciaLimitada(
    seriesUnicas,
    4,
    async (serie) => ({
      serie,
      detalles: await obtenerDetallesSerie(serie.tmdbId, clave),
    })
  );

  const temporadasUnicas = new Map<string, TemporadaFutura>();

  for (const { serie, detalles: detalleSerie } of detalles) {
    for (const temporada of detalleSerie.seasons ?? []) {
      const fechaEstreno = temporada.air_date;

      if (
        !Number.isInteger(temporada.season_number) ||
        temporada.season_number <= 0 ||
        !esFechaISO(fechaEstreno) ||
        fechaEstreno <= hoy ||
        fechaEstreno > limite
      ) {
        continue;
      }

      const idTemporada = `${serie.tmdbId}:${temporada.season_number}`;
      if (!temporadasUnicas.has(idTemporada)) {
        temporadasUnicas.set(idTemporada, {
          tmdbId: serie.tmdbId,
          tituloSerie: detalleSerie.name || serie.titulo,
          numero: temporada.season_number,
          fechaEstreno,
          poster:
            temporada.poster_path ||
            detalleSerie.poster_path ||
            serie.poster,
          sinopsis: temporada.overview || detalleSerie.overview || null,
          trailerUrl: null,
        });
      }
    }
  }

  const temporadas = Array.from(temporadasUnicas.values());
  const idsSeries = Array.from(
    new Set(temporadas.map((temporada) => temporada.tmdbId))
  );
  const trailers = await mapConcurrenciaLimitada(
    idsSeries,
    4,
    async (tmdbId) => ({
      tmdbId,
      url: await obtenerTrailer(tmdbId, "serie"),
    })
  );
  const trailersPorSerie = new Map(
    trailers.map(({ tmdbId, url }) => [tmdbId, url])
  );

  return temporadas
    .map((temporada) => ({
      ...temporada,
      trailerUrl: trailersPorSerie.get(temporada.tmdbId) ?? null,
    }))
    .sort(
    (a, b) =>
      a.fechaEstreno.localeCompare(b.fechaEstreno) ||
      a.tituloSerie.localeCompare(b.tituloSerie)
    );
}