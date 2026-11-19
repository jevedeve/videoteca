
"use client";

import { Plus } from "lucide-react";
import { Boton } from "@/components/ui/Boton";
import {
  MAX_TITULO,
  useFormularioPelicula,
} from "@/hooks/useFormularioPelicula";

export function FormularioPelicula() {
  const {
    enviando,
    caracteres,
    formularioRef,
    tituloRef,
    contarCaracteres,
    manejarEnvio,
  } = useFormularioPelicula();

  return (
    <form
      ref={formularioRef}
      onSubmit={manejarEnvio}
      className="flex flex-col gap-6 rounded-2xl border border-borde bg-superficie p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8"
    >
      {/* NUEVO: selector Película / Serie */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="tipo"
          className="text-sm font-semibold text-texto"
        >
          Tipo de contenido
        </label>

        <select
          id="tipo"
          name="tipo"
          defaultValue="pelicula"
          disabled={enviando}
          className="w-full rounded-xl border border-borde-secundario bg-superficie px-4 py-3.5 text-texto outline-none focus:border-principal focus:ring-2 focus:ring-principal/20"
        >
          <option value="pelicula">Película</option>
          <option value="serie">Serie</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="titulo"
          className="text-sm font-semibold tracking-tight text-texto"
        >
          Título
        </label>

        <input
          id="titulo"
          name="titulo"
          ref={tituloRef}
          type="text"
          maxLength={MAX_TITULO}
          placeholder="Título de la película o serie"
          onChange={contarCaracteres}
          required
          disabled={enviando}
          className="w-full rounded-xl border border-borde-secundario bg-superficie px-4 py-3.5 text-texto transition-all duration-200 placeholder:text-texto-terciario outline-none focus:border-principal focus:ring-2 focus:ring-principal/20"
        />

        <p
          className={`text-right text-xs ${
            caracteres >= MAX_TITULO
              ? "text-error"
              : "text-texto-terciario"
          }`}
        >
          {caracteres}/{MAX_TITULO}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="comentario"
          className="text-sm font-semibold tracking-tight text-texto"
        >
          Comentario
        </label>

        <textarea
          id="comentario"
          name="comentario"
          rows={3}
          placeholder="¿Por qué quieres verla? (opcional)"
          disabled={enviando}
          className="w-full resize-y rounded-xl border border-borde-secundario bg-superficie px-4 py-3.5 text-texto transition-all duration-200 placeholder:text-texto-terciario outline-none focus:border-principal focus:ring-2 focus:ring-principal/20"
        />
      </div>

      <div className="flex justify-end">
        <Boton
          type="submit"
          icono={Plus}
          cargando={enviando}
        >
          Añadir película o serie
        </Boton>
      </div>
    </form>
  );
}
