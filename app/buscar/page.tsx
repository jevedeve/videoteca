import { BotonAgregarTMDB } from "@/components/BotonAgregarTMDB";
import { BuscadorInteligente } from "@/components/BuscadorInteligente";
import { ContadoresVideoteca } from "@/components/ContadoresVideoteca";
import { obtenerContadores } from "@/lib/peliculas";
import { buscarPeliculas, buscarSeries, buscarTodo } from "@/lib/tmdb";
export default async function Buscar({
  searchParams,
}: {
    searchParams: Promise<{
  q?: string;
  tipo?: string;
}>;
}) {
    const { q, tipo } = await searchParams;
    const contadores = await obtenerContadores();
const datos = q
  ? tipo === "serie"
    ? await buscarSeries(q)
    : tipo === "pelicula"
      ? await buscarPeliculas(q)
      : await buscarTodo(q)
  : null;
  return (
    <main className="p-8">
      <ContadoresVideoteca contadores={contadores} />
     <h1 className="mb-4 text-2xl font-bold">
  {tipo === "serie" ? "Buscar series" : "Buscar películas"}
</h1>
     <BuscadorInteligente />
     <div className="grid grid-cols-2 gap-6 px-2 sm:px-0 md:grid-cols-4">
        {datos?.results?.map((pelicula: {
          id: number;
          title?: string;
          name?: string;   
          poster_path: string | null;
          overview: string;
        }) => (
          <div key={pelicula.id}>
            {pelicula.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w342${pelicula.poster_path}`}
                alt={pelicula.title ?? pelicula.name ?? ""}
                className="rounded"
              />
            )}
            <p className="mt-2 font-semibold">{pelicula.title}</p>

<BotonAgregarTMDB
  tmdbId={pelicula.id}
  tipo={
  tipo === "serie"
    ? "serie"
    : tipo === "pelicula"
      ? "pelicula"
      : pelicula.name
        ? "serie"
        : "pelicula"
}
  titulo={pelicula.title ?? pelicula.name ?? ""}
  poster={pelicula.poster_path}
  sinopsis={pelicula.overview}
/>

          </div>
        ))}
      </div>
    </main>
  );
}