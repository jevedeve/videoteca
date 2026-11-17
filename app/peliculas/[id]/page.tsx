
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { obtenerPeliculaPorId } from "@/lib/peliculas";
import { EnlaceVolver } from "@/components/nav/EnlaceVolver";
import { BotonVista } from "@/components/BotonVista";
import { BotonBorrarPelicula } from "@/components/BotonBorrarPelicula";

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
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
      <EnlaceVolver href="/">Volver</EnlaceVolver>

      <article className="flex flex-col gap-8 rounded-2xl border border-borde bg-superficie p-6 shadow-sm sm:p-10">

        {pelicula.poster && (
          <img
            src={`https://image.tmdb.org/t/p/w500${pelicula.poster}`}
            alt={`Póster de ${pelicula.titulo}`}
            className="w-full max-w-xs self-center rounded-xl shadow-lg"
          />
        )}

        <header className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-texto sm:text-4xl lg:text-5xl">
            {pelicula.titulo}
          </h1>

          <p className="text-sm font-semibold text-principal">
            {pelicula.vista ? "Vista" : "Pendiente"}
          </p>

          <time
            dateTime={pelicula.guardadaEn.toISOString()}
            className="text-sm font-medium tracking-wide text-texto-terciario"
          >
            Guardada el {fechaFormateada}
          </time>
        </header>

        {pelicula.sinopsis && (
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-texto">
              Sinopsis
            </h2>
            <p className="leading-8 text-texto-secundario">
              {pelicula.sinopsis}
            </p>
          </section>
        )}


        {pelicula.comentario ? (
          <p className="whitespace-pre-wrap text-base leading-8 text-texto">
            {pelicula.comentario}
          </p>
        ) : (
          <p className="text-sm italic leading-7 text-texto-terciario">
            Esta película no tiene comentario
          </p>
        )}

        <div className="flex items-center justify-end gap-3 border-t border-borde pt-6">
          <BotonVista
            id={pelicula.id}
            vista={pelicula.vista}
          />

          <BotonBorrarPelicula id={pelicula.id} />
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
