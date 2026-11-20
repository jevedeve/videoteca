import { BotonAgregarTMDB } from "@/components/BotonAgregarTMDB";
import {
  obtenerPeliculasEnCartelera,
  obtenerProximosEstrenos,
} from "@/lib/tmdb";
import { BotonTrailer } from "@/components/BotonTrailer";

export default async function EstrenosPage({

  searchParams,
}: {
  searchParams: Promise<{ seccion?: string }>;
}) {
  const { seccion } = await searchParams;

  const proximamente = seccion === "proximamente";
 const datos = proximamente
  ? await obtenerProximosEstrenos()
  : await obtenerPeliculasEnCartelera();

const peliculas = (datos?.results ?? []) as {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
   overview: string;
}[];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="border-l-4 border-blue-500 pl-4 text-4xl font-extrabold text-texto">
        {proximamente ? "📅 Próximos estrenos" : "🎟️ En cartelera"}
      </h1>

      <p className="mt-4 text-texto-secundario">
        {proximamente
          ? "Descubre las películas que llegarán próximamente a los cines."
          : "Descubre las películas que están actualmente en cartelera."}
      </p>
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {peliculas.map((pelicula) => (
    <article
      key={pelicula.id}
      className="rounded-2xl border border-borde bg-superficie p-5 shadow-sm"
    >
        {pelicula.poster_path && (
  <img
    src={`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`}
    alt={`Póster de ${pelicula.title}`}
    className="mb-4 aspect-[2/3] w-full rounded-xl object-cover shadow-md transition-transform duration-300 hover:scale-[1.02]"
  />
)}
      <h2 className="font-semibold text-texto">
        {pelicula.title}
      </h2>

      <p className="mt-2 text-sm text-texto-secundario">
        Estreno: {pelicula.release_date || "Fecha no disponible"}
      </p>
  <div className="mt-4 flex flex-wrap items-center gap-3">
  <BotonAgregarTMDB
    tmdbId={pelicula.id}
    titulo={pelicula.title}
    poster={pelicula.poster_path}
    sinopsis={pelicula.overview || null}
    tipo="pelicula"
  />

  <BotonTrailer
    tmdbId={pelicula.id}
    tipo="pelicula"
  />
</div>
    </article>
  ))}
</section>
    </main>
  );
}