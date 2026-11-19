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
    <div className="flex flex-col gap-2">
        <button
  type="button"
  onClick={() => setEditando(!editando)}
  className="self-start text-sm font-semibold text-principal"
>
  {comentario ? "✏️ Editar comentario" : "➕ Añadir comentario"}
</button>
{!editando && texto.trim() && (
  <p className="whitespace-pre-wrap text-sm leading-6 text-texto-secundario">
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
      className="w-full rounded-lg border border-borde bg-transparent p-3 text-sm text-texto"
    />
    <button
      type="button"
      onClick={guardar}
      className="self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
    >
      Guardar comentario
    </button>
  </>
)}

{mensaje && <p className="text-xs text-texto-secundario">{mensaje}</p>}
    </div>
  );
}