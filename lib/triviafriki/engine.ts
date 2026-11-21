import type {
  RandomSource,
  TriviaCategory,
  TriviaGame,
  TriviaLevel,
  TriviaMode,
  TriviaPrize,
  TriviaQuestion,
} from "./types";

export const MAX_NIVEL = 15;
export const MIN_PREGUNTAS_POR_CATEGORIA = 5;
export const TODAS_LAS_OPCIONES = [0, 1, 2, 3] as const;

type CategoriaRegla = {
  categoria: TriviaCategory;
  nombre: string;
  primerNivel: TriviaLevel;
  ultimoNivel: TriviaLevel;
  puntos: number;
};

type ReglasModalidad = {
  nombre: string;
  premio: TriviaPrize;
  categorias: readonly CategoriaRegla[];
};

export const REGLAS_MODALIDAD = {
  cinefriki: {
    nombre: "Cinefriki",
    premio: "oscar",
    categorias: [
      { categoria: 1, nombre: "Espectador", primerNivel: 1, ultimoNivel: 3, puntos: 100 },
      { categoria: 2, nombre: "Cinéfilo", primerNivel: 4, ultimoNivel: 6, puntos: 200 },
      { categoria: 3, nombre: "Director", primerNivel: 7, ultimoNivel: 9, puntos: 300 },
      { categoria: 4, nombre: "Maestro del Séptimo Arte", primerNivel: 10, ultimoNivel: 12, puntos: 400 },
      { categoria: 5, nombre: "Leyenda de Hollywood", primerNivel: 13, ultimoNivel: 15, puntos: 500 },
    ],
  },
  seriefriki: {
    nombre: "Seriefriki",
    premio: "emmy",
    categorias: [
      { categoria: 1, nombre: "Espectador", primerNivel: 1, ultimoNivel: 3, puntos: 100 },
      { categoria: 2, nombre: "Maratonista", primerNivel: 4, ultimoNivel: 6, puntos: 200 },
      { categoria: 3, nombre: "Guionista", primerNivel: 7, ultimoNivel: 9, puntos: 300 },
      { categoria: 4, nombre: "Showrunner", primerNivel: 10, ultimoNivel: 12, puntos: 400 },
      { categoria: 5, nombre: "Leyenda de la Televisión", primerNivel: 13, ultimoNivel: 15, puntos: 500 },
    ],
  },
} as const satisfies Record<TriviaMode, ReglasModalidad>;

export type ErrorMotorTrivia =
  | "modalidad-no-valida"
  | "nivel-no-valido"
  | "banco-insuficiente"
  | "banco-no-valido"
  | "partida-no-activa"
  | "respuesta-no-disponible"
  | "comodin-usado";

export class ErrorTrivia extends Error {
  readonly codigo: ErrorMotorTrivia;

  constructor(codigo: ErrorMotorTrivia, mensaje: string) {
    super(mensaje);
    this.name = "ErrorTrivia";
    this.codigo = codigo;
  }
}

function comprobarModalidad(modalidad: TriviaMode): void {
  if (!(modalidad in REGLAS_MODALIDAD)) {
    throw new ErrorTrivia("modalidad-no-valida", "Modalidad no válida.");
  }
}

export function obtenerCategoria(
  modalidad: TriviaMode,
  nivel: number
): CategoriaRegla {
  comprobarModalidad(modalidad);

  if (!Number.isInteger(nivel) || nivel < 1 || nivel > MAX_NIVEL) {
    throw new ErrorTrivia("nivel-no-valido", "Nivel no válido.");
  }

  const categoria = REGLAS_MODALIDAD[modalidad].categorias.find(
    (regla) => nivel >= regla.primerNivel && nivel <= regla.ultimoNivel
  );

  if (!categoria) {
    throw new ErrorTrivia("nivel-no-valido", "No hay categoría para el nivel.");
  }

  return categoria;
}

