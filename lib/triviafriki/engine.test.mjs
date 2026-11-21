import assert from "node:assert/strict";
import test from "node:test";
import {
  cambiarPregunta,
  crearPartida,
  ErrorTrivia,
  obtenerCategoria,
  responderPregunta,
  REGLAS_MODALIDAD,
  reiniciarPartida,
  usarComodin5050,
  validarBanco,
} from "./engine.ts";
import { PREGUNTAS_CINEFRIKI } from "./questions/cinefriki.ts";
import { PREGUNTAS_SERIEFRIKI } from "./questions/seriefriki.ts";
import {
  cargarProgresoTriviafriki,
  CLAVE_PROGRESO_TRIVIAFRIKI,
  registrarRecordTriviafriki,
  registrarVictoriaTriviafriki,
} from "./storage.ts";

const bancos = {
  cinefriki: PREGUNTAS_CINEFRIKI,
  seriefriki: PREGUNTAS_SERIEFRIKI,
};
const aleatorioCero = () => 0;

function responderCorrectamente(partida, banco) {
  return responderPregunta(
    partida,
    partida.preguntaActual.respuestaCorrecta,
    banco,
    aleatorioCero
  );
}

function responderIncorrectamente(partida, banco) {
  const respuestaIncorrecta =
    (partida.preguntaActual.respuestaCorrecta + 1) % 4;

  return responderPregunta(
    partida,
    respuestaIncorrecta,
    banco,
    aleatorioCero
  );
}

test("cada modalidad define sus cinco categorías, niveles y puntos", () => {
  assert.deepEqual(
    REGLAS_MODALIDAD.cinefriki.categorias.map(({ nombre }) => nombre),
    [
      "Espectador",
      "Cinéfilo",
      "Director",
      "Maestro del Séptimo Arte",
      "Leyenda de Hollywood",
    ]
  );
  assert.deepEqual(
    REGLAS_MODALIDAD.seriefriki.categorias.map(({ nombre }) => nombre),
    [
      "Espectador",
      "Maratonista",
      "Guionista",
      "Showrunner",
      "Leyenda de la Televisión",
    ]
  );

  for (let nivel = 1; nivel <= 15; nivel += 1) {
    const categoria = Math.ceil(nivel / 3);
    assert.equal(obtenerCategoria("cinefriki", nivel).categoria, categoria);
    assert.equal(obtenerCategoria("seriefriki", nivel).categoria, categoria);
    assert.equal(
      obtenerCategoria("cinefriki", nivel).puntos,
      categoria * 100
    );
  }
});

test("los bancos iniciales contienen preguntas válidas para las dos modalidades", () => {
  assert.equal(PREGUNTAS_CINEFRIKI.length, 25);
  assert.equal(PREGUNTAS_SERIEFRIKI.length, 25);
  validarBanco("cinefriki", PREGUNTAS_CINEFRIKI);
  validarBanco("seriefriki", PREGUNTAS_SERIEFRIKI);

  for (const pregunta of [...PREGUNTAS_CINEFRIKI, ...PREGUNTAS_SERIEFRIKI]) {
    assert.equal(pregunta.respuestas.length, 4);
    assert.equal(new Set(pregunta.respuestas).size, 4);
    assert.ok(pregunta.respuestas[pregunta.respuestaCorrecta]);
  }
});

test("un primer fallo reemplaza por otra pregunta del mismo nivel; otro fallo termina", () => {
  const banco = bancos.cinefriki;
  const partida = crearPartida("cinefriki", banco, aleatorioCero);
  const recuperacion = responderIncorrectamente(partida, banco);

  assert.equal(recuperacion.estado, "ultima-toma");
  assert.equal(recuperacion.nivel, partida.nivel);
  assert.notEqual(
    recuperacion.preguntaActual.id,
    partida.preguntaActual.id
  );
  assert.equal(recuperacion.ultimaTomaUsada, true);

  const fin = responderIncorrectamente(recuperacion, banco);
  assert.equal(fin.estado, "the-end");
  assert.equal(fin.puntuacion, 0);
  assert.throws(
    () => responderCorrectamente(fin, banco),
    (error) => error instanceof ErrorTrivia && error.codigo === "partida-no-activa"
  );
});

test("la última toma es única: tras acertarla, un fallo posterior termina la partida", () => {
  const banco = bancos.seriefriki;
  const partida = crearPartida("seriefriki", banco, aleatorioCero);
  const recuperacion = responderIncorrectamente(partida, banco);
  const nivelSiguiente = responderCorrectamente(recuperacion, banco);

  assert.equal(nivelSiguiente.nivel, 2);
  assert.equal(nivelSiguiente.ultimaTomaUsada, true);
  assert.equal(
    responderIncorrectamente(nivelSiguiente, banco).estado,
    "the-end"
  );
});

test("el comodín 50/50 conserva la correcta y solo deja una incorrecta; es de un uso", () => {
  const banco = bancos.cinefriki;
  const partida = crearPartida("cinefriki", banco, aleatorioCero);
  const reducida = usarComodin5050(partida, aleatorioCero);
  const correcta = partida.preguntaActual.respuestaCorrecta;

  assert.equal(reducida.opcionesDisponibles.length, 2);
  assert.ok(reducida.opcionesDisponibles.includes(correcta));
  assert.equal(reducida.comodines.mitadUsada, true);
  assert.throws(
    () => usarComodin5050(reducida, aleatorioCero),
    (error) => error instanceof ErrorTrivia && error.codigo === "comodin-usado"
  );
});

