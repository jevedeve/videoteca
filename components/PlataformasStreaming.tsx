import { obtenerPlataformas } from "@/lib/tmdb";

type Props = {
  tmdbId: number;
  tipo: "pelicula" | "serie";
};

type Plataforma = {
  provider_id: number;
  provider_name: string;
  logo_path: string;
};

export async function PlataformasStreaming({ tmdbId, tipo }: Props) {
  let plataformas: Plataforma[] = [];
  let enlace: string | null = null;
  try {
    const datos = await obtenerPlataformas(tmdbId, tipo);
plataformas = datos?.flatrate ?? [];
enlace = datos?.link ?? null;
  } catch {
    return null;
  }

  if (plataformas.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-texto">
        📺 Disponible en streaming
      </p>

      <div className="flex flex-wrap gap-2">
        
{plataformas.map((plataforma) =>
  enlace ? (
    <a
      key={plataforma.provider_id}
      href={enlace}
      target="_blank"
      rel="noopener noreferrer"
      title={`Consultar dónde ver en ${plataforma.provider_name}`}
      aria-label={`Consultar dónde ver en ${plataforma.provider_name}`}
      className="rounded-lg transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <img
        src={`https://image.tmdb.org/t/p/w92${plataforma.logo_path}`}
        alt={plataforma.provider_name}
        className="h-10 w-10 rounded-lg object-contain"
      />
    </a>
  ) : (
    <img
      key={plataforma.provider_id}
      src={`https://image.tmdb.org/t/p/w92${plataforma.logo_path}`}
      alt={plataforma.provider_name}
      title={plataforma.provider_name}
      className="h-10 w-10 rounded-lg object-contain"
    />
  )
)}

      </div>
    </div>
  );
}