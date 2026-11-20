
import { prisma } from "@/lib/prisma";
import type { Pelicula } from "@prisma/client";

/**
 * Obtiene todas las películas.
 * Primero muestra las pendientes y después las vistas.
 * Dentro de cada grupo, las más recientes aparecen primero.
 */
export async function obtenerPeliculas(
  tipo?: "pelicula" | "serie"
): Promise<Pelicula[]> {
  return await prisma.pelicula.findMany({
    where: {
  vista: false,
  ...(tipo ? { tipo } : {}),
},
    orderBy: [
      { vista: "asc" },
      { guardadaEn: "desc" },
    ],
  });
}

/**
 * Obtiene únicamente las películas marcadas como vistas.
 * Las más recientes aparecen primero.
 */
export async function obtenerPeliculasVistas(
  tipo?: "pelicula" | "serie"
): Promise<Pelicula[]> {
  return await prisma.pelicula.findMany({
    where: {
      vista: true,
      ...(tipo ? { tipo } : {}),
    },
    orderBy: { guardadaEn: "desc" },
  });
}

export async function obtenerSeriesGuardadasConTmdb() {
  const series = await prisma.pelicula.findMany({
    where: {
      tipo: "serie",
      tmdbId: { not: null },
    },
    select: {
      tmdbId: true,
      titulo: true,
      poster: true,
    },
  });

  return series.flatMap((serie) =>
    serie.tmdbId === null
      ? []
      : [{ tmdbId: serie.tmdbId, titulo: serie.titulo, poster: serie.poster }]
  );
}

/**
 * Obtiene una película por su identificador.
 * Devuelve null si no existe.
 */
export async function obtenerPeliculaPorId(
  id: string
): Promise<Pelicula | null> {
  return await prisma.pelicula.findUnique({
    where: {
      id,
    },
  });
}

export async function obtenerContadores() {
  const [
    peliculasVistas,
    peliculasPorVer,
    seriesVistas,
    seriesPorVer,
  ] = await Promise.all([
    prisma.pelicula.count({
      where: { tipo: "pelicula", vista: true },
    }),
    prisma.pelicula.count({
      where: { tipo: "pelicula", vista: false },
    }),
    prisma.pelicula.count({
      where: { tipo: "serie", vista: true },
    }),
    prisma.pelicula.count({
      where: { tipo: "serie", vista: false },
    }),
  ]);

  return {
    peliculasVistas,
    peliculasPorVer,
    seriesVistas,
    seriesPorVer,
  };
}
