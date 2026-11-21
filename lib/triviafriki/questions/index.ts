import { PREGUNTAS_CINEFRIKI } from "./cinefriki";
import { PREGUNTAS_SERIEFRIKI } from "./seriefriki";

export const BANCO_TRIVIAFRIKI = [
  ...PREGUNTAS_CINEFRIKI,
  ...PREGUNTAS_SERIEFRIKI,
] as const;
