import { Film } from "lucide-react";
import { BotonAgregarTMDB } from "@/components/BotonAgregarTMDB";
import {
  obtenerProximasTemporadas,
  obtenerPeliculasEnCartelera,
  obtenerProximosEstrenos,
  obtenerProximasSeries,
  obtenerSeriesEnEmision,
} from "@/lib/tmdb";
import { obtenerSeriesGuardadasConTmdb } from "@/lib/peliculas";
import { BotonTrailer } from "@/components/BotonTrailer";
import { MenuEntradas } from "@/components/MenuEntradas";
import { obtenerPreventaConfirmada } from "@/lib/entradas-cine";

type ContenidoEstreno = {
  id: string | number;
  tmdbId: number;
  titulo: string;
  fecha: string | null;
  poster: string | null;
  sinopsis: string | null;
  tipo: "pelicula" | "serie";
  numeroTemporada?: number;
  trailerUrl?: string | null;
};

export default async function EstrenosPage({

  searchParams,
}: {
  searchParams: Promise<{ seccion?: string }>;
}) {
  const { seccion } = await searchParams;

  const seriesEnEmision = seccion === "series-en-emision";
  const seriesProximas = seccion === "series-proximas";
  const nuevasTemporadas = seccion === "nuevas-temporadas";
  const esSerie = seriesEnEmision || seriesProximas;
  const proximamente = seccion === "proximamente";
  const enCartelera =
    !seriesEnEmision && !seriesProximas && !nuevasTemporadas && !proximamente;
  const datos = nuevasTemporadas
    ? null
    : seriesEnEmision
      ? await obtenerSeriesEnEmision()
      : seriesProximas
        ? await obtenerProximasSeries()
        : proximamente
          ? await obtenerProximosEstrenos()
          : await obtenerPeliculasEnCartelera();

  let contenidos: ContenidoEstreno[];

  if (nuevasTemporadas) {
    const seriesGuardadas = await obtenerSeriesGuardadasConTmdb();
    const temporadas = await obtenerProximasTemporadas(seriesGuardadas);
    contenidos = temporadas.map((temporada) => ({
      id: `${temporada.tmdbId}:${temporada.numero}`,
      tmdbId: temporada.tmdbId,
      titulo: temporada.tituloSerie,
      fecha: temporada.fechaEstreno,
      poster: temporada.poster,
      sinopsis: temporada.sinopsis,
      tipo: "serie",
      numeroTemporada: temporada.numero,
      trailerUrl: temporada.trailerUrl,
    }));
  } else {
    const resultados = (datos?.results ?? []) as {
      id: number;
      title?: string;
      name?: string;
      release_date?: string;
      first_air_date?: string;
      poster_path: string | null;
      overview?: string | null;
    }[];

    contenidos = resultados.map((contenido) => ({
      id: contenido.id,
      tmdbId: contenido.id,
      titulo: (esSerie ? contenido.name : contenido.title) ?? "",
      fecha: esSerie ? contenido.first_air_date ?? null : contenido.release_date ?? null,
      poster: contenido.poster_path,
      sinopsis: contenido.overview ?? null,
      tipo: esSerie ? "serie" : "pelicula",
    }));
  }

  return (
  <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
    <header className="overflow-hidden rounded-2xl border border-borde bg-gradient-to-br from-principal/10 via-superficie to-fondo p-5 shadow-sm sm:p-7">
      <div className="border-l-4 border-principal pl-4 sm:pl-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-texto sm:text-4xl">
          {nuevasTemporadas
            ? "📺 Nuevas temporadas"
            : seriesProximas
              ? "📅 Próximas series"
              : seriesEnEmision
                ? "📺 Series en emisión"
                : proximamente
                  ? "📅 Próximos estrenos"
                  : "🎟️ En cartelera"}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-texto-secundario sm:text-base">
          {nuevasTemporadas
            ? "Próximas temporadas con fecha confirmada de las series guardadas en tu videoteca."
            : seriesProximas
              ? "Series cuyo primer estreno está previsto para los próximos 90 días según TMDB. La fecha no garantiza disponibilidad en España."
              : seriesEnEmision
                ? "Series con episodios programados durante los próximos siete días según TMDB. Esto no implica disponibilidad en España."
                : proximamente
                  ? "Descubre las películas que llegarán próximamente a los cines."
                  : "Descubre las películas que están actualmente en cartelera."}
        </p>
      </div>
    </header>

    {nuevasTemporadas && contenidos.length === 0 ? (
      <div
        role="status"
        className="mt-8 rounded-2xl border border-borde bg-superficie p-8 text-center shadow-sm"
      >
        <h2 className="text-lg font-semibold text-texto">
          No hay nuevas temporadas anunciadas
        </h2>
        <p className="mt-2 text-sm text-texto-secundario">
          TMDB no registra temporadas con una fecha futura conocida para las series de tu videoteca.
        </p>
      </div>
    ) : (
      <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {contenidos.map((contenido) => {
        const preventa =
          proximamente && contenido.tipo === "pelicula"
            ? obtenerPreventaConfirmada(contenido.tmdbId)
            : null;
        const [anio, mes, dia] = preventa?.verificadaEn.split("-") ?? [];
        const fechaVerificacion =
          anio && mes && dia ? `${dia}/${mes}/${anio}` : preventa?.verificadaEn;

        return (
        <article
          key={contenido.id}
          className="group flex flex-col overflow-hidden rounded-2xl border border-borde bg-superficie p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-borde-fuerte hover:shadow-lg sm:p-5"
        >
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-borde bg-fondo-secundario shadow-md">
            {contenido.poster ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${contenido.poster}`}
                alt={`Póster de ${contenido.titulo}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-fondo-secundario via-superficie to-fondo p-6 text-center">
                <Film
                  className="h-12 w-12 text-principal/80"
                  strokeWidth={1.25}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-texto-terciario">
                  Póster no disponible
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col pt-5">
            <h2 className="text-lg font-bold leading-snug tracking-tight text-texto sm:text-xl">
              {contenido.titulo}
            </h2>

            {contenido.numeroTemporada !== undefined && (
              <p className="mt-1 text-sm font-semibold text-principal">
                Temporada {contenido.numeroTemporada}
              </p>
            )}

            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-texto-terciario">
              {contenido.numeroTemporada !== undefined
                ? "Estreno de temporada: "
                : contenido.tipo === "serie"
                  ? seriesProximas
                    ? "Primer estreno: "
                    : "Primera emisión: "
                  : "Estreno: "}
              {contenido.fecha || "Fecha no disponible"}
            </p>

            <p className="mt-3 line-clamp-3 text-sm leading-6 text-texto-secundario">
              {contenido.sinopsis?.trim() || "Sinopsis no disponible"}
            </p>

            <div className="mt-auto grid grid-cols-1 gap-3 pt-5 sm:grid-cols-2">
              <div className="flex min-w-0 items-stretch [&>button]:mt-0 [&>button]:inline-flex [&>button]:h-full [&>button]:min-h-11 [&>button]:w-full [&>button]:items-center [&>button]:justify-center [&>button]:px-2 [&>button]:text-center [&>button]:leading-tight [&>button]:whitespace-normal">
                {nuevasTemporadas ? (
                  <span className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-borde bg-fondo px-2 py-2 text-center text-sm font-semibold text-texto-secundario">
                    Ya está en tu videoteca
                  </span>
                ) : (
                  <BotonAgregarTMDB
                    tmdbId={contenido.tmdbId}
                    titulo={contenido.titulo}
                    poster={contenido.poster}
                    sinopsis={contenido.sinopsis}
                    tipo={contenido.tipo}
                  />
                )}
              </div>

              <div className="flex min-w-0 items-stretch [&>a]:inline-flex [&>a]:h-full [&>a]:min-h-11 [&>a]:w-full [&>a]:items-center [&>a]:justify-center [&>a]:px-2 [&>a]:text-center [&>a]:leading-tight [&>a]:whitespace-normal">
                <BotonTrailer
                  tmdbId={contenido.tmdbId}
                  tipo={contenido.tipo}
                  trailerUrl={
                    nuevasTemporadas ? contenido.trailerUrl : undefined
                  }
                />
              </div>

              {enCartelera && contenido.tipo === "pelicula" && (
                <MenuEntradas />
              )}

              {preventa && fechaVerificacion && (
                <div className="flex min-w-0 flex-col items-start gap-1 sm:col-span-2">
                  <a
                    href={preventa.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Comprar entradas en preventa para ${contenido.titulo}. Verificada el ${fechaVerificacion}`}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-principal/30 bg-principal px-3 py-2 text-sm font-semibold text-texto-invertido transition-colors hover:bg-principal-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal"
                  >
                    Preventa
                    <span aria-hidden="true">↗</span>
                  </a>
                  <time
                    dateTime={preventa.verificadaEn}
                    className="text-xs text-texto-terciario"
                  >
                    Verificada el {fechaVerificacion}
                  </time>
                </div>
              )}
            </div>
          </div>
        </article>
        );
      })}
      </section>
    )}
    </main>
  );
}