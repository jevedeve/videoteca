
import Link from "next/link";
import { Film } from "lucide-react";
import type { Pelicula } from "@prisma/client";
import { BotonVista } from "@/components/BotonVista";
import { BotonBorrarPelicula } from "@/components/BotonBorrarPelicula";
import { FormularioComentario } from "@/components/FormularioComentario";
import { BotonValoracion } from "@/components/BotonValoracion";
import { PlataformasStreaming } from "@/components/PlataformasStreaming";
import { BotonTrailer } from "@/components/BotonTrailer";

type TarjetaPeliculaProps = {
  pelicula: Pelicula;
};

export function TarjetaPelicula({
  pelicula,
}: TarjetaPeliculaProps) {
  const fechaFormateada = pelicula.guardadaEn.toLocaleDateString(
    "es-ES",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-borde bg-superficie p-4 shadow-md transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-borde-fuerte hover:shadow-xl motion-reduce:transition-none sm:p-5">
      <Link
        href={`/peliculas/${pelicula.id}`}
        aria-label={`Ver detalles de ${pelicula.titulo}`}
        className="relative block aspect-[2/3] w-full overflow-hidden rounded-xl border border-borde bg-fondo-secundario focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal"
      >
        {pelicula.poster ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${pelicula.poster}`}
            alt={`Póster de ${pelicula.titulo}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
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

        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-start bg-gradient-to-b from-black/60 to-transparent p-3">
          <span className="rounded-full border border-principal/40 bg-fondo/85 px-3 py-1 text-xs font-semibold text-principal shadow-sm backdrop-blur-sm">
            {pelicula.tipo === "serie" ? "📺 Serie" : "🎬 Película"}
          </span>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-4 pt-4 sm:pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-texto-terciario">
              {pelicula.vista ? "Vista" : "Pendiente"}
            </p>
            <h2 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-texto sm:text-xl">
              <Link
                href={`/peliculas/${pelicula.id}`}
                className="transition-colors hover:text-principal"
              >
                {pelicula.titulo}
              </Link>
            </h2>
          </div>
          <div className="shrink-0 rounded-xl border border-borde bg-fondo/70 [&>button]:min-h-11 [&>button]:min-w-11">
            <BotonVista id={pelicula.id} vista={pelicula.vista} />
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-borde bg-fondo/50 px-3 py-2.5 [&>div]:flex-wrap [&>div]:gap-x-2 [&>div]:gap-y-2 [&>div>select]:min-w-0 [&>div>select]:flex-1">
          <BotonValoracion
            id={pelicula.id}
            valoracion={pelicula.valoracion}
          />
        </div>

        {pelicula.sinopsis && (
          <p className="line-clamp-3 text-sm leading-6 text-texto-secundario">
            {pelicula.sinopsis}
          </p>
        )}

        {pelicula.tmdbId !== null && (
          <div className="min-w-0">
            <PlataformasStreaming
              tmdbId={pelicula.tmdbId}
              tipo={pelicula.tipo === "serie" ? "serie" : "pelicula"}
            />
          </div>
        )}

        {pelicula.tmdbId !== null && (
          <div className="flex flex-wrap items-center gap-2 [&>a]:min-h-11 [&>a]:flex-1 [&>a]:justify-center sm:[&>a]:flex-none">
            <BotonTrailer
              tmdbId={pelicula.tmdbId}
              tipo={pelicula.tipo === "serie" ? "serie" : "pelicula"}
            />
          </div>
        )}

        <div className="rounded-xl border border-borde bg-fondo/50 p-3 [&_button.bg-blue-600]:min-h-11 [&_button.bg-blue-600]:bg-principal [&_button.bg-blue-600]:text-texto-invertido">
          <FormularioComentario
            id={pelicula.id}
            comentario={pelicula.comentario}
          />
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t border-borde pt-4 sm:flex-row sm:items-center sm:justify-between">
          <time
            dateTime={pelicula.guardadaEn.toISOString()}
            className="text-xs font-medium tracking-wide text-texto-terciario"
          >
            {fechaFormateada}
          </time>
          <div className="self-stretch sm:self-auto [&>button]:min-h-11 [&>button]:w-full sm:[&>button]:w-auto">
            <BotonBorrarPelicula id={pelicula.id} />
          </div>
        </div>
      </div>
    </article>
  );
}


