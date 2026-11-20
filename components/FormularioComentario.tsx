"use client";

import { useState } from "react";
import { guardarComentario } from "@/actions/acciones-peliculas";

export function FormularioComentario({
  id,
  comentario,
}: {
  id: string;
  comentario: string | null;
}) {
  const [texto, setTexto] = useState(comentario ?? "");
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  async function guardar() {
    const resultado = await guardarComentario(id, texto);
    setMensaje(resultado.mensaje);

    if (resultado.exito) {
      setEditando(false);
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <button
        type="button"
        onClick={() => setEditando(!editando)}
        className="inline-flex min-h-11 w-fit items-center justify-center rounded-xl border border-principal/30 bg-principal-suave px-3 py-2 text-sm font-semibold text-principal transition-colors hover:border-principal/50 hover:bg-superficie-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-principal/50"
      >
        {comentario ? "✏️ Editar comentario" : "➕ Añadir comentario"}
      </button>

      {!editando && texto.trim() && (
        <p className="whitespace-pre-wrap break-words rounded-xl border border-borde bg-superficie/50 px-3 py-3 text-sm leading-6 text-texto-secundario">
          {texto}
        </p>
      )}

      {editando && (
        <>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe tu comentario..."
            maxLength={1000}
            rows={3}
            className="min-h-28 w-full resize-y rounded-xl border border-borde-secundario bg-superficie px-3 py-3 text-sm leading-6 text-texto placeholder:text-texto-terciario focus:border-principal focus:outline-none focus:ring-2 focus:ring-principal/30"
          />
          <button
            type="button"
            onClick={guardar}
            className="inline-flex min-h-11 items-center justify-center self-start rounded-xl bg-principal px-4 py-2.5 text-sm font-semibold text-texto-invertido transition-colors hover:bg-principal-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-principal focus-visible:ring-offset-2 focus-visible:ring-offset-fondo"
          >
            Guardar comentario
          </button>
        </>
      )}

      {mensaje && (
        <p className="text-xs leading-5 text-texto-secundario">{mensaje}</p>
      )}
    </div>
  );
}