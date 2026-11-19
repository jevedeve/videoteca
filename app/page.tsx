
import { ListaPeliculas } from "@/components/ListaPeliculas";
import { obtenerPeliculas } from "@/lib/peliculas";

export const dynamic = "force-dynamic";

export default async function InicioPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { tipo } = await searchParams;
  const tipoValido =
    tipo === "pelicula" || tipo === "serie" ? tipo : undefined;
  const peliculas = await obtenerPeliculas(tipoValido);

  const cantidadPeliculas = peliculas.length;

  const textoCantidad =
  cantidadPeliculas === 0
    ? "Ningún contenido todavía"
    : cantidadPeliculas === 1
      ? "1 película o serie"
      : `${cantidadPeliculas} películas y series`;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:gap-12">
     <header className="flex flex-col gap-2">
  <h1 className="text-4xl font-bold tracking-tight text-texto sm:text-5xl">
    Mi videoteca
  </h1>

  <form action="/buscar" className="mt-4 flex gap-2">
    <input
      type="search"
      name="q"
      placeholder="Buscar películas o series..."
      aria-label="Buscar películas o series"
      className="min-w-0 flex-1 rounded-lg border border-borde bg-transparent px-4 py-3 text-texto"
    />
    <button
      type="submit"
      className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white"
    >
      Buscar
    </button>
  </form>

  <p className="text-sm font-medium tracking-wide text-texto-secundario">
    {textoCantidad}
  </p>
</header>


      <ListaPeliculas
        peliculas={peliculas}
        tituloVacio="Todavía no tienes películas ni series"
        subtituloVacio="Añade tu primera película o serie con el formulario de arriba y aparecerá aquí."
      />
    </main>
  );
}
