
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { crearPeliculaDesdeTMDB } from "@/actions/acciones-peliculas";

type Props = {
  tmdbId: number;
  titulo: string;
  poster: string | null;
  sinopsis: string | null;
  tipo?: "pelicula" | "serie";
};

export function BotonAgregarTMDB({
  tmdbId,
  titulo,
  poster,
  sinopsis,
  tipo = "pelicula",
}: Props) {
  const [cargando, setCargando] = useState(false);

  async function agregar() {
    setCargando(true);

    try {
      const resultado = await crearPeliculaDesdeTMDB(
  tmdbId,
  titulo,
  poster,
  sinopsis,
  tipo
);
    

      if (resultado.exito) {
        toast.success(resultado.mensaje);
      } else {
        toast.error(resultado.mensaje);
      }
    } catch {
      toast.error("No se pudo añadir la película.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <button
      type="button"
      onClick={agregar}
      disabled={cargando}
      aria-busy={cargando}
      className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-principal/30 bg-principal px-4 py-2.5 text-center text-sm font-semibold leading-tight text-texto-invertido transition-colors hover:border-principal/50 hover:bg-principal-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal active:scale-[0.99] disabled:pointer-events-none disabled:cursor-wait disabled:opacity-60"
    >
      {cargando && (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
      )}
      <span>{cargando ? "Añadiendo..." : "Añadir a mi Videoteca"}</span>
    </button>
  );
}
