
"use client";

import { useState, useRef, useEffect } from "react";
import { borrarPelicula } from "@/actions/acciones-peliculas";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";

export function useBorrarPelicula(id: string) {
  const router = useRouter();
  const pathname = usePathname();
  const [armado, setArmado] = useState<boolean>(false);
  const [borrando, setBorrando] = useState<boolean>(false);

  const temporizadorRef = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  useEffect(() => {
    if (!armado) {
      return;
    }

    temporizadorRef.current = setTimeout(() => {
      setArmado(false);
      temporizadorRef.current = null;
    }, 3000);

    return () => {
      if (temporizadorRef.current !== null) {
        clearTimeout(temporizadorRef.current);
        temporizadorRef.current = null;
      }
    };
  }, [armado]);

  async function manejarClic() {
    if (borrando) return;

    if (!armado) {
      setArmado(true);
      return;
    }

    setArmado(false);
    setBorrando(true);

    try {
      const resultado = await borrarPelicula(id);

     if (resultado.exito) {
  toast.success(resultado.mensaje);

  if (pathname.startsWith("/peliculas/")) {
    router.push("/");
  }
} else {
  toast.error(resultado.mensaje);
}
    } catch {
      toast.error("Ha ocurrido un error al borrar la película.");
    } finally {
      setBorrando(false);
    }
  }

  return {
    armado,
    borrando,
    manejarClic,
  };
}
