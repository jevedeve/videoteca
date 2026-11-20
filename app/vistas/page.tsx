
import type { Metadata } from "next";
import Link from "next/link";
import { ListaPeliculas } from "@/components/ListaPeliculas";
import { obtenerPeliculasVistas, obtenerContadores } from "@/lib/peliculas";
import { ContadoresVideoteca } from "@/components/ContadoresVideoteca";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vistas",
};

export default async function VistasPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { tipo } = await searchParams;
  const tipoValido =
    tipo === "pelicula" || tipo === "serie" ? tipo : undefined;

  const peliculas = await obtenerPeliculasVistas(tipoValido);
  const contadores = await obtenerContadores();
  const cantidadPeliculas = peliculas.length;

  const tituloPagina =
    tipoValido === "pelicula"
      ? "Películas vistas"
      : tipoValido === "serie"
        ? "Series vistas"
        : "Películas y series vistas";

  const textoCantidad =
    tipoValido === "pelicula"
      ? cantidadPeliculas === 0
        ? "Sin películas vistas"
        : `${cantidadPeliculas} ${cantidadPeliculas === 1 ? "película vista" : "películas vistas"}`
      : tipoValido === "serie"
        ? cantidadPeliculas === 0
          ? "Sin series vistas"
          : `${cantidadPeliculas} ${cantidadPeliculas === 1 ? "serie vista" : "series vistas"}`
        : cantidadPeliculas === 0
          ? "Sin títulos vistos"
          : `${cantidadPeliculas} ${cantidadPeliculas === 1 ? "título visto" : "títulos vistos"}`;

  const tituloVacio =
    tipoValido === "pelicula"
      ? "Aún no has visto películas"
      : tipoValido === "serie"
        ? "Aún no has visto series"
        : "Aún no has visto películas ni series";

  const subtituloVacio =
    tipoValido === "pelicula"
      ? "Cuando marques una película como vista, aparecerá aquí."
      : tipoValido === "serie"
        ? "Cuando marques una serie como vista, aparecerá aquí."
        : "Cuando marques una película o serie como vista, aparecerá aquí.";

  const descripcionPagina =
    tipoValido === "pelicula"
      ? "Un recorrido por las películas que ya forman parte de tu historia."
      : tipoValido === "serie"
        ? "Las series que has terminado o estás disfrutando."
        : "Tu colección de películas y series ya vistas.";

  const filtros = [
    { nombre: "Todo", href: "/vistas", activo: !tipoValido },
    {
      nombre: "Películas",
      href: "/vistas?tipo=pelicula",
      activo: tipoValido === "pelicula",
    },
    {
      nombre: "Series",
      href: "/vistas?tipo=serie",
      activo: tipoValido === "serie",
    },
  ];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10">
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
          <p className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-principal/30 bg-principal-suave px-3 py-2 text-sm font-semibold text-principal">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-principal"
            />
            {textoCantidad}
          </p>
        </div>
      </header>

      <nav
        aria-label="Filtrar títulos vistos"
        className="flex flex-wrap gap-2"
      >
        {filtros.map((filtro) => (
          <Link
            key={filtro.nombre}
            href={filtro.href}
            aria-current={filtro.activo ? "page" : undefined}
            className={`inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal ${
              filtro.activo
                ? "border-principal bg-principal text-texto-invertido shadow-sm"
                : "border-borde bg-superficie text-texto-secundario hover:border-principal/50 hover:bg-superficie-hover hover:text-principal"
            }`}
          >
            {filtro.nombre}
          </Link>
        ))}
      </nav>

      <ContadoresVideoteca contadores={contadores} />

      <ListaPeliculas
        peliculas={peliculas}
        tituloVacio={tituloVacio}
        subtituloVacio={subtituloVacio}
      />
    </main>
  );
}
