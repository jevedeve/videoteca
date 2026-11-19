
import { obtenerTrailer } from "@/lib/tmdb";

type Props = {
  tmdbId: number;
  tipo: "pelicula" | "serie";
};

export async function BotonTrailer({ tmdbId, tipo }: Props) {
  const url = await obtenerTrailer(tmdbId, tipo);

  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-fit items-center rounded-lg border border-borde px-4 py-2 text-sm font-semibold text-principal hover:bg-fondo"
    >
      ▶ Ver tráiler
    </a>
  );
}