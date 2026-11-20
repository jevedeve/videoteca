
"use client";

import { guardarValoracion } from "@/actions/acciones-peliculas";
import { toast } from "sonner";

type Props = {
  id: string;
  valoracion: number | null;
};

export function BotonValoracion({ id, valoracion }: Props) {
  async function cambiarValoracion(valor: number) {
    const resultado = await guardarValoracion(id, valor);

    if (resultado.exito) {
      toast.success(resultado.mensaje);
    } else {
      toast.error(resultado.mensaje);
    }
  }

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
      <label
        htmlFor={`valoracion-${id}`}
        className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-texto-secundario"
      >
        <span aria-hidden="true">⭐</span>
        Valoración
      </label>

      <select
        id={`valoracion-${id}`}
        value={valoracion ?? ""}
        onChange={(e) => cambiarValoracion(Number(e.target.value))}
        className="min-h-11 min-w-0 flex-1 rounded-xl border border-borde-secundario bg-superficie px-3 py-2 text-sm font-semibold text-texto shadow-sm transition-colors hover:border-borde-fuerte focus-visible:border-principal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-principal/30"
      >
        <option value="" disabled>
          Sin puntuar
        </option>

        {Array.from({ length: 10 }, (_, i) => i + 1).map((numero) => (
          <option key={numero} value={numero}>
            {numero}/10
          </option>
        ))}
      </select>
    </div>
  );
}
