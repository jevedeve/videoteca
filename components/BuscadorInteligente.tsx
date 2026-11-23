
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Film, Loader2, Search } from "lucide-react";

type Sugerencia = {
  id: number;
  titulo: string;
  poster: string | null;
  anio: string;
  tipo: "pelicula" | "serie";
};

type RespuestaSugerencias = {
  results?: Sugerencia[];
  page?: number;
  total_pages?: number;
};

function combinarSinDuplicados(
  actuales: Sugerencia[],
  nuevas: Sugerencia[]
): Sugerencia[] {
  const ids = new Set(
    actuales.map((item) => `${item.tipo}:${item.id}`)
  );
  const combinadas = [...actuales];

  for (const item of nuevas) {
    const clave = `${item.tipo}:${item.id}`;
    if (!ids.has(clave)) {
      ids.add(clave);
      combinadas.push(item);
    }
  }

  return combinadas;
}

export function BuscadorInteligente() {
  const [texto, setTexto] = useState("");
  const [resultados, setResultados] = useState<Sugerencia[]>([]);
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const [cargando, setCargando] = useState(false);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [hayMas, setHayMas] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const solicitudRef = useRef<AbortController | null>(null);
  const cargandoMasRef = useRef(false);

  async function solicitarSugerencias(
    query: string,
    paginaSolicitada: number,
    signal: AbortSignal
  ): Promise<RespuestaSugerencias> {
    const respuesta = await fetch(
      `/api/sugerencias?q=${encodeURIComponent(query)}&page=${paginaSolicitada}`,
      { signal }
    );

    if (!respuesta.ok) {
      throw new Error("No se pudieron cargar las sugerencias");
    }

    return respuesta.json();
  }

  useEffect(() => {
    function cerrarAlPulsarFuera(evento: PointerEvent) {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(evento.target as Node)
      ) {
        setAbierto(false);
      }
    }

    function cerrarConEscape(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        setAbierto(false);
      }
    }

    document.addEventListener("pointerdown", cerrarAlPulsarFuera);
    document.addEventListener("keydown", cerrarConEscape);

    return () => {
      document.removeEventListener("pointerdown", cerrarAlPulsarFuera);
      document.removeEventListener("keydown", cerrarConEscape);
    };
  }, []);

  useEffect(() => {
    const query = texto.trim();
    solicitudRef.current?.abort();
    cargandoMasRef.current = false;

    if (query.length < 2) {
      return;
    }

    const controlador = new AbortController();
    solicitudRef.current = controlador;

    const temporizador = setTimeout(async () => {
      try {
        const datos = await solicitarSugerencias(
          query,
          1,
          controlador.signal
        );
        if (!controlador.signal.aborted) {
          setResultados(combinarSinDuplicados([], datos.results ?? []));
          const paginaRespuesta = datos.page ?? 1;
          setPagina(paginaRespuesta);
          setHayMas(paginaRespuesta < (datos.total_pages ?? paginaRespuesta));
        }
      } catch {
        if (!controlador.signal.aborted) {
          setError("No se pudieron cargar las sugerencias.");
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false);
          solicitudRef.current = null;
        }
      }
    }, 350);

    return () => {
      clearTimeout(temporizador);
      controlador.abort();
      if (solicitudRef.current === controlador) {
        solicitudRef.current = null;
      }
    };
  }, [texto]);

  async function cargarMas() {
    const query = texto.trim();
    if (
      query.length < 2 ||
      !hayMas ||
      cargando ||
      cargandoMasRef.current
    ) {
      return;
    }

    const controlador = new AbortController();
    solicitudRef.current?.abort();
    solicitudRef.current = controlador;
    cargandoMasRef.current = true;
    setCargandoMas(true);
    setError(null);

    try {
      const datos = await solicitarSugerencias(
        query,
        pagina + 1,
        controlador.signal
      );
      if (!controlador.signal.aborted) {
        setResultados((actuales) =>
          combinarSinDuplicados(actuales, datos.results ?? [])
        );
        const paginaRespuesta = datos.page ?? pagina + 1;
        setPagina(paginaRespuesta);
        setHayMas(paginaRespuesta < (datos.total_pages ?? paginaRespuesta));
      }
    } catch {
      if (!controlador.signal.aborted) {
        setError("No se pudieron cargar más sugerencias.");
      }
    } finally {
      if (!controlador.signal.aborted) {
        cargandoMasRef.current = false;
        setCargandoMas(false);
        solicitudRef.current = null;
      }
    }
  }

  return (
    <div ref={contenedorRef} className="relative my-3 w-full min-w-0">
      <form action="/buscar" className="relative w-full">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-principal">
          <Search className="h-4 w-4" aria-hidden="true" />
        </span>
        <input
          type="search"
          name="q"
          value={texto}
          onChange={(e) => {
            const nuevoTexto = e.target.value;
            setTexto(nuevoTexto);
            setAbierto(true);
            setPagina(1);
            setResultados([]);
            setHayMas(false);
            setError(null);
            setCargando(nuevoTexto.trim().length >= 2);
            solicitudRef.current?.abort();
            cargandoMasRef.current = false;
            setCargandoMas(false);
          }}
          onFocus={() => setAbierto(true)}
          placeholder="Buscar películas o series..."
          aria-label="Buscar películas o series"
          aria-expanded={abierto && texto.trim().length >= 2}
          aria-controls="sugerencias-busqueda"
          autoComplete="off"
          className="min-h-11 w-full min-w-0 rounded-xl border border-borde-secundario bg-fondo/90 py-2.5 pl-10 pr-10 text-sm text-texto shadow-sm transition-colors placeholder:text-texto-terciario focus:border-principal focus:outline-none focus:ring-2 focus:ring-principal/30"
        />
        {cargando && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-principal"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
          </span>
        )}
      </form>
      {abierto && texto.trim().length >= 2 && (
        <div
          id="sugerencias-busqueda"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-borde bg-superficie p-2 shadow-2xl sm:max-h-96"
        >
          {cargando ? (
            <p
              role="status"
              className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm text-texto-secundario"
            >
              <Loader2
                className="h-4 w-4 animate-spin text-principal"
                aria-hidden="true"
              />
              Buscando...
            </p>
          ) : error && resultados.length === 0 ? (
            <p
              role="alert"
              className="rounded-xl px-3 py-3 text-sm text-texto-secundario"
            >
              {error}
            </p>
          ) : resultados.length === 0 ? (
            <p
              role="status"
              className="rounded-xl px-3 py-3 text-sm text-texto-secundario"
            >
              No hay sugerencias
            </p>
          ) : (
            resultados.map((item) => (
              <Link
                key={`${item.tipo}-${item.id}`}
                href={`/buscar?q=${encodeURIComponent(item.titulo)}&tipo=${item.tipo}`}
                className="group flex min-h-16 min-w-0 items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-superficie-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal"
              >
                <span className="flex h-14 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-borde bg-fondo">
                  {item.poster ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${item.poster}`}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Film
                      className="h-5 w-5 text-principal/70"
                      aria-hidden="true"
                    />
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-texto group-hover:text-principal">
                    {item.titulo}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-texto-secundario">
                    {item.tipo === "serie" ? "Serie" : "Película"}
                    {item.anio ? ` · ${item.anio}` : ""}
                  </span>
                </span>
              </Link>
            ))
          )}
          {error && resultados.length > 0 && (
            <p
              role="alert"
              className="rounded-xl px-3 py-2 text-sm text-texto-secundario"
            >
              {error}
            </p>
          )}
          {!cargando && hayMas && (
            <button
              type="button"
              onClick={cargarMas}
              disabled={cargandoMas}
              className="mt-1 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-principal transition-colors hover:bg-superficie-hover disabled:cursor-wait disabled:opacity-70"
            >
              {cargandoMas ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  Cargando...
                </>
              ) : (
                "Ver más"
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
