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
  <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
    <header className="overflow-hidden rounded-2xl border border-borde bg-gradient-to-br from-principal/10 via-superficie to-fondo p-5 shadow-sm sm:p-7">
      <div className="border-l-4 border-principal pl-4 sm:pl-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-texto sm:text-4xl">
          {proximamente ? "📅 Próximos estrenos" : "🎟️ En cartelera"}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-texto-secundario sm:text-base">
          {proximamente
            ? "Descubre las películas que llegarán próximamente a los cines."
            : "Descubre las películas que están actualmente en cartelera."}
        </p>
      </div>
    </header>

    <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {peliculas.map((pelicula) => (
        <article
          key={pelicula.id}
          className="group flex flex-col overflow-hidden rounded-2xl border border-borde bg-superficie p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-borde-fuerte hover:shadow-lg sm:p-5"
        >
          {pelicula.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`}
              alt={`Póster de ${pelicula.title}`}
              className="aspect-[2/3] w-full rounded-xl object-cover shadow-md transition-transform duration-300 group-hover:scale-[1.01]"
            />
          )}

          <div className="flex flex-1 flex-col pt-5">
            <h2 className="text-lg font-bold leading-snug tracking-tight text-texto sm:text-xl">
              {pelicula.title}
            </h2>

            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-texto-terciario">
              Estreno: {pelicula.release_date || "Fecha no disponible"}
            </p>

            <p className="mt-3 line-clamp-3 text-sm leading-6 text-texto-secundario">
              {pelicula.overview?.trim() || "Sinopsis no disponible"}
            </p>

            <div className="mt-auto grid grid-cols-1 gap-3 pt-5 sm:grid-cols-2">
              <div className="flex min-w-0 [&>button]:mt-0 [&>button]:inline-flex [&>button]:h-full [&>button]:min-h-11 [&>button]:w-full [&>button]:items-center [&>button]:justify-center [&>button]:px-2 [&>button]:text-center [&>button]:leading-tight [&>button]:whitespace-normal">
                <BotonAgregarTMDB
                  tmdbId={pelicula.id}
                  titulo={pelicula.title}
                  poster={pelicula.poster_path}
                  sinopsis={pelicula.overview || null}
                  tipo="pelicula"
                />
              </div>

              <div className="flex min-w-0 [&>a]:inline-flex [&>a]:h-full [&>a]:min-h-11 [&>a]:w-full [&>a]:items-center [&>a]:justify-center [&>a]:px-2 [&>a]:text-center [&>a]:leading-tight [&>a]:whitespace-normal">
                <BotonTrailer
                  tmdbId={pelicula.id}
                  tipo="pelicula"
                />
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
    </main>
  );
}