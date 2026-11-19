
"use client";

import { useState } from "react";
import { toast } from "sonner";
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
      className="mt-2 rounded bg-blue-600 px-3 py-2 text-sm text-white disabled:opacity-50"
    >
      {cargando ? "Añadiendo..." : "Añadir a mi Videoteca"}
    </button>
  );
}