export function validarBanco(
  modalidad: TriviaMode,
  banco: readonly TriviaQuestion[]
): void {
  comprobarModalidad(modalidad);

  const preguntas = banco.filter(
    (pregunta) => pregunta.modalidad === modalidad
  );
  const ids = new Set<string>();

  for (const pregunta of preguntas) {
    if (
      ids.has(pregunta.id) ||
      pregunta.respuestas.length !== 4 ||
      pregunta.respuestas.some((respuesta) => !respuesta.trim()) ||
      new Set(pregunta.respuestas).size !== 4 ||
      !Number.isInteger(pregunta.respuestaCorrecta) ||
      pregunta.respuestaCorrecta < 0 ||
      pregunta.respuestaCorrecta > 3
    ) {
      throw new ErrorTrivia(
        "banco-no-valido",
        `La pregunta "${pregunta.id}" no cumple el formato requerido.`
      );
    }

    ids.add(pregunta.id);
  }

  for (const regla of REGLAS_MODALIDAD[modalidad].categorias) {
    const cantidad = preguntas.filter(
      (pregunta) => pregunta.categoria === regla.categoria
    ).length;

    if (cantidad < MIN_PREGUNTAS_POR_CATEGORIA) {
      throw new ErrorTrivia(
        "banco-insuficiente",
        `La categoría "${regla.nombre}" necesita al menos ${MIN_PREGUNTAS_POR_CATEGORIA} preguntas.`
      );
    }
  }
}

function indiceAleatorio(cantidad: number, aleatorio: RandomSource): number {
  const valor = aleatorio();

  if (!Number.isFinite(valor)) {
    throw new ErrorTrivia("banco-no-valido", "La fuente aleatoria no es válida.");
  }

  return Math.floor(Math.max(0, Math.min(valor, 1 - Number.EPSILON)) * cantidad);
}

function elegirPregunta(
  modalidad: TriviaMode,
  nivel: number,
  banco: readonly TriviaQuestion[],
  usadas: readonly string[],
  aleatorio: RandomSource
): TriviaQuestion {
  const categoria = obtenerCategoria(modalidad, nivel).categoria;
  const usadasSet = new Set(usadas);
  const disponibles = banco.filter(
    (pregunta) =>
      pregunta.modalidad === modalidad &&
      pregunta.categoria === categoria &&
      !usadasSet.has(pregunta.id)
  );

  if (disponibles.length === 0) {
    throw new ErrorTrivia(
      "banco-insuficiente",
      `No quedan preguntas para el nivel ${nivel}.`
    );
  }

  return disponibles[indiceAleatorio(disponibles.length, aleatorio)];
}

export function crearPartida(
  modalidad: TriviaMode,
  banco: readonly TriviaQuestion[],
  aleatorio: RandomSource = Math.random
): TriviaGame {
  validarBanco(modalidad, banco);
  const preguntaActual = elegirPregunta(modalidad, 1, banco, [], aleatorio);

  return {
    modalidad,
    nivel: 1,
    puntuacion: 0,
    preguntaActual,
    opcionesDisponibles: TODAS_LAS_OPCIONES,
    preguntasUsadas: [preguntaActual.id],
    comodines: {
      mitadUsada: false,
      cambioUsado: false,
    },
    ultimaTomaUsada: false,
    estado: "en-curso",
    premioOtorgado: null,
  };
}

function comprobarPartidaActiva(partida: TriviaGame): void {
  if (partida.estado !== "en-curso" && partida.estado !== "ultima-toma") {
    throw new ErrorTrivia(
      "partida-no-activa",
      "La partida ya ha terminado."
    );
  }
}

function reemplazarPregunta(
  partida: TriviaGame,
  banco: readonly TriviaQuestion[],
  aleatorio: RandomSource,
  estado: TriviaGame["estado"]
): TriviaGame {
  const preguntaActual = elegirPregunta(
    partida.modalidad,
    partida.nivel,
    banco,
    partida.preguntasUsadas,
    aleatorio
  );

  return {
    ...partida,
    preguntaActual,
    opcionesDisponibles: TODAS_LAS_OPCIONES,
    preguntasUsadas: [...partida.preguntasUsadas, preguntaActual.id],
    estado,
  };
}

