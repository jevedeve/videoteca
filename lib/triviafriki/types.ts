export type TriviaMode = "cinefriki" | "seriefriki";
export type TriviaCategory = 1 | 2 | 3 | 4 | 5;
export type TriviaLevel =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15;
export type TriviaPrize = "oscar" | "emmy";
export type TriviaStatus =
  | "en-curso"
  | "ultima-toma"
  | "the-end"
  | "completada";

export type TriviaQuestion = {
  id: string;
  modalidad: TriviaMode;
  categoria: TriviaCategory;
  tema: string;
  enunciado: string;
  respuestas: readonly [string, string, string, string];
  respuestaCorrecta: number;
  explicacion: string;
};

export type TriviaJokers = {
  mitadUsada: boolean;
  cambioUsado: boolean;
};

export type TriviaGame = {
  modalidad: TriviaMode;
  nivel: TriviaLevel;
  puntuacion: number;
  preguntaActual: TriviaQuestion;
  opcionesDisponibles: readonly number[];
  preguntasUsadas: readonly string[];
  comodines: TriviaJokers;
  ultimaTomaUsada: boolean;
  estado: TriviaStatus;
  premioOtorgado: TriviaPrize | null;
};

export type RandomSource = () => number;
