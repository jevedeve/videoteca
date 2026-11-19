import { BotonAgregarTMDB } from "@/components/BotonAgregarTMDB";
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
const datos = q
  ? tipo === "serie"
    ? await buscarSeries(q)
    : tipo === "pelicula"
      ? await buscarPeliculas(q)
      : await buscarTodo(q)
  : null;
  return (
    <main className="p-8">
     <h1 className="mb-4 text-2xl font-bold">
  {tipo === "serie" ? "Buscar series" : "Buscar películas"}
</h1>
      <form className="mb-6">
        <input
  type="hidden"
  name="tipo"
  value={tipo ?? ""}
/>
        <input
          name="q"
          placeholder={
  tipo === "serie"
    ? "Escribe una serie..."
    : "Escribe una película..."
}
          defaultValue={q ?? ""}
          className="rounded border p-2 text-black"
        />
        <button className="ml-2 rounded bg-blue-600 p-2 text-white">
          Buscar
        </button>
      </form>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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