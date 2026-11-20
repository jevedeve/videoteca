
import Link from "next/link";

type Contadores = {
  peliculasVistas: number;
  peliculasPorVer: number;
  seriesVistas: number;
  seriesPorVer: number;
};

export function ContadoresVideoteca({
  contadores,
}: {
  contadores: Contadores;
}) {
  const elementos = [
    {
      titulo: "Películas vistas",
      cantidad: contadores.peliculasVistas,
      icono: "🎬",
      href: "/vistas?tipo=pelicula",
    },
    {
      titulo: "Películas por ver",
      cantidad: contadores.peliculasPorVer,
      icono: "🍿",
      href: "/?tipo=pelicula",
    },
    {
      titulo: "Series vistas",
      cantidad: contadores.seriesVistas,
      icono: "📺",
      href: "/vistas?tipo=serie",
    },
    {
      titulo: "Series por ver",
      cantidad: contadores.seriesPorVer,
      icono: "⏳",
      href: "/?tipo=serie",
    },
  ];

  return (
    <section
      aria-label="Estadísticas de mi videoteca"
      className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
    >
      {elementos.map((contador) => (
        <Link
          key={contador.titulo}
          href={contador.href}
          className="group flex min-h-28 min-w-0 flex-col justify-between rounded-2xl border border-borde bg-gradient-to-br from-superficie to-fondo p-4 text-left shadow-sm transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-principal/50 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal motion-reduce:transition-none"
        >
          <div className="flex items-start justify-between gap-2">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-borde bg-fondo text-xl"
              aria-hidden="true"
            >
              {contador.icono}
            </span>
            <span className="text-3xl font-bold tabular-nums tracking-tight text-principal">
              {contador.cantidad}
            </span>
          </div>
          <span className="mt-3 text-xs font-medium leading-snug text-texto-secundario sm:text-sm">
            {contador.titulo}
          </span>
        </Link>
      ))}
    </section>
  );
}