test("cambiar pregunta conserva el nivel, consume el comodín y no repite preguntas", () => {
  const banco = bancos.seriefriki;
  const partida = crearPartida("seriefriki", banco, aleatorioCero);
  const cambiada = cambiarPregunta(partida, banco, aleatorioCero);

  assert.equal(cambiada.nivel, partida.nivel);
  assert.notEqual(cambiada.preguntaActual.id, partida.preguntaActual.id);
  assert.equal(cambiada.comodines.cambioUsado, true);
  assert.equal(new Set(cambiada.preguntasUsadas).size, 2);
  assert.throws(
    () => cambiarPregunta(cambiada, banco, aleatorioCero),
    (error) => error instanceof ErrorTrivia && error.codigo === "comodin-usado"
  );
});

test("una partida completa no repite preguntas y concede el premio de la modalidad", () => {
  const banco = bancos.cinefriki;
  let partida = crearPartida("cinefriki", banco, aleatorioCero);

  partida = cambiarPregunta(partida, banco, aleatorioCero);

  while (partida.estado !== "completada") {
    if (partida.nivel === 4 && partida.estado === "en-curso") {
      partida = responderIncorrectamente(partida, banco);
      assert.equal(partida.estado, "ultima-toma");
    } else {
      partida = responderCorrectamente(partida, banco);
    }
  }

  assert.equal(partida.nivel, 15);
  assert.equal(partida.puntuacion, 4500);
  assert.equal(partida.premioOtorgado, "oscar");
  assert.equal(new Set(partida.preguntasUsadas).size, partida.preguntasUsadas.length);
  assert.equal(partida.preguntasUsadas.length, 17);
});

test("Seriefriki concede un Emmy al completar los 15 niveles", () => {
  const banco = bancos.seriefriki;
  let partida = crearPartida("seriefriki", banco, aleatorioCero);

  while (partida.estado !== "completada") {
    partida = responderCorrectamente(partida, banco);
  }

  assert.equal(partida.puntuacion, 4500);
  assert.equal(partida.premioOtorgado, "emmy");
});

test("reiniciar crea una partida nueva desde nivel 1 sin reutilizar el estado anterior", () => {
  const banco = bancos.cinefriki;
  const partida = crearPartida("cinefriki", banco, aleatorioCero);
  const terminada = responderIncorrectamente(partida, banco);
  const fin = responderIncorrectamente(terminada, banco);
  const reiniciada = reiniciarPartida("cinefriki", banco, aleatorioCero);

  assert.equal(fin.estado, "the-end");
  assert.equal(reiniciada.nivel, 1);
  assert.equal(reiniciada.puntuacion, 0);
  assert.equal(reiniciada.ultimaTomaUsada, false);
  assert.deepEqual(reiniciada.comodines, {
    mitadUsada: false,
    cambioUsado: false,
  });
});

test("guardar una victoria repetida no duplica el premio y conserva el récord y premios previos", () => {
  const datos = new Map([
    [
      CLAVE_PROGRESO_TRIVIAFRIKI,
      JSON.stringify({
        premios: { oscar: 2, emmy: 1 },
        records: { cinefriki: 4200, seriefriki: 3900 },
        partidasRecompensadas: [],
      }),
    ],
  ]);
  const almacen = {
    getItem: (clave) => datos.get(clave) ?? null,
    setItem: (clave, valor) => datos.set(clave, valor),
  };

  registrarVictoriaTriviafriki(almacen, "partida-1", "cinefriki", 4500);
  const progreso = registrarVictoriaTriviafriki(
    almacen,
    "partida-1",
    "cinefriki",
    4500
  );

  assert.deepEqual(progreso, {
    premios: { oscar: 3, emmy: 1 },
    records: { cinefriki: 4500, seriefriki: 3900 },
    partidasRecompensadas: ["partida-1"],
  });
  assert.deepEqual(cargarProgresoTriviafriki(almacen), progreso);
});

test("el récord es independiente por modalidad y nunca disminuye", () => {
  const datos = new Map();
  const almacen = {
    getItem: (clave) => datos.get(clave) ?? null,
    setItem: (clave, valor) => datos.set(clave, valor),
  };

  registrarVictoriaTriviafriki(almacen, "cine-1", "cinefriki", 4500);
  const progreso = registrarVictoriaTriviafriki(
    almacen,
    "serie-1",
    "seriefriki",
    3000
  );

  assert.deepEqual(progreso.records, {
    cinefriki: 4500,
    seriefriki: 3000,
  });
  assert.deepEqual(progreso.premios, { oscar: 1, emmy: 1 });
});

test("una partida sin victoria también actualiza el récord sin conceder premio", () => {
  const datos = new Map();
  const almacen = {
    getItem: (clave) => datos.get(clave) ?? null,
    setItem: (clave, valor) => datos.set(clave, valor),
  };

  const progreso = registrarRecordTriviafriki(
    almacen,
    "partida-incompleta",
    "cinefriki",
    1200
  );

  assert.equal(progreso.records.cinefriki, 1200);
  assert.deepEqual(progreso.premios, { oscar: 0, emmy: 0 });
});
