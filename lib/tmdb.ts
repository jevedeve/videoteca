const TMDB_URL = "https://api.themoviedb.org/3";

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