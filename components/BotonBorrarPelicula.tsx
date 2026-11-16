
"use client";

import { Trash2 } from "lucide-react";
import { Boton } from "@/components/ui/Boton";
import { useBorrarPelicula } from "@/hooks/useBorrarPelicula";

type BotonBorrarPeliculaProps = {
  id: string;
};

export function BotonBorrarPelicula({
  id,
}: BotonBorrarPeliculaProps) {
  const { armado, borrando, manejarClic } =
    useBorrarPelicula(id);

  return (
    <Boton
      variante="peligro"
      icono={Trash2}
      cargando={borrando}
      onClick={manejarClic}
      type="button"
    >
      {armado ? "¿Seguro?" : "Borrar"}
    </Boton>
  );
}
