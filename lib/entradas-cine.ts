export const CINES_OFICIALES = [
  {
    nombre: "Yelmo",
    url: "https://www.yelmocines.es/",
  },
  {
    nombre: "Cinesur / MK2",
    url: "https://www.mk2cines.es/es/",
  },
  {
    nombre: "Cinesa",
    url: "https://www.cinesa.es/",
  },
  {
    nombre: "Kinépolis",
    url: "https://kinepolis.es/",
  },
] as const;

export type PreventaConfirmada = {
  tmdbId: number;
  url: string;
  verificadaEn: string;
};

export const PREVENTAS_CONFIRMADAS: readonly PreventaConfirmada[] = [];

export function obtenerPreventaConfirmada(
  tmdbId: number
): PreventaConfirmada | null {
  return (
    PREVENTAS_CONFIRMADAS.find((preventa) => preventa.tmdbId === tmdbId) ??
    null
  );
}
