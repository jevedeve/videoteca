export const MAX_PAGINAS_BUSQUEDA_TMDB = 500;

export type CategoriaBusquedaTMDB = "movie" | "tv";

export type ResultadoBusquedaTMDB = {
  id: number;
  title?: string;
  original_title?: string;
  name?: string;
  original_name?: string;
  poster_path?: string | null;
  overview?: string | null;
  release_date?: string;
  first_air_date?: string;
};

export type RespuestaBusquedaTMDB = {
  results: ResultadoBusquedaTMDB[];
  page?: number;
  total_pages?: number;
  total_results?: number;
};

export function normalizarPaginaBusqueda(
  valor: string | string[] | undefined
): number {
  const pagina = Array.isArray(valor) ? valor[0] : valor;
  if (!pagina || !/^\d+$/.test(pagina)) {
    return 1;
  }

  const numero = Number(pagina);
  return Number.isSafeInteger(numero) && numero > 0
    ? Math.min(numero, MAX_PAGINAS_BUSQUEDA_TMDB)
    : 1;
}

export function crearEnlacePaginaBusqueda(
  query: string,
  tipo: string | undefined,
  pagina: number
): string {
  const parametros = new URLSearchParams({
    q: query,
    page: String(pagina),
  });
  if (tipo) {
    parametros.set("tipo", tipo);
  }

  return `/buscar?${parametros.toString()}`;
}

export async function consultarPaginaBusquedaTMDB(
  categoria: CategoriaBusquedaTMDB,
  query: string,
  clave: string,
  idioma: string,
  pagina: number,
  fetcher: typeof fetch = fetch
): Promise<RespuestaBusquedaTMDB> {
  if (
    !Number.isSafeInteger(pagina) ||
    pagina < 1 ||
    pagina > MAX_PAGINAS_BUSQUEDA_TMDB
  ) {
    throw new RangeError("La página de búsqueda no es válida");
  }

  const url = new URL(`https://api.themoviedb.org/3/search/${categoria}`);
  url.searchParams.set("api_key", clave);
  url.searchParams.set("query", query);
  url.searchParams.set("language", idioma);
  url.searchParams.set("page", String(pagina));

  const respuesta = await fetcher(url, {
    next: { revalidate: 3600 },
  });
  if (!respuesta.ok) {
    throw new Error("Error al consultar TMDB");
  }

  return (await respuesta.json()) as RespuestaBusquedaTMDB;
}
