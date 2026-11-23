export type OrigenFechaEstreno = "es" | "internacional";

export const MAX_PAGINAS_DISCOVER_ES = 5;
export const MAX_PAGINAS_DISCOVER_INTERNACIONAL = 2;
export const CACHE_REVALIDATE_SEGUNDOS = 6 * 60 * 60;

type PaginaDescubrimiento<T> = {
  results?: T[];
  total_pages?: number;
};

type PeliculaConFecha = {
  id: number;
  release_date?: string | null;
};

export function esFechaISO(fecha: string | null | undefined): fecha is string {
  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return false;
  }

  const fechaUTC = new Date(`${fecha}T00:00:00.000Z`);

  return (
    Number.isFinite(fechaUTC.getTime()) &&
    fechaUTC.toISOString().slice(0, 10) === fecha
  );
}

export function obtenerFechaHoyMadrid(ahora = new Date()): string {
  const partes = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(ahora);
  const obtenerParte = (tipo: string) =>
    partes.find((parte) => parte.type === tipo)?.value;
  const anio = obtenerParte("year");
  const mes = obtenerParte("month");
  const dia = obtenerParte("day");

  if (!anio || !mes || !dia) {
    throw new Error("No se pudo determinar la fecha actual en España");
  }

  return `${anio}-${mes}-${dia}`;
}

export function sumarDoceMeses(fechaISO: string): string {
  if (!esFechaISO(fechaISO)) {
    throw new RangeError("La fecha base no es válida");
  }

  const fecha = new Date(`${fechaISO}T00:00:00.000Z`);
  const mesOriginal = fecha.getUTCMonth();

  fecha.setUTCFullYear(fecha.getUTCFullYear() + 1);
  if (fecha.getUTCMonth() !== mesOriginal) {
    fecha.setUTCDate(0);
  }

  return fecha.toISOString().slice(0, 10);
}

export async function obtenerHastaPaginas<T>(
  obtenerPagina: (pagina: number) => Promise<PaginaDescubrimiento<T>>,
  maxPaginas: number
): Promise<T[]> {
  const primeraPagina = await obtenerPagina(1);
  const resultados = [...(primeraPagina.results ?? [])];
  const totalPaginas =
    Number.isSafeInteger(primeraPagina.total_pages) &&
    (primeraPagina.total_pages ?? 0) > 0
      ? primeraPagina.total_pages!
      : 1;
  const paginas = Math.min(totalPaginas, maxPaginas);

  for (let pagina = 2; pagina <= paginas; pagina += 1) {
    const respuesta = await obtenerPagina(pagina);
    resultados.push(...(respuesta.results ?? []));
  }

  return resultados;
}

export function combinarEstrenosFuturos<T extends PeliculaConFecha>(
  peliculasEspanolas: T[],
  peliculasInternacionales: T[],
  hoy: string,
  limite: string
): Array<T & { origenFecha: OrigenFechaEstreno }> {
  const peliculasPorId = new Map<
    number,
    T & { origenFecha: OrigenFechaEstreno }
  >();

  function agregar(
    peliculas: T[],
    origenFecha: OrigenFechaEstreno
  ) {
    for (const pelicula of peliculas) {
      const fecha = pelicula.release_date ?? null;
      if (
        !Number.isSafeInteger(pelicula.id) ||
        pelicula.id <= 0 ||
        !esFechaISO(fecha) ||
        fecha < hoy ||
        fecha > limite
      ) {
        continue;
      }

      const existente = peliculasPorId.get(pelicula.id);
      if (existente?.origenFecha === "es") {
        continue;
      }

      peliculasPorId.set(pelicula.id, { ...pelicula, origenFecha });
    }
  }

  agregar(peliculasInternacionales, "internacional");
  agregar(peliculasEspanolas, "es");

  return Array.from(peliculasPorId.values()).sort(
    (a, b) =>
      (a.release_date ?? "").localeCompare(b.release_date ?? "") ||
      a.id - b.id
  );
}
