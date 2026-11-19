
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
  const [cargando, setCargando] = useState(false);

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
    <div className="relative my-4">
      <form action="/buscar" className="flex gap-2">
        <input
          type="search"
          name="q"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Buscar películas o series..."
          aria-label="Buscar películas o series"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-lg border border-borde bg-transparent px-4 py-3 text-texto"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white"
        >
          Buscar
        </button>
      </form>

      {texto.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-borde bg-superficie p-2 shadow-xl">
          {cargando ? (
            <p className="p-3 text-sm text-texto-secundario">
              Buscando...
            </p>
          ) : resultados.length === 0 ? (
            <p className="p-3 text-sm text-texto-secundario">
              No hay sugerencias
            </p>
          ) : (
            resultados.map((item) => (
              <Link
                key={`${item.tipo}-${item.id}`}
                href={`/buscar?q=${encodeURIComponent(item.titulo)}&tipo=${item.tipo}`}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-borde"
              >
                {item.poster ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${item.poster}`}
                    alt=""
                    className="h-14 w-10 rounded object-cover"
                  />
                ) : (
                  <div className="h-14 w-10 rounded bg-borde" />
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-texto">
                    {item.titulo}
                  </p>
                  <p className="text-xs text-texto-secundario">
                    {item.tipo === "serie" ? "Serie" : "Película"}
                    {item.anio ? ` · ${item.anio}` : ""}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
