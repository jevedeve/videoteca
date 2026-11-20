
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Film } from "lucide-react";
import { obtenerPeliculaPorId } from "@/lib/peliculas";
import { EnlaceVolver } from "@/components/nav/EnlaceVolver";
import { BotonVista } from "@/components/BotonVista";
import { BotonBorrarPelicula } from "@/components/BotonBorrarPelicula";
import { BotonValoracion } from "@/components/BotonValoracion";
import { FormularioComentario } from "@/components/FormularioComentario";

export const dynamic = "force-dynamic";

export default async function PaginaPelicula(
  props: PageProps<"/peliculas/[id]">
) {
  const { id } = await props.params;

  const pelicula = await obtenerPeliculaPorId(id);

  if (!pelicula) {
    notFound();
  }

  const fechaFormateada = pelicula.guardadaEn.toLocaleDateString(
    "es-ES",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:gap-6 sm:px-6 sm:py-10">
      <EnlaceVolver href="/">Volver</EnlaceVolver>

      <article className="relative overflow-hidden rounded-3xl border border-borde bg-superficie shadow-xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-principal/5 blur-3xl"
        />
        <div className="relative grid grid-cols-1 md:grid-cols-5">
          <div className="p-4 sm:p-6 md:col-span-2 md:p-8">
            <div className="relative mx-auto aspect-[2/3] w-full max-w-[240px] overflow-hidden rounded-2xl border border-borde bg-fondo-secundario shadow-xl sm:max-w-xs md:max-w-none">
              {pelicula.poster ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${pelicula.poster}`}
                  alt={`Póster de ${pelicula.titulo}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-fondo-secundario via-superficie to-fondo p-6 text-center">
                  <Film
                    className="h-14 w-14 text-principal/80"
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-texto-terciario">
                    Póster no disponible
                  </span>
                </div>
              )}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-6 p-5 sm:p-7 md:col-span-3 md:border-l md:border-borde md:p-8">
            <header className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-borde-secundario bg-fondo/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-texto-secundario">
                  {pelicula.tipo === "serie" ? "Serie" : "Película"}
                </span>
                <span className="rounded-full border border-principal/30 bg-principal-suave px-3 py-1 text-xs font-semibold text-principal">
                  {pelicula.vista ? "Vista" : "Pendiente"}
                </span>
              </div>

              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-texto sm:text-4xl lg:text-5xl">
                {pelicula.titulo}
              </h1>

              <time
                dateTime={pelicula.guardadaEn.toISOString()}
                className="text-sm font-medium tracking-wide text-texto-terciario"
              >
                Guardada el {fechaFormateada}
              </time>
            </header>

            <section className="flex flex-col gap-2 border-t border-borde pt-5">
              <h2 className="text-lg font-semibold text-texto">
                Sinopsis
              </h2>
              <p className="text-sm leading-7 text-texto-secundario sm:text-base">
                {pelicula.sinopsis || "Sinopsis no disponible."}
              </p>
            </section>

            <section
              aria-label="Acciones de la ficha"
              className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <div className="min-w-0 rounded-xl border border-borde bg-fondo/50 px-3 py-2.5 [&>div]:flex-wrap [&>div]:gap-x-2 [&>div]:gap-y-2 [&>div>select]:min-w-0 [&>div>select]:flex-1">
                <BotonValoracion
                  id={pelicula.id}
                  valoracion={pelicula.valoracion}
                />
              </div>
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <div className="rounded-xl border border-borde bg-fondo/70 [&>button]:min-h-11 [&>button]:min-w-11">
                  <BotonVista
                    id={pelicula.id}
                    vista={pelicula.vista}
                  />
                </div>
                <div className="flex-1 sm:flex-none [&>button]:min-h-11 [&>button]:w-full sm:[&>button]:w-auto">
                  <BotonBorrarPelicula id={pelicula.id} />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-borde bg-fondo/40 p-4 sm:p-5">
              <h2 className="text-lg font-semibold text-texto">
                Tu comentario
              </h2>
              <div className="mt-3 [&_button.bg-blue-600]:min-h-11 [&_button.bg-blue-600]:bg-principal [&_button.bg-blue-600]:text-texto-invertido">
                <FormularioComentario
                  id={pelicula.id}
                  comentario={pelicula.comentario}
                />
              </div>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
}

export async function generateMetadata(
  props: PageProps<"/peliculas/[id]">
): Promise<Metadata> {
  const { id } = await props.params;

  const pelicula = await obtenerPeliculaPorId(id);

  if (!pelicula) {
    return {
      title: "Película no encontrada",
    };
  }

  return {
    title: pelicula.titulo,
  };
}
