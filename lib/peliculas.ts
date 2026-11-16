
import { prisma } from "@/lib/prisma";
import type { Pelicula } from "@prisma/client";

/**
 * Obtiene todas las películas.
 * Primero muestra las pendientes y después las vistas.
 * Dentro de cada grupo, las más recientes aparecen primero.
 */
export async function obtenerPeliculas(): Promise<Pelicula[]> {
  return await prisma.pelicula.findMany({
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
export async function obtenerPeliculasVistas(): Promise<Pelicula[]> {
  return await prisma.pelicula.findMany({
    where: {
      vista: true,
    },
    orderBy: {
      guardadaEn: "desc",
    },
  });
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
