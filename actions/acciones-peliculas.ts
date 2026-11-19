
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ResultadoAccion = {
  exito: boolean;
  mensaje: string;
};

/**
 * Crea una película.
 * Valida el título y convierte el comentario vacío en null.
 */
export async function crearPelicula(
  datosFormulario: FormData
): Promise<ResultadoAccion> {
  try {
    const titulo = datosFormulario.get("titulo");
    const comentario = datosFormulario.get("comentario");
    const tipo = datosFormulario.get("tipo");
    const tipoValido =
      tipo === "serie" ? "serie" : "pelicula";

    const tituloPelicula =
      typeof titulo === "string" ? titulo.trim() : "";

    const comentarioPelicula =
      typeof comentario === "string" ? comentario.trim() : "";

    if (!tituloPelicula) {
      return {
        exito: false,
        mensaje: "El título no puede estar vacío.",
      };
    }

    if (tituloPelicula.length > 80) {
      return {
        exito: false,
        mensaje: "El título no puede superar los 80 caracteres.",
      };
    }

   await prisma.pelicula.create({
  data: {
    titulo: tituloPelicula,
    tipo: tipoValido,
    comentario: comentarioPelicula || null,
  },
});
    revalidatePath("/");
    revalidatePath("/vistas");

    return {
      exito: true,
      mensaje: "Película añadida correctamente.",
    };
  } catch {
    return {
      exito: false,
      mensaje: "Error al añadir la película.",
    };
  }
}

/**
 * Cambia una película entre vista y pendiente.
 */
export async function alternarVista(
  id: string,
  vista: boolean
): Promise<ResultadoAccion> {
  try {
    const pelicula = await prisma.pelicula.findUnique({
      where: {
        id,
      },
    });

    if (!pelicula) {
      return {
        exito: false,
        mensaje: "La película no existe.",
      };
    }

    await prisma.pelicula.update({
      where: {
        id,
      },
      data: {
        vista: !vista,
      },
    });

    revalidatePath("/");
    revalidatePath("/vistas");
    revalidatePath(`/peliculas/${id}`);

    return {
      exito: true,
      mensaje: vista
        ? "Película marcada como pendiente."
        : "Película marcada como vista.",
    };
  } catch {
    return {
      exito: false,
      mensaje: "Error al cambiar el estado de la película.",
    };
  }
}

/**
 * Borra una película por su identificador.
 */
export async function borrarPelicula(
  id: string
): Promise<ResultadoAccion> {
  try {
    await prisma.pelicula.delete({
      where: {
        id,
      },
    });

    revalidatePath("/");
    revalidatePath("/vistas");

    return {
      exito: true,
      mensaje: "Película eliminada correctamente.",
    };
  } catch {
    return {
      exito: false,
      mensaje: "Error al eliminar la película.",
    };
  }
}



export async function crearPeliculaDesdeTMDB(
  tmdbId: number,
  titulo: string,
  poster: string | null,
  sinopsis: string | null,
  tipo: "pelicula" | "serie" = "pelicula"
): Promise<ResultadoAccion> {
  try {
    if (!Number.isInteger(tmdbId) || tmdbId <= 0 ||
        !titulo.trim() || titulo.trim().length > 80) {
      return { exito: false, mensaje: "Datos de película no válidos." };
    }
  const existente = await prisma.pelicula.findFirst({
  where: {
    tmdbId,
    tipo,
  },
});

if (existente) {
  return {
    exito: false,
    mensaje: tipo === "serie"
  ? "Esta serie ya está en tu videoteca."
  : "Esta película ya está en tu videoteca.",
  };
}

   await prisma.pelicula.create({
  data: {
    tmdbId,
    tipo,
    titulo: titulo.trim(),
    poster,
    sinopsis,
  },
});

    revalidatePath("/");
    return {
  exito: true,
  mensaje: tipo === "serie"
    ? "Serie añadida correctamente."
    : "Película añadida correctamente.",
};

  } catch {
    return { exito: false, mensaje: "No se pudo añadir la película." };
  }
}


export async function guardarValoracion(
  id: string,
  valoracion: number
) {
  "use server";

  if (!Number.isInteger(valoracion) || valoracion < 1 || valoracion > 10) {
    return { exito: false, mensaje: "Valoración no válida." };
  }

  try {
    await prisma.pelicula.update({
      where: { id },
      data: { valoracion },
    });

    revalidatePath(`/peliculas/${id}`);
    return { exito: true, mensaje: "Valoración guardada." };
  } catch {
    return { exito: false, mensaje: "No se pudo guardar la valoración." };
  }
}

export async function guardarComentario(
  id: string,
  comentario: string
): Promise<ResultadoAccion> {
  const texto = comentario.trim();

  if (texto.length > 1000) {
    return {
      exito: false,
      mensaje: "El comentario no puede superar los 1000 caracteres.",
    };
  }

  try {
    await prisma.pelicula.update({
      where: { id },
      data: { comentario: texto || null },
    });

    revalidatePath("/");
    revalidatePath("/vistas");
    revalidatePath(`/peliculas/${id}`);

    return {
      exito: true,
      mensaje: "Comentario guardado correctamente.",
    };
  } catch {
    return {
      exito: false,
      mensaje: "No se pudo guardar el comentario.",
    };
  }
}