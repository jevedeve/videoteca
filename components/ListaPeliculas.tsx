
import type { Pelicula } from "@prisma/client";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { TarjetaPelicula } from "@/components/TarjetaPelicula";

type ListaPeliculasProps = {
  peliculas: Pelicula[];
  tituloVacio: string;
  subtituloVacio: string;
};

export function ListaPeliculas({
  peliculas,
  tituloVacio,
  subtituloVacio,
}: ListaPeliculasProps) {
  if (peliculas.length === 0) {
    return (
      <EstadoVacio
        titulo={tituloVacio}
        subtitulo={subtituloVacio}
      />
    );
  }

  return (
    <div className="grid min-w-0 grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      {peliculas.map((pelicula) => (
        <TarjetaPelicula
          key={pelicula.id}
          pelicula={pelicula}
        />
      ))}
    </div>
  );
}
