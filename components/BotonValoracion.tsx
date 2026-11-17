
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
    <div className="flex items-center gap-3">
      <span>⭐ Valoración:</span>

      <select
        value={valoracion ?? ""}
        onChange={(e) => cambiarValoracion(Number(e.target.value))}
        className="rounded-lg border border-borde bg-superficie p-2"
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
