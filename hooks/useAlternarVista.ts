
"use client";

import { useState } from "react";
import { alternarVista } from "@/actions/acciones-peliculas";
import { toast } from "sonner";

export function useAlternarVista(
  id: string,
  vista: boolean
) {
  const [cargando, setCargando] = useState<boolean>(false);

  async function manejarClic() {
    if (cargando) return;

    setCargando(true);

    try {
      const resultado = await alternarVista(id, vista);

      if (resultado.exito) {
        toast.success(resultado.mensaje);
      } else {
        toast.error(resultado.mensaje);
      }
    } catch {
      toast.error(
        "Ha ocurrido un error al cambiar el estado de la película."
      );
    } finally {
      setCargando(false);
    }
  }

  return {
    cargando,
    manejarClic,
  };
}
