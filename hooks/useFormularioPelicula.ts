
"use client";

import { useState, useRef, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { crearPelicula } from "@/actions/acciones-peliculas";
import { toast } from "sonner";

export const MAX_TITULO = 80;

export function useFormularioPelicula() {
  const [enviando, setEnviando] = useState<boolean>(false);
  const [caracteres, setCaracteres] = useState<number>(0);

  const formularioRef = useRef<HTMLFormElement>(null);
  const tituloRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    tituloRef.current?.focus();
  }, []);

  function contarCaracteres(
    evento: ChangeEvent<HTMLInputElement>
  ) {
    setCaracteres(evento.target.value.length);
  }

  async function manejarEnvio(
    evento: FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    const datosFormulario = new FormData(evento.currentTarget);

    setEnviando(true);

    try {
      const resultado = await crearPelicula(datosFormulario);

      if (resultado.exito) {
        toast.success(resultado.mensaje);

        formularioRef.current?.reset();
        setCaracteres(0);
        tituloRef.current?.focus();
      } else {
        toast.error(resultado.mensaje);
      }
    } catch {
      toast.error("Ha ocurrido un error al añadir la película.");
    } finally {
      setEnviando(false);
    }
  }

  return {
    enviando,
    caracteres,
    formularioRef,
    tituloRef,
    contarCaracteres,
    manejarEnvio,
  };
}
