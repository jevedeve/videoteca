
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
          className="flex flex-col items-center gap-1 rounded-xl border border-borde bg-superficie px-3 py-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <span className="text-xl" aria-hidden="true">
            {contador.icono}
          </span>
          <span className="text-2xl font-bold text-texto">
            {contador.cantidad}
          </span>
          <span className="text-xs font-medium text-texto-secundario sm:text-sm">
            {contador.titulo}
          </span>
        </Link>
      ))}
    </section>
  );
}