export function usarComodin5050(
  partida: TriviaGame,
  aleatorio: RandomSource = Math.random
): TriviaGame {
  comprobarPartidaActiva(partida);

  if (partida.comodines.mitadUsada) {
    throw new ErrorTrivia("comodin-usado", "El comodín 50/50 ya se usó.");
  }

  const incorrectas = partida.opcionesDisponibles.filter(
    (opcion) => opcion !== partida.preguntaActual.respuestaCorrecta
  );

  if (incorrectas.length === 0) {
    throw new ErrorTrivia(
      "respuesta-no-disponible",
      "No quedan opciones para aplicar el comodín."
    );
  }

  const opcionIncorrecta =
    incorrectas[indiceAleatorio(incorrectas.length, aleatorio)];

  return {
    ...partida,
    opcionesDisponibles: [
      partida.preguntaActual.respuestaCorrecta,
      opcionIncorrecta,
    ],
    comodines: {
      ...partida.comodines,
      mitadUsada: true,
    },
  };
}

export function cambiarPregunta(
  partida: TriviaGame,
  banco: readonly TriviaQuestion[],
  aleatorio: RandomSource = Math.random
): TriviaGame {
  comprobarPartidaActiva(partida);

  if (partida.comodines.cambioUsado) {
    throw new ErrorTrivia(
      "comodin-usado",
      "El comodín de cambio ya se usó."
    );
  }

  const partidaActualizada = reemplazarPregunta(
    partida,
    banco,
    aleatorio,
    partida.estado
  );

  return {
    ...partidaActualizada,
    comodines: {
      ...partida.comodines,
      cambioUsado: true,
    },
  };
}

export function responderPregunta(
  partida: TriviaGame,
  respuesta: number,
  banco: readonly TriviaQuestion[],
  aleatorio: RandomSource = Math.random
): TriviaGame {
  comprobarPartidaActiva(partida);

  if (
    !Number.isInteger(respuesta) ||
    !partida.opcionesDisponibles.includes(respuesta)
  ) {
    throw new ErrorTrivia(
      "respuesta-no-disponible",
      "La respuesta seleccionada no está disponible."
    );
  }

  if (respuesta !== partida.preguntaActual.respuestaCorrecta) {
    if (partida.ultimaTomaUsada) {
      return {
        ...partida,
        estado: "the-end",
      };
    }

    return {
      ...reemplazarPregunta(partida, banco, aleatorio, "ultima-toma"),
      ultimaTomaUsada: true,
    };
  }

  const puntuacion =
    partida.puntuacion +
    obtenerCategoria(partida.modalidad, partida.nivel).puntos;

  if (partida.nivel === MAX_NIVEL) {
    return {
      ...partida,
      puntuacion,
      estado: "completada",
      premioOtorgado: REGLAS_MODALIDAD[partida.modalidad].premio,
    };
  }

  const nivel = (partida.nivel + 1) as TriviaLevel;
  const preguntaActual = elegirPregunta(
    partida.modalidad,
    nivel,
    banco,
    partida.preguntasUsadas,
    aleatorio
  );

  return {
    ...partida,
    nivel,
    puntuacion,
    preguntaActual,
    opcionesDisponibles: TODAS_LAS_OPCIONES,
    preguntasUsadas: [...partida.preguntasUsadas, preguntaActual.id],
    estado: "en-curso",
  };
}

export function reiniciarPartida(
  modalidad: TriviaMode,
  banco: readonly TriviaQuestion[],
  aleatorio: RandomSource = Math.random
): TriviaGame {
  return crearPartida(modalidad, banco, aleatorio);
}
