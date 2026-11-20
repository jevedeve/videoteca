
import Link from "next/link";
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
    <article className="group flex flex-col gap-5 rounded-2xl border border-borde bg-superficie p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">

      {pelicula.poster && (
        <Link href={`/peliculas/${pelicula.id}`}>
          <img
            src={`https://image.tmdb.org/t/p/w500${pelicula.poster}`}
            alt={`Póster de ${pelicula.titulo}`}
            className="aspect-[2/3] w-full rounded-xl object-cover shadow-md transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl"
          />
        </Link>
      )}

     <span
  className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
    pelicula.tipo === "serie"
     ? "border-purple-500 bg-purple-600/70 text-white"
: "border-blue-500 bg-blue-600/70 text-white"
  }`}
>
  {pelicula.tipo === "serie" ? "📺 Serie" : "🎬 Película"}
</span>
      <div className="flex items-start justify-between gap-4">
        <Link
          href={`/peliculas/${pelicula.id}`}
          className="text-lg font-semibold leading-snug tracking-tight text-texto transition-opacity duration-200 hover:opacity-80 sm:text-xl"
        >
          {pelicula.titulo}
        </Link>

        <BotonVista
          id={pelicula.id}
          vista={pelicula.vista}
        />
      </div>


      <BotonValoracion
  id={pelicula.id}
  valoracion={pelicula.valoracion}
/>



      {pelicula.sinopsis && (
        <p className="line-clamp-3 text-sm leading-6 text-texto-secundario">
          {pelicula.sinopsis}
        </p>
      )}
      {pelicula.tmdbId !== null && (
  <PlataformasStreaming
    tmdbId={pelicula.tmdbId}
    tipo={pelicula.tipo === "serie" ? "serie" : "pelicula"}
  />
)}
{pelicula.tmdbId !== null && (
  <BotonTrailer
    tmdbId={pelicula.tmdbId}
    tipo={pelicula.tipo === "serie" ? "serie" : "pelicula"}
  />
)}


     <FormularioComentario
  id={pelicula.id}
  comentario={pelicula.comentario}
/>

      <div className="flex items-end justify-between gap-4">
        <time
          dateTime={pelicula.guardadaEn.toISOString()}
          className="text-xs font-medium tracking-wide text-texto-terciario"
        >
          {fechaFormateada}
        </time>

        <BotonBorrarPelicula id={pelicula.id} />
      </div>
    </article>
  );
}


