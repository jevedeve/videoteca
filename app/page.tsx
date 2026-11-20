
import { ListaPeliculas } from "@/components/ListaPeliculas";
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

  const textoCantidad =
    cantidadPeliculas === 0
      ? "Sin títulos pendientes"
      : cantidadPeliculas === 1
        ? "1 título pendiente"
        : `${cantidadPeliculas} títulos pendientes`;

  const tituloVacio =
    tipoValido === "pelicula"
      ? "No hay películas por ver"
      : tipoValido === "serie"
        ? "No hay series por ver"
        : "No hay títulos por ver ahora";

  const subtituloVacio =
    tipoValido === "pelicula"
      ? "Cuando añadas películas a tu videoteca, aparecerán aquí."
      : tipoValido === "serie"
        ? "Cuando añadas series a tu videoteca, aparecerán aquí."
        : "Cuando añadas películas o series a tu videoteca, aparecerán aquí.";

  const descripcionPagina =
    tipoValido === "pelicula"
      ? "Tu selección de películas pendientes, lista para tu próxima sesión."
      : tipoValido === "serie"
        ? "Tus series pendientes, reunidas para que siempre sepas qué sigue."
        : "Tu colección personal de cine y series, lista para descubrir tu próxima historia.";

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-7 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10">
      <header className="relative overflow-hidden rounded-2xl border border-borde bg-gradient-to-br from-principal/10 via-superficie to-fondo p-5 shadow-lg sm:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-20 h-52 w-52 rounded-full bg-principal/10 blur-3xl"
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-principal">
              Tu colección personal
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-texto sm:text-4xl">
              {tituloPagina}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-texto-secundario sm:text-base">
              {descripcionPagina}
            </p>
          </div>
          <p className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-borde bg-fondo/70 px-3 py-2 text-sm font-medium text-texto-secundario">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-principal"
            />
            {textoCantidad}
          </p>
        </div>
      </header>

      <ContadoresVideoteca contadores={contadores} />

      <ListaPeliculas
        peliculas={peliculas}
        tituloVacio={tituloVacio}
        subtituloVacio={subtituloVacio}
      />
    </main>
  );
}
