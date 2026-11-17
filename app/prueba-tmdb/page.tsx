import { buscarPeliculas } from "@/lib/tmdb";

export default async function PruebaTMDB() {
  const datos = await buscarPeliculas("Titanic");
  const pelicula = datos.results[0];

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">{pelicula.title}</h1>

      {pelicula.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`}
          alt={pelicula.title}
          className="mt-4 w-48"
        />
      )}

      <p className="mt-4">{pelicula.overview}</p>
    </main>
  );
}