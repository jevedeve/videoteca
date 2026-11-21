"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowLeft,
  AudioLines,
  Clapperboard,
  Film,
  RotateCcw,
  Sparkles,
  Trophy,
  Tv,
  Volume2,
} from "lucide-react";
import {
  cambiarPregunta,
  crearPartida,
  obtenerCategoria,
  responderPregunta,
  usarComodin5050,
} from "@/lib/triviafriki/engine";
import { BANCO_TRIVIAFRIKI } from "@/lib/triviafriki/questions";
import {
  actualizarTensionMusica,
  detenerEfectosTriviafriki,
  detenerMusicaSuspense,
  detenerTodoAudioTriviafriki,
  iniciarMusicaSuspense,
  reproducirEfectoTriviafriki,
  type EfectoTriviafriki,
} from "@/lib/triviafriki/audio";
import {
  CLAVE_PROGRESO_TRIVIAFRIKI,
  decodificarProgresoTriviafriki,
  EVENTO_PROGRESO_TRIVIAFRIKI,
  registrarRecordTriviafriki,
  registrarVictoriaTriviafriki,
  type ProgresoTriviafriki,
} from "@/lib/triviafriki/storage";
import type { TriviaGame, TriviaMode } from "@/lib/triviafriki/types";

const SNAPSHOT_SERVIDOR = "__triviafriki_servidor__";
const SNAPSHOT_ERROR = "__triviafriki_error__";

function suscribirProgreso(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENTO_PROGRESO_TRIVIAFRIKI, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENTO_PROGRESO_TRIVIAFRIKI, callback);
  };
}

function obtenerSnapshotProgreso(): string {
  try {
    return window.localStorage.getItem(CLAVE_PROGRESO_TRIVIAFRIKI) ?? "";
  } catch {
    return SNAPSHOT_ERROR;
  }
}

function obtenerSnapshotServidor() {
  return SNAPSHOT_SERVIDOR;
}

const MODALIDADES: {
  id: TriviaMode;
  nombre: string;
  descripcion: string;
  premio: string;
  icono: typeof Film;
}[] = [
  {
    id: "cinefriki",
    nombre: "Cinefriki",
    descripcion: "15 preguntas para demostrar cuánto sabes de cine.",
    premio: "Óscar",
    icono: Film,
  },
  {
    id: "seriefriki",
    nombre: "Seriefriki",
    descripcion: "15 preguntas para poner a prueba tu memoria seriéfila.",
    premio: "Emmy",
    icono: Tv,
  },
];

function nuevoIdPartida(): string {
  if (!globalThis.crypto?.randomUUID) {
    throw new Error("Este navegador no permite iniciar una partida segura.");
  }

  return globalThis.crypto.randomUUID();
}

export default function TriviafrikiPage() {
  const snapshotProgreso = useSyncExternalStore(
    suscribirProgreso,
    obtenerSnapshotProgreso,
    obtenerSnapshotServidor
  );
  const progresoResultado = (() => {
    if (snapshotProgreso === SNAPSHOT_SERVIDOR) {
      return {
        progreso: null,
        error: null,
        cargado: false,
      };
    }

    if (snapshotProgreso === SNAPSHOT_ERROR) {
      return {
        progreso: null,
        error: "El navegador no permitió acceder al progreso guardado.",
        cargado: true,
      };
    }

    try {
      return {
        progreso: decodificarProgresoTriviafriki(
          snapshotProgreso === "" ? null : snapshotProgreso
        ),
        error: null,
        cargado: true,
      };
    } catch (error) {
      return {
        progreso: null,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo cargar el progreso de Triviafriki.",
        cargado: true,
      };
    }
  })();
  const progreso: ProgresoTriviafriki | null = progresoResultado.progreso;
  const [errorPersistencia, setErrorPersistencia] = useState<string | null>(
    null
  );
  const [partida, setPartida] = useState<TriviaGame | null>(null);
  const [idPartida, setIdPartida] = useState<string | null>(null);
  const [anuncio, setAnuncio] = useState("");
  const [musicaActivada, setMusicaActivada] = useState(false);
  const [efectosActivados, setEfectosActivados] = useState(false);
  const [audioCargando, setAudioCargando] = useState(false);
  const [errorAudio, setErrorAudio] = useState<string | null>(null);
  const premioProcesado = useRef<string | null>(null);

  useEffect(() => () => detenerTodoAudioTriviafriki(), []);

  function reproducirEfecto(efecto: EfectoTriviafriki) {
    if (!efectosActivados) return;

    void reproducirEfectoTriviafriki(efecto).catch((error: unknown) => {
      setErrorAudio(
        error instanceof Error
          ? error.message
          : "No se pudo reproducir el efecto de sonido."
      );
    });
  }

  async function cambiarMusica() {
    if (musicaActivada) {
      detenerMusicaSuspense();
      setMusicaActivada(false);
      setErrorAudio(null);
      return;
    }

    if (!partida) return;

    setAudioCargando(true);
    try {
      await iniciarMusicaSuspense(partida.nivel);
      setMusicaActivada(true);
      setErrorAudio(null);
    } catch (error) {
      setErrorAudio(
        error instanceof Error
          ? error.message
          : "No se pudo iniciar la música."
      );
    } finally {
      setAudioCargando(false);
    }
  }

  function cambiarEfectos() {
    if (efectosActivados) {
      detenerEfectosTriviafriki();
    }

    setEfectosActivados(!efectosActivados);
    setErrorAudio(null);
  }

  function guardarPremioCompletado(
    partidaCompletada: TriviaGame | null = partida,
    id: string | null = idPartida
  ) {
    if (!partidaCompletada || partidaCompletada.estado !== "completada" || !id) {
      return;
    }

    try {
      premioProcesado.current = id;
      registrarVictoriaTriviafriki(
        window.localStorage,
        id,
        partidaCompletada.modalidad,
        partidaCompletada.puntuacion
      );
      window.dispatchEvent(new Event(EVENTO_PROGRESO_TRIVIAFRIKI));
      setErrorPersistencia(null);
    } catch (error) {
      premioProcesado.current = null;
      setErrorPersistencia(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el premio de la partida."
      );
    }
  }

  function guardarRecordPartida(
    partidaActual: TriviaGame | null = partida,
    id: string | null = idPartida
  ) {
    if (!partidaActual || !id) return;

    try {
      registrarRecordTriviafriki(
        window.localStorage,
        id,
        partidaActual.modalidad,
        partidaActual.puntuacion
      );
      window.dispatchEvent(new Event(EVENTO_PROGRESO_TRIVIAFRIKI));
      setErrorPersistencia(null);
    } catch (error) {
      setErrorPersistencia(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el récord de la partida."
      );
    }
  }

  function iniciarPartida(modalidad: TriviaMode) {
    if (!progreso) return;

    try {
      const id = nuevoIdPartida();
      const nuevaPartida = crearPartida(modalidad, BANCO_TRIVIAFRIKI);
      premioProcesado.current = null;
      setIdPartida(id);
      setPartida(nuevaPartida);
      setAnuncio("");
    } catch (error) {
      setErrorPersistencia(
        error instanceof Error
          ? error.message
          : "No se pudo iniciar la partida."
      );
    }
  }

  function responder(respuesta: number) {
    if (!partida) return;

    try {
      const acierto =
        respuesta === partida.preguntaActual.respuestaCorrecta;
      const siguiente = responderPregunta(
        partida,
        respuesta,
        BANCO_TRIVIAFRIKI
      );
      setPartida(siguiente);

      if (siguiente.nivel !== partida.nivel) {
        actualizarTensionMusica(siguiente.nivel);
      }

      if (siguiente.estado === "ultima-toma") {
        reproducirEfecto("fallo");
        guardarRecordPartida(siguiente, idPartida);
        setAnuncio("La última toma: esta es tu única segunda oportunidad.");
      } else if (siguiente.estado === "the-end") {
        reproducirEfecto("fallo");
        detenerMusicaSuspense();
        setMusicaActivada(false);
        guardarRecordPartida(siguiente, idPartida);
        setAnuncio("THE END. La partida ha terminado.");
      } else if (siguiente.estado === "completada") {
        reproducirEfecto("victoria");
        detenerMusicaSuspense();
        setMusicaActivada(false);
        setAnuncio("¡Partida completada! Has ganado el premio.");
        if (premioProcesado.current !== idPartida) {
          guardarPremioCompletado(siguiente, idPartida);
        }
      } else {
        reproducirEfecto(acierto ? "acierto" : "fallo");
        guardarRecordPartida(siguiente, idPartida);
        setAnuncio(acierto
          ? `¡Correcto! +${siguiente.puntuacion - partida.puntuacion} puntos.`
          : "Respuesta incorrecta. Se activa La última toma.");
      }
    } catch (error) {
      setErrorPersistencia(
        error instanceof Error ? error.message : "No se pudo registrar la respuesta."
      );
    }
  }

  function aplicarComodin(accion: "mitad" | "cambio") {
    if (!partida) return;

    try {
      setPartida(
        accion === "mitad"
          ? usarComodin5050(partida)
          : cambiarPregunta(partida, BANCO_TRIVIAFRIKI)
      );
      setAnuncio(
        accion === "mitad"
          ? "Comodín 50/50 aplicado."
          : "Pregunta cambiada."
      );
    } catch (error) {
      setErrorPersistencia(
        error instanceof Error ? error.message : "No se pudo usar el comodín."
      );
    }
  }

  function volverAlInicio() {
    detenerTodoAudioTriviafriki();
    setPartida(null);
    setIdPartida(null);
    setAnuncio("");
    setMusicaActivada(false);
    setEfectosActivados(false);
    setAudioCargando(false);
    setErrorAudio(null);
  }

  if (!progresoResultado.cargado) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10" aria-busy="true">
        <p role="status" className="text-center text-texto-secundario">
          Preparando la sala…
        </p>
      </main>
    );
  }

  if (!progreso) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
        <section
          role="alert"
          className="rounded-2xl border border-error/40 bg-superficie p-6 text-center"
        >
          <h1 className="text-2xl font-bold text-texto">
            No se pudo cargar tu progreso
          </h1>
          <p className="mt-3 text-sm leading-6 text-texto-secundario">
            {progresoResultado.error ?? errorPersistencia}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 min-h-11 rounded-xl bg-principal px-5 py-2 font-semibold text-texto-invertido focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal"
          >
            Volver a intentar
          </button>
        </section>
      </main>
    );
  }

  const modalidadActual = partida
    ? MODALIDADES.find((modalidad) => modalidad.id === partida.modalidad)
    : null;
  const categoriaActual = partida
    ? obtenerCategoria(partida.modalidad, partida.nivel)
    : null;
  const progresoNiveles = partida
    ? partida.estado === "completada"
      ? 15
      : partida.nivel - 1
    : 0;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-10">
      <header className="relative overflow-hidden rounded-2xl border border-borde bg-gradient-to-br from-principal/10 via-superficie to-fondo p-5 shadow-lg sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-principal/10 blur-3xl"
        />
        <div className="relative">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-principal">
            <Clapperboard size={16} aria-hidden="true" />
            El gran juego del cine y las series
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-texto sm:text-4xl">
            Triviafriki
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-texto-secundario sm:text-base">
            Quince niveles. Dos universos. Una oportunidad para llegar hasta el
            final.
          </p>
        </div>
      </header>

      {errorPersistencia && progreso && (
        <p
          role="alert"
          className="rounded-xl border border-error/40 bg-error-suave px-4 py-3 text-sm text-texto"
        >
          {errorPersistencia}
          {partida?.estado === "completada" && (
            <button
              type="button"
              onClick={() => guardarPremioCompletado()}
              className="ml-2 min-h-11 rounded-lg px-3 font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal"
            >
              Reintentar guardado
            </button>
          )}
          {partida && partida.estado !== "completada" && (
            <button
              type="button"
              onClick={() => guardarRecordPartida()}
              className="ml-2 min-h-11 rounded-lg px-3 font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal"
            >
              Reintentar guardado del récord
            </button>
          )}
        </p>
      )}

      {!partida ? (
        <>
          <section aria-labelledby="modalidad-titulo">
            <div className="mb-4">
              <h2
                id="modalidad-titulo"
                className="text-xl font-bold text-texto sm:text-2xl"
              >
                Elige tu modalidad
              </h2>
              <p className="mt-1 text-sm text-texto-secundario">
                Cada partida tiene 15 niveles y su propio récord.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {MODALIDADES.map(({ id, nombre, descripcion, premio, icono: Icon }) => (
                <article
                  key={id}
                  className="flex flex-col rounded-2xl border border-borde bg-superficie p-5 shadow-sm sm:p-6"
                >
                  <Icon
                    className="h-8 w-8 text-principal"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                  <h3 className="mt-3 text-lg font-bold text-texto">
                    {nombre}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-texto-secundario">
                    {descripcion}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-principal">
                    Premio: {premio}
                  </p>
                  <button
                    type="button"
                    onClick={() => iniciarPartida(id)}
                    className="mt-5 min-h-11 rounded-xl border border-principal/30 bg-principal px-4 py-2.5 text-sm font-bold text-texto-invertido transition-colors hover:bg-principal-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal motion-reduce:transition-none"
                  >
                    Jugar {nombre}
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="vitrina-titulo"
            className="rounded-2xl border border-borde bg-superficie p-5 shadow-sm sm:p-6"
          >
            <h2
              id="vitrina-titulo"
              className="flex items-center gap-2 text-xl font-bold text-texto"
            >
              <Trophy size={21} className="text-principal" aria-hidden="true" />
              Vitrina de premios
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-xl border border-borde bg-fondo p-4">
                <p className="text-sm text-texto-secundario">Óscar</p>
                <p className="mt-1 text-2xl font-extrabold text-principal">
                  {progreso.premios.oscar}
                </p>
              </div>
              <div className="rounded-xl border border-borde bg-fondo p-4">
                <p className="text-sm text-texto-secundario">Emmy</p>
                <p className="mt-1 text-2xl font-extrabold text-principal">
                  {progreso.premios.emmy}
                </p>
              </div>
            </div>
            <h3 className="mt-5 text-sm font-semibold text-texto">
              Récord personal
            </h3>
            <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
              <div className="flex justify-between gap-3 rounded-lg bg-fondo px-3 py-2">
                <dt className="text-texto-secundario">Cinefriki</dt>
                <dd className="font-bold text-texto">
                  {progreso.records.cinefriki} puntos
                </dd>
              </div>
              <div className="flex justify-between gap-3 rounded-lg bg-fondo px-3 py-2">
                <dt className="text-texto-secundario">Seriefriki</dt>
                <dd className="font-bold text-texto">
                  {progreso.records.seriefriki} puntos
                </dd>
              </div>
            </dl>
          </section>

          <aside className="flex gap-3 rounded-2xl border border-principal/25 bg-principal-suave/40 p-4 sm:p-5">
            <Sparkles
              className="mt-0.5 h-5 w-5 shrink-0 text-principal"
              aria-hidden="true"
            />
            <div>
              <h2 className="font-bold text-texto">Código de honor</h2>
              <p className="mt-1 text-sm leading-6 text-texto-secundario">
                Sin IA, sin búsquedas y sin hacer trampas: juega con lo que
                sabes y disfruta del viaje.
              </p>
            </div>
          </aside>
        </>
      ) : (
        <section
          aria-labelledby="partida-titulo"
          className="rounded-2xl border border-borde bg-superficie p-4 shadow-lg sm:p-7"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-principal">
                {modalidadActual?.nombre}
              </p>
              <h2
                id="partida-titulo"
                className="mt-1 text-xl font-bold text-texto sm:text-2xl"
              >
                {categoriaActual?.nombre}
              </h2>
            </div>
            <button
              type="button"
              onClick={volverAlInicio}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-texto-secundario hover:bg-fondo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal"
            >
              <ArrowLeft size={17} aria-hidden="true" />
              Salir
            </button>
          </div>

          {(partida.estado === "en-curso" ||
            partida.estado === "ultima-toma") && (
            <section
              aria-label="Controles de audio"
              className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-borde bg-fondo p-3"
            >
              <button
                type="button"
                onClick={cambiarMusica}
                disabled={audioCargando}
                aria-pressed={musicaActivada}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-borde-secundario px-3 py-2 text-sm font-semibold text-texto hover:bg-superficie focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none"
              >
                <AudioLines size={17} aria-hidden="true" />
                Música: {musicaActivada ? "activada" : "desactivada"}
              </button>
              <button
                type="button"
                onClick={cambiarEfectos}
                aria-pressed={efectosActivados}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-borde-secundario px-3 py-2 text-sm font-semibold text-texto hover:bg-superficie focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal motion-reduce:transition-none"
              >
                <Volume2 size={17} aria-hidden="true" />
                Efectos: {efectosActivados ? "activados" : "desactivados"}
              </button>
            </section>
          )}
          {errorAudio && (
            <p role="status" aria-live="polite" className="mt-3 text-sm text-error">
              {errorAudio}
            </p>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <p className="text-sm font-semibold text-texto">
              Nivel {partida.nivel} de 15
            </p>
            <p className="text-right text-sm font-semibold text-principal">
              {partida.puntuacion} puntos
            </p>
            <progress
              aria-label={`Progreso: ${progresoNiveles} de 15 niveles completados`}
              max={15}
              value={progresoNiveles}
              className="col-span-2 h-2 w-full overflow-hidden rounded-full accent-principal sm:col-span-2"
            />
          </div>

          {partida.estado === "ultima-toma" && (
            <div
              role="status"
              className="mt-5 rounded-xl border border-advertencia/40 bg-advertencia-suave px-4 py-3"
            >
              <p className="font-extrabold tracking-wide text-principal">
                LA ÚLTIMA TOMA
              </p>
              <p className="mt-1 text-sm leading-6 text-texto-secundario">
                Has fallado. Una pregunta diferente del mismo nivel; si fallas
                otra vez, termina la partida.
              </p>
            </div>
          )}

          {partida.estado === "the-end" ? (
            <div className="py-10 text-center sm:py-14">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-error">
                Se acabó la partida
              </p>
              <h3 className="mt-2 text-4xl font-black tracking-widest text-texto sm:text-5xl">
                THE END
              </h3>
              <p className="mt-3 text-sm text-texto-secundario">
                Has terminado con {partida.puntuacion} puntos.
              </p>
              <button
                type="button"
                onClick={() => iniciarPartida(partida.modalidad)}
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-principal px-5 py-2.5 font-bold text-texto-invertido hover:bg-principal-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal"
              >
                <RotateCcw size={17} aria-hidden="true" />
                Reiniciar desde el nivel 1
              </button>
            </div>
          ) : partida.estado === "completada" ? (
            <div className="py-8 text-center sm:py-12">
              <Trophy
                className="mx-auto h-12 w-12 text-principal"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-principal">
                ¡Una partida legendaria!
              </p>
              <h3 className="mt-2 text-3xl font-extrabold text-texto">
                Has ganado un {modalidadActual?.premio}
              </h3>
              <p className="mt-2 text-texto-secundario">
                15 niveles completados · {partida.puntuacion} puntos
              </p>
              <p role="status" className="mt-3 text-sm text-texto-secundario">
                {errorPersistencia
                  ? "El premio aún no se ha guardado."
                  : "Tu premio y récord se han guardado en este dispositivo."}
              </p>
              <button
                type="button"
                onClick={volverAlInicio}
                disabled={Boolean(errorPersistencia)}
                className="mt-6 min-h-11 rounded-xl border border-borde-secundario px-5 py-2.5 font-semibold text-texto hover:bg-fondo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal disabled:cursor-not-allowed disabled:opacity-50"
              >
                Volver a la vitrina
              </button>
            </div>
          ) : (
            <>
              <div className="mt-5 rounded-xl border border-borde bg-fondo p-4 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-texto-terciario">
                  {partida.preguntaActual.tema}
                </p>
                <h3 className="mt-2 text-lg font-bold leading-relaxed text-texto sm:text-xl">
                  {partida.preguntaActual.enunciado}
                </h3>
              </div>

              <div
                role="group"
                aria-label="Respuestas"
                className="mt-4 grid gap-3 sm:grid-cols-2"
              >
                {partida.opcionesDisponibles.map((indice) => (
                  <button
                    key={indice}
                    type="button"
                    onClick={() => responder(indice)}
                    className="min-h-14 rounded-xl border border-borde-secundario bg-fondo px-4 py-3 text-left text-sm font-medium leading-5 text-texto transition-colors hover:border-principal/60 hover:bg-superficie-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal motion-reduce:transition-none sm:text-base"
                  >
                    <span className="mr-2 font-bold text-principal">
                      {String.fromCharCode(65 + indice)}.
                    </span>
                    {partida.preguntaActual.respuestas[indice]}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => aplicarComodin("mitad")}
                  disabled={partida.comodines.mitadUsada}
                  className="min-h-11 rounded-xl border border-borde-secundario px-4 py-2 text-sm font-semibold text-texto hover:bg-fondo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal disabled:cursor-not-allowed disabled:opacity-50"
                >
                  50/50{partida.comodines.mitadUsada ? " · usado" : ""}
                </button>
                <button
                  type="button"
                  onClick={() => aplicarComodin("cambio")}
                  disabled={partida.comodines.cambioUsado}
                  className="min-h-11 rounded-xl border border-borde-secundario px-4 py-2 text-sm font-semibold text-texto hover:bg-fondo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cambiar pregunta
                  {partida.comodines.cambioUsado ? " · usado" : ""}
                </button>
              </div>
              <p aria-live="polite" className="sr-only">
                {anuncio}
              </p>
            </>
          )}
        </section>
      )}
    </main>
  );
}
