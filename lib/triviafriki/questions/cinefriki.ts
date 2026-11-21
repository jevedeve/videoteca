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
    modalidad: "cinefriki",
    categoria,
    tema,
    enunciado,
    respuestas,
    respuestaCorrecta,
    explicacion,
  };
}

export const PREGUNTAS_CINEFRIKI: readonly TriviaQuestion[] = [
  pregunta("cine-01", 1, "Animación", "¿Cómo se llama el vaquero de Toy Story?", ["Buzz", "Woody", "Rex", "Andy"], 1, "Woody es el vaquero de juguete que protagoniza la saga."),
  pregunta("cine-02", 1, "Animación", "¿Qué animal es Simba en El rey león?", ["Tigre", "Leopardo", "León", "Guepardo"], 2, "Simba es un león, hijo de Mufasa."),
  pregunta("cine-03", 1, "Fantasía", "¿Cómo se llama la lechuza de Harry Potter?", ["Hedwig", "Fawkes", "Crookshanks", "Aragog"], 0, "Hedwig es la lechuza blanca de Harry."),
  pregunta("cine-04", 1, "Animación", "¿Qué tipo de pez es Nemo?", ["Pez globo", "Pez payaso", "Pez espada", "Pez luna"], 1, "Nemo es un pez payaso."),
  pregunta("cine-05", 1, "Comedia", "¿Cómo se llama el niño protagonista de Solo en casa?", ["Kevin McCallister", "Fuller McCallister", "Buzz McCallister", "Mitch Murphy"], 0, "Kevin McCallister se queda solo en casa durante las fiestas."),

  pregunta("cine-06", 2, "Ciencia ficción", "¿Qué modelo de coche utiliza Doc en Regreso al futuro?", ["Ford Mustang", "DeLorean DMC-12", "Chevrolet Camaro", "Porsche 911"], 1, "La máquina del tiempo de Doc es un DeLorean DMC-12."),
  pregunta("cine-07", 2, "Ciencia ficción", "En Matrix, ¿qué pastilla elige Neo?", ["La azul", "La roja", "La verde", "La blanca"], 1, "Neo elige la pastilla roja para conocer la verdad."),
  pregunta("cine-08", 2, "Drama", "¿En qué barco transcurre gran parte de Titanic?", ["RMS Titanic", "RMS Olympic", "Queen Mary", "Carpathia"], 0, "La historia se desarrolla a bordo del RMS Titanic."),
  pregunta("cine-09", 2, "Aventura", "¿Cómo se llama la isla de Jurassic Park?", ["Isla Sorna", "Isla Nublar", "Isla Muerta", "Isla Calavera"], 1, "El parque original está situado en Isla Nublar."),
  pregunta("cine-10", 2, "Suspense", "¿Quién dirigió Tiburón?", ["Ridley Scott", "Steven Spielberg", "George Lucas", "James Cameron"], 1, "Steven Spielberg dirigió Tiburón, estrenada en 1975."),

  pregunta("cine-11", 3, "Dirección", "¿Quién dirigió Pulp Fiction?", ["Martin Scorsese", "Quentin Tarantino", "Oliver Stone", "David Fincher"], 1, "Quentin Tarantino escribió y dirigió Pulp Fiction."),
  pregunta("cine-12", 3, "Animación", "¿Quién dirigió El viaje de Chihiro?", ["Isao Takahata", "Hayao Miyazaki", "Mamoru Hosoda", "Satoshi Kon"], 1, "La película fue escrita y dirigida por Hayao Miyazaki."),
  pregunta("cine-13", 3, "Cine internacional", "¿Quién dirigió Parásitos?", ["Park Chan-wook", "Bong Joon-ho", "Lee Chang-dong", "Kim Jee-woon"], 1, "Parásitos fue escrita y dirigida por Bong Joon-ho."),
  pregunta("cine-14", 3, "Dirección", "¿Quién dirigió El gran hotel Budapest?", ["Wes Anderson", "Paul Thomas Anderson", "Noah Baumbach", "Michel Gondry"], 0, "El gran hotel Budapest es una película de Wes Anderson."),
  pregunta("cine-15", 3, "Cine internacional", "¿Quién dirigió Roma, estrenada en 2018?", ["Alejandro G. Iñárritu", "Alfonso Cuarón", "Guillermo del Toro", "Carlos Reygadas"], 1, "Roma fue escrita, dirigida y coproducida por Alfonso Cuarón."),

  pregunta("cine-16", 4, "Ciencia ficción", "¿Cómo se llama la inteligencia artificial de 2001: Una odisea del espacio?", ["MU-TH-UR", "HAL 9000", "GERTY", "Skynet"], 1, "HAL 9000 es la inteligencia artificial de la nave Discovery One."),
  pregunta("cine-17", 4, "Cine clásico", "¿Cómo se llama el café de Rick en Casablanca?", ["Café de la Paix", "Rick's Café Américain", "Blue Parrot", "Café de Rick"], 1, "El local se llama Rick's Café Américain."),
  pregunta("cine-18", 4, "Cine clásico", "¿Qué familia ocupa el centro de El padrino?", ["Barzini", "Tattaglia", "Corleone", "Cuneo"], 2, "La saga sigue a la familia Corleone."),
  pregunta("cine-19", 4, "Cine clásico", "¿Qué palabra aparece en el trineo de Ciudadano Kane?", ["Rosebud", "Xanadu", "Susan", "Thatcher"], 0, "Rosebud es la palabra que Kane pronuncia al comienzo de la película."),
  pregunta("cine-20", 4, "Cine épico", "¿Quién dirigió Lawrence de Arabia?", ["David Lean", "William Wyler", "John Huston", "Fred Zinnemann"], 0, "Lawrence de Arabia fue dirigida por David Lean."),

  pregunta("cine-21", 5, "Premios", "¿Qué película ganó el primer Óscar a mejor película?", ["El cantor de jazz", "Alas", "Amanecer", "El séptimo cielo"], 1, "Alas ganó el premio de la primera ceremonia de los Óscar."),
  pregunta("cine-22", 5, "Premios", "¿Qué película fue la primera en lengua no inglesa en ganar mejor película?", ["Roma", "Parásitos", "La vida es bella", "Tigre y dragón"], 1, "Parásitos ganó el Óscar a mejor película en 2020."),
  pregunta("cine-23", 5, "Animación", "¿Qué película ganó el primer Óscar a mejor película de animación?", ["Monstruos, S. A.", "Shrek", "Toy Story", "El viaje de Chihiro"], 1, "Shrek ganó el primer Óscar de la categoría, entregado en 2002."),
  pregunta("cine-24", 5, "Premios", "¿Quién fue la primera mujer negra en ganar el Óscar a mejor actriz?", ["Whoopi Goldberg", "Halle Berry", "Viola Davis", "Dorothy Dandridge"], 1, "Halle Berry ganó el premio por Monster's Ball en 2002."),
  pregunta("cine-25", 5, "Premios", "¿Qué película ganó los 11 Óscar a los que fue nominada?", ["Ben-Hur", "Titanic", "El retorno del rey", "La lista de Schindler"], 2, "El retorno del rey ganó sus 11 nominaciones en la ceremonia de 2004."),
];
