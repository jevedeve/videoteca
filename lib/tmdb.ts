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