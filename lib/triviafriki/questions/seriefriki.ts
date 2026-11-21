import type {
  TriviaCategory,
  TriviaQuestion,
} from "../types";

function pregunta(
  id: string,
  categoria: TriviaCategory,
  tema: string,
  enunciado: string,
  respuestas: TriviaQuestion["respuestas"],
  respuestaCorrecta: number,
  explicacion: string
): TriviaQuestion {
  return {
    id,
    modalidad: "seriefriki",
    categoria,
    tema,
    enunciado,
    respuestas,
    respuestaCorrecta,
    explicacion,
  };
}

export const PREGUNTAS_SERIEFRIKI: readonly TriviaQuestion[] = [
  pregunta("serie-01", 1, "Comedia", "¿Cómo se llama la cafetería habitual de Friends?", ["Central Perk", "Monk's Café", "Café Nervosa", "Luke's Diner"], 0, "Central Perk es el punto de encuentro habitual del grupo."),
  pregunta("serie-02", 1, "Animación", "¿Dónde vive Bob Esponja?", ["En una piña", "En un ancla", "En una concha", "En un barco"], 0, "Bob Esponja vive en una piña debajo del mar."),
  pregunta("serie-03", 1, "Animación", "¿En qué ciudad viven Los Simpson?", ["Shelbyville", "Springfield", "Quahog", "South Park"], 1, "La familia Simpson vive en Springfield."),
  pregunta("serie-04", 1, "Ciencia ficción", "¿Cómo se llama el pueblo de Stranger Things?", ["Riverdale", "Hawkins", "Sunnydale", "Derry"], 1, "La serie comienza en el pueblo ficticio de Hawkins, Indiana."),
  pregunta("serie-05", 1, "Comedia", "¿Para qué empresa trabajan los personajes de The Office (EE. UU.)?", ["Initech", "Dunder Mifflin", "Sterling Cooper", "Pied Piper"], 1, "Dunder Mifflin es la empresa papelera de la serie."),

  pregunta("serie-06", 2, "Drama", "¿Qué asignatura enseñaba Walter White al inicio de Breaking Bad?", ["Biología", "Química", "Física", "Matemáticas"], 1, "Walter White era profesor de química."),
  pregunta("serie-07", 2, "Ciencia ficción", "¿Cómo se llama la máquina del tiempo del Doctor?", ["The TARDIS", "The Vortex", "The Dalek", "The Gallifrey"], 0, "TARDIS significa Time And Relative Dimension In Space."),
  pregunta("serie-08", 2, "Fantasía", "¿En qué continente ficticio se sitúa gran parte de Juego de tronos?", ["Essos", "Westeros", "Sothoryos", "Ulthos"], 1, "Westeros es el continente donde se encuentran los Siete Reinos."),
  pregunta("serie-09", 2, "Misterio", "¿Quién es el compañero más conocido de Sherlock Holmes?", ["Inspector Lestrade", "Doctor Watson", "Mycroft Holmes", "Irene Adler"], 1, "El doctor John Watson es amigo y compañero de Holmes."),
  pregunta("serie-10", 2, "Ciencia ficción", "¿Cuál es el nombre del personaje conocido como Baby Yoda en The Mandalorian?", ["Yaddle", "Grogu", "Babu", "Gungi"], 1, "La serie revela que el nombre del personaje es Grogu."),

  pregunta("serie-11", 3, "Drama", "¿Cómo se llama el protagonista de Los Soprano?", ["Tony Soprano", "Christopher Moltisanti", "Silvio Dante", "Paulie Gualtieri"], 0, "Tony Soprano es el jefe mafioso y protagonista de la serie."),
  pregunta("serie-12", 3, "Misterio", "¿Qué agentes protagonizan Expediente X?", ["Mulder y Scully", "Carter y O'Neill", "Kirk y Spock", "Hunt y Palmer"], 0, "Fox Mulder y Dana Scully investigan casos paranormales."),
  pregunta("serie-13", 3, "Drama", "¿En qué ciudad transcurre The Wire?", ["Boston", "Baltimore", "Detroit", "Filadelfia"], 1, "The Wire retrata distintas instituciones de Baltimore."),
  pregunta("serie-14", 3, "Comedia", "¿Cómo se llama el vecino de Jerry en Seinfeld?", ["George Costanza", "Cosmo Kramer", "Newman", "David Puddy"], 1, "Cosmo Kramer vive en el apartamento frente al de Jerry."),
  pregunta("serie-15", 3, "Ciencia ficción", "¿Quién creó la serie Black Mirror?", ["Charlie Brooker", "Russell T Davies", "Jesse Armstrong", "Steven Moffat"], 0, "Black Mirror fue creada por Charlie Brooker."),

  pregunta("serie-16", 4, "Drama", "¿Qué autora escribió la novela en la que se basa El cuento de la criada?", ["Margaret Atwood", "Ursula K. Le Guin", "Doris Lessing", "Octavia E. Butler"], 0, "La serie adapta la novela homónima de Margaret Atwood."),
  pregunta("serie-17", 4, "Drama", "¿Cómo se llama el conglomerado mediático de Succession?", ["Waystar Royco", "Pierce Global", "Roy Media", "ATN Worldwide"], 0, "Waystar Royco es el conglomerado controlado por la familia Roy."),
  pregunta("serie-18", 4, "Historia", "¿Quién creó la miniserie Chernobyl?", ["Craig Mazin", "David Simon", "Peter Morgan", "Jesse Armstrong"], 0, "Craig Mazin creó y escribió la miniserie de HBO."),
  pregunta("serie-19", 4, "Historia", "¿Qué monarca está en el centro de las primeras temporadas de The Crown?", ["Isabel II", "Victoria", "Isabel I", "María Estuardo"], 0, "The Crown dramatiza el reinado de Isabel II."),
  pregunta("serie-20", 4, "Comedia dramática", "¿En qué ciudad dirige Carmy el restaurante de The Bear?", ["Nueva York", "Chicago", "Los Ángeles", "Boston"], 1, "Carmy vuelve a Chicago para hacerse cargo del restaurante familiar."),

  pregunta("serie-21", 5, "Premios", "¿Qué serie dramática guionizada ganó 59 premios Emmy?", ["Mad Men", "Juego de tronos", "The Crown", "Breaking Bad"], 1, "Juego de tronos estableció el récord de 59 premios Emmy para una serie guionizada."),
  pregunta("serie-22", 5, "Historia de la televisión", "¿Cómo se titula el episodio final de Breaking Bad?", ["Ozymandias", "Felina", "Granite State", "Face Off"], 1, "El episodio final de la serie se titula Felina."),
  pregunta("serie-23", 5, "Premios", "¿Qué serie fue la primera de una plataforma de streaming en ganar el Emmy a mejor drama?", ["House of Cards", "The Handmaid's Tale", "The Crown", "Stranger Things"], 1, "The Handmaid's Tale ganó mejor drama en 2017, como primera serie de streaming en lograrlo."),
  pregunta("serie-24", 5, "Comedia", "¿Qué serie de comedia ganó cinco Emmy consecutivos a mejor serie?", ["Frasier", "Cheers", "Veep", "Modern Family"], 0, "Frasier ganó la categoría de comedia cinco años seguidos, de 1994 a 1998."),
  pregunta("serie-25", 5, "Audiencias", "¿Qué episodio final de una serie reunió alrededor de 106 millones de espectadores en EE. UU. en su emisión original?", ["M*A*S*H", "Friends", "Seinfeld", "Cheers"], 0, "El final de M*A*S*H, Goodbye, Farewell and Amen, reunió cerca de 106 millones de espectadores en EE. UU."),
];
