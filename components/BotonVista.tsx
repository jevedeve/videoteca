
"use client";

import { Eye, EyeOff } from "lucide-react";
import { useAlternarVista } from "@/hooks/useAlternarVista";

type BotonVistaProps = {
  id: string;
  vista: boolean;
};

export function BotonVista({
  id,
  vista,
}: BotonVistaProps) {
  const { cargando, manejarClic } = useAlternarVista(
    id,
    vista
  );

  return (
    <button
      type="button"
      onClick={manejarClic}
      disabled={cargando}
      aria-label={
        vista
          ? "Marcar como pendiente"
          : "Marcar como vista"
      }
      title={
        vista
          ? "Marcar como pendiente"
          : "Marcar como vista"
      }
      className="inline-flex items-center justify-center rounded-xl p-2.5 transition-all duration-200 hover:scale-110 hover:bg-superficie-secundaria active:scale-95 disabled:pointer-events-none disabled:opacity-50"
    >
      {vista ? (
        <Eye
          className="h-5 w-5 text-principal"
          aria-hidden="true"
        />
      ) : (
        <EyeOff
          className="h-5 w-5 text-texto-terciario"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
