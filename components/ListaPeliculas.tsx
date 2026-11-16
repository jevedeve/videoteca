
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
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {peliculas.map((pelicula) => (
        <TarjetaPelicula
          key={pelicula.id}
          pelicula={pelicula}
        />
      ))}
    </div>
  );
}
