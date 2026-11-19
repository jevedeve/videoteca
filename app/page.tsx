
import { ListaPeliculas } from "@/components/ListaPeliculas";
import { BuscadorInteligente } from "@/components/BuscadorInteligente";
import { ContadoresVideoteca } from "@/components/ContadoresVideoteca";
import { obtenerPeliculas, obtenerContadores } from "@/lib/peliculas";
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
  const contadores = await obtenerContadores();

  const cantidadPeliculas = peliculas.length;
  const tituloPagina =
  tipoValido === "pelicula"
    ? "Películas por ver"
    : tipoValido === "serie"
      ? "Series por ver"
      : "Mi videoteca";
      <h1 className="text-4xl font-bold tracking-tight text-texto sm:text-5xl">
  {tituloPagina}
</h1>

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
  {tituloPagina}
</h1>

 <BuscadorInteligente />

  <p className="text-sm font-medium tracking-wide text-texto-secundario">
    {textoCantidad}
  </p>
</header>


<ContadoresVideoteca contadores={contadores} />




      <ListaPeliculas
        peliculas={peliculas}
        tituloVacio="Todavía no tienes películas ni series"
        subtituloVacio="Añade tu primera película o serie con el formulario de arriba y aparecerá aquí."
      />
    </main>
  );
}
