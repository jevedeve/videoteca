
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

export function BuscadorInteligente() {
  const [texto, setTexto] = useState("");
  const [resultados, setResultados] = useState<Sugerencia[]>([]);
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const [cargando, setCargando] = useState(false);
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
    if (texto.trim().length < 2) {
      setResultados([]);
      setCargando(false);
      return;
    }

    const controlador = new AbortController();
    setCargando(true);
    setResultados([]);

    const temporizador = setTimeout(async () => {
      try {
        const respuesta = await fetch(
          `/api/sugerencias?q=${encodeURIComponent(texto.trim())}`,
          { signal: controlador.signal }
        );

        if (!respuesta.ok) {
          throw new Error("Error al buscar");
        }

        const datos = await respuesta.json();
        setResultados(datos.results ?? []);
      } catch {
        if (!controlador.signal.aborted) {
          setResultados([]);
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false);
        }
      }
    }, 350);

    return () => {
      clearTimeout(temporizador);
      controlador.abort();
    };
  }, [texto]);

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
            setTexto(e.target.value);
            setAbierto(true);
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
        </div>
      )}
    </div>
  );
}
