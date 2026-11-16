
import type { Metadata } from "next";
import { ListaPeliculas } from "@/components/ListaPeliculas";
import { obtenerPeliculasVistas } from "@/lib/peliculas";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vistas",
};

export default async function VistasPage() {
  const peliculas = await obtenerPeliculasVistas();

  const cantidadPeliculas = peliculas.length;

  const textoCantidad =
    cantidadPeliculas === 0
      ? "Ninguna película vista todavía"
      : cantidadPeliculas === 1
        ? "1 película vista"
        : `${cantidadPeliculas} películas vistas`;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:gap-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-texto sm:text-5xl">
          Películas vistas
        </h1>

        <p className="text-sm font-medium tracking-wide text-texto-secundario">
          {textoCantidad}
        </p>
      </header>

      <ListaPeliculas
        peliculas={peliculas}
        tituloVacio="Todavía no has visto ninguna película"
        subtituloVacio="Marca una película como vista para que aparezca aquí."
      />
    </main>
  );
}
