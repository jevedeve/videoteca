
import { FormularioPelicula } from "@/components/inicio/FormularioPelicula";
import { ListaPeliculas } from "@/components/ListaPeliculas";
import { obtenerPeliculas } from "@/lib/peliculas";

export const dynamic = "force-dynamic";

export default async function InicioPage() {
  const peliculas = await obtenerPeliculas();

  const cantidadPeliculas = peliculas.length;

  const textoCantidad =
    cantidadPeliculas === 0
      ? "Ninguna película todavía"
      : cantidadPeliculas === 1
        ? "1 película"
        : `${cantidadPeliculas} películas`;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:gap-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-texto sm:text-5xl">
          Mi videoteca
        </h1>

        <p className="text-sm font-medium tracking-wide text-texto-secundario">
          {textoCantidad}
        </p>
      </header>

      <FormularioPelicula />

      <ListaPeliculas
        peliculas={peliculas}
        tituloVacio="Todavía no tienes películas"
        subtituloVacio="Añade tu primera película o serie con el formulario de arriba y aparecerá aquí."
      />
    </main>
  );
}
