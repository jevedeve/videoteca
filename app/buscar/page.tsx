import { Film } from "lucide-react";
import { BotonAgregarTMDB } from "@/components/BotonAgregarTMDB";
import { ContadoresVideoteca } from "@/components/ContadoresVideoteca";
import { obtenerContadores } from "@/lib/peliculas";
import {
  crearEnlacePaginaBusqueda,
  MAX_PAGINAS_BUSQUEDA_TMDB,
  normalizarPaginaBusqueda,
} from "@/lib/tmdb-paginacion";
import { buscarPeliculas, buscarSeries, buscarTodo } from "@/lib/tmdb";

type ResultadoBusqueda = {
  id: number;
  title?: string | null;
  name?: string | null;
  poster_path?: string | null;
  overview?: string | null;
  release_date?: string | null;
  first_air_date?: string | null;
  tipo?: "pelicula" | "serie";
};

export default async function Buscar({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    tipo?: string;
    page?: string | string[];
  }>;
}) {
  const { q, tipo, page: paginaParam } = await searchParams;
  const pagina = normalizarPaginaBusqueda(paginaParam);
  const contadores = await obtenerContadores();
  const datos = q
    ? tipo === "serie"
      ? await buscarSeries(q, pagina)
      : tipo === "pelicula"
        ? await buscarPeliculas(q, pagina)
        : await buscarTodo(q, pagina)
    : null;

  const resultados = (datos?.results ?? []) as ResultadoBusqueda[];
  const totalPaginas = Math.min(
    MAX_PAGINAS_BUSQUEDA_TMDB,
    Math.max(1, datos?.total_pages ?? 1)
  );
  const paginaActual = datos?.page ?? pagina;
  const tituloPagina =
    tipo === "serie"
      ? "Buscar series"
      : tipo === "pelicula"
        ? "Buscar películas"
        : "Buscar películas y series";

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-10">
      <header className="relative overflow-hidden rounded-2xl border border-borde bg-gradient-to-br from-principal/10 via-superficie to-fondo p-5 shadow-lg sm:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-20 h-52 w-52 rounded-full bg-principal/10 blur-3xl"
        />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-principal">
              Explora TMDB
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-texto sm:text-4xl">
              {tituloPagina}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-texto-secundario sm:text-base">
              {q ? (
                <>
                  Resultados para{" "}
                  <span className="font-semibold text-texto">“{q}”</span>
                </>
              ) : (
                "Usa el buscador de la barra superior para encontrar tu próxima historia."
              )}
            </p>
          </div>
          {q && (
            <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-borde bg-fondo/70 px-3 py-2 text-sm font-medium text-texto-secundario">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-principal"
              />
              {resultados.length}{" "}
              {resultados.length === 1 ? "resultado" : "resultados"}
            </span>
          )}
        </div>
      </header>

      <ContadoresVideoteca contadores={contadores} />

      {!q ? (
        <section
          role="status"
          className="flex flex-col items-center gap-4 rounded-2xl border border-borde bg-superficie p-8 text-center shadow-sm sm:p-10"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-principal/25 bg-principal-suave">
            <Film
              className="h-7 w-7 text-principal"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </span>
          <div className="max-w-md">
            <h2 className="text-lg font-semibold text-texto">
              Empieza una búsqueda
            </h2>
            <p className="mt-2 text-sm leading-6 text-texto-secundario">
              Escribe el título de una película o serie en el buscador de la
              navegación para ver resultados.
            </p>
          </div>
        </section>
      ) : resultados.length === 0 ? (
        <section
          role="status"
          className="flex flex-col items-center gap-4 rounded-2xl border border-borde bg-superficie p-8 text-center shadow-sm sm:p-10"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-borde bg-fondo">
            <Film
              className="h-7 w-7 text-texto-terciario"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </span>
          <div className="max-w-md">
            <h2 className="text-lg font-semibold text-texto">
              No encontramos resultados
            </h2>
            <p className="mt-2 text-sm leading-6 text-texto-secundario">
              Prueba con otro título o revisa la búsqueda de “{q}”.
            </p>
          </div>
        </section>
      ) : (
        <section aria-label={`Resultados de búsqueda: ${q}`}>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-texto">
              Resultados
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {resultados.map((resultado) => {
              const esSerie =
                tipo === "serie" ||
                (tipo !== "pelicula" &&
                  (resultado.tipo === "serie" ||
                    (!resultado.title && Boolean(resultado.name))));
              const tipoResultado = esSerie ? "serie" : "pelicula";
              const titulo =
                esSerie
                  ? resultado.name ?? resultado.title ?? "Título sin nombre"
                  : resultado.title ?? resultado.name ?? "Título sin nombre";
              const fecha = esSerie
                ? resultado.first_air_date
                : resultado.release_date;
              const anio = fecha?.slice(0, 4);
              const sinopsis = resultado.overview?.trim();

              return (
                <article
                  key={`${tipoResultado}-${resultado.id}`}
                  className="group flex min-w-0 overflow-hidden rounded-2xl border border-borde bg-superficie shadow-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-borde-fuerte hover:shadow-lg motion-reduce:transition-none lg:flex-col"
                >
                  <div className="relative aspect-[2/3] w-24 shrink-0 self-start overflow-hidden bg-fondo-secundario sm:w-28 lg:w-full">
                    {resultado.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w342${resultado.poster_path}`}
                        alt={`Póster de ${titulo}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-fondo-secundario via-superficie to-fondo px-2 text-center">
                        <Film
                          className="h-7 w-7 text-principal/80 lg:h-10 lg:w-10"
                          strokeWidth={1.25}
                          aria-hidden="true"
                        />
                        <span className="text-[10px] leading-4 text-texto-terciario lg:text-xs">
                          Póster no disponible
                        </span>
                      </div>
                    )}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-principal/30 bg-principal-suave px-2.5 py-1 text-[11px] font-semibold text-principal">
                        {esSerie ? "Serie" : "Película"}
                      </span>
                      {anio && (
                        <span className="text-xs font-medium text-texto-terciario">
                          {anio}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-texto sm:text-base">
                      {titulo}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-texto-secundario sm:text-sm">
                      {sinopsis || "Sinopsis no disponible."}
                    </p>

                    <div className="mt-auto pt-3 [&>button]:mt-0 [&>button]:min-h-11 [&>button]:w-full [&>button]:rounded-xl [&>button]:border [&>button]:border-principal/30 [&>button]:bg-principal [&>button]:px-3 [&>button]:py-2.5 [&>button]:text-sm [&>button]:font-semibold [&>button]:text-texto-invertido [&>button]:transition-colors [&>button]:hover:bg-principal-hover [&>button]:focus-visible:outline-2 [&>button]:focus-visible:outline-offset-2 [&>button]:focus-visible:outline-principal [&>button]:disabled:opacity-60">
                      <BotonAgregarTMDB
                        tmdbId={resultado.id}
                        tipo={tipoResultado}
                        titulo={titulo}
                        poster={resultado.poster_path ?? null}
                        sinopsis={resultado.overview ?? null}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {q && totalPaginas > 1 && (
        <nav
          aria-label="Paginación de resultados"
          className="flex items-center justify-center gap-4"
        >
          {paginaActual > 1 ? (
            <a
              href={crearEnlacePaginaBusqueda(q, tipo, paginaActual - 1)}
              className="rounded-lg border border-borde bg-superficie px-4 py-2 text-sm font-semibold text-texto transition-colors hover:border-principal/50 hover:text-principal"
            >
              Anterior
            </a>
          ) : (
            <span
              aria-disabled="true"
              className="rounded-lg border border-borde bg-superficie px-4 py-2 text-sm font-semibold text-texto-terciario"
            >
              Anterior
            </span>
          )}
          <span className="text-sm text-texto-secundario">
            Página {paginaActual} de {totalPaginas}
          </span>
          {paginaActual < totalPaginas ? (
            <a
              href={crearEnlacePaginaBusqueda(q, tipo, paginaActual + 1)}
              className="rounded-lg border border-borde bg-superficie px-4 py-2 text-sm font-semibold text-texto transition-colors hover:border-principal/50 hover:text-principal"
            >
              Siguiente
            </a>
          ) : (
            <span
              aria-disabled="true"
              className="rounded-lg border border-borde bg-superficie px-4 py-2 text-sm font-semibold text-texto-terciario"
            >
              Siguiente
            </span>
          )}
        </nav>
      )}
    </main>
  );
}
