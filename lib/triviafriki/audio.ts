export type EfectoTriviafriki = "acierto" | "fallo" | "victoria";

type FuenteMusical = {
  oscilador: OscillatorNode;
  ganancia: GainNode;
};

type MusicaActiva = {
  contexto: AudioContext;
  filtro: BiquadFilterNode;
  gananciaMaestra: GainNode;
  notas: FuenteMusical[];
  osciladorMelodia: OscillatorNode;
  gananciaMelodia: GainNode;
  intervalo: ReturnType<typeof setInterval> | null;
  paso: number;
  nivel: number;
};

type FuenteEfecto = FuenteMusical & {
  filtro: BiquadFilterNode | null;
};

const patronSuspense = [0, 7, 1, 6, 3, 8, 2, 5];
const fuentesEfectos = new Set<FuenteEfecto>();

let contexto: AudioContext | null = null;
let musica: MusicaActiva | null = null;
let generacionMusica = 0;
let generacionEfectos = 0;

function obtenerContexto(): AudioContext {
  if (typeof window === "undefined" || !window.AudioContext) {
    throw new Error("Este navegador no es compatible con Web Audio.");
  }

  if (!contexto || contexto.state === "closed") {
    contexto = new window.AudioContext();
  }

  return contexto;
}

async function reanudarContexto(actual: AudioContext): Promise<void> {
  if (actual.state !== "running") {
    await actual.resume();
  }

  if (actual.state !== "running") {
    throw new Error("El navegador no permitió iniciar el audio.");
  }
}

function crearFuente(
  actual: AudioContext,
  frecuencia: number,
  tipo: OscillatorType,
  destino: AudioNode,
  volumen: number
): FuenteMusical {
  const oscilador = actual.createOscillator();
  const ganancia = actual.createGain();

  oscilador.type = tipo;
  oscilador.frequency.setValueAtTime(frecuencia, actual.currentTime);
  ganancia.gain.setValueAtTime(volumen, actual.currentTime);
  oscilador.connect(ganancia);
  ganancia.connect(destino);

  return { oscilador, ganancia };
}

function desconectarFuente(fuente: FuenteMusical): void {
  fuente.oscilador.disconnect();
  fuente.ganancia.disconnect();
}

function tocarNotaSuspense(actual: MusicaActiva): void {
  if (musica !== actual) return;

  const ahora = actual.contexto.currentTime;
  const tension = (actual.nivel - 1) / 14;
  const semitonos = patronSuspense[actual.paso % patronSuspense.length];
  const raiz = 82.41 * 2 ** ((tension * 0.5) / 12);
  const frecuencia = raiz * 2 ** (semitonos / 12);

  actual.osciladorMelodia.frequency.setTargetAtTime(
    frecuencia,
    ahora,
    0.08
  );
  actual.gananciaMelodia.gain.cancelScheduledValues(ahora);
  actual.gananciaMelodia.gain.setValueAtTime(0.0001, ahora);
  actual.gananciaMelodia.gain.exponentialRampToValueAtTime(
    0.12 + tension * 0.04,
    ahora + 0.04
  );
  actual.gananciaMelodia.gain.exponentialRampToValueAtTime(
    0.0001,
    ahora + 0.65
  );
  actual.paso += 1;
}

function programarNotasSuspense(actual: MusicaActiva): void {
  if (actual.intervalo !== null) {
    clearInterval(actual.intervalo);
  }

  const tension = (actual.nivel - 1) / 14;
  const intervalo = 2200 - tension * 1000;

  tocarNotaSuspense(actual);
  actual.intervalo = setInterval(
    () => tocarNotaSuspense(actual),
    intervalo
  );
}

export async function iniciarMusicaSuspense(nivel: number): Promise<void> {
  const actual = obtenerContexto();
  const generacion = ++generacionMusica;
  await reanudarContexto(actual);

  if (generacion !== generacionMusica || actual !== contexto) return;

  if (musica) {
    actualizarTensionMusica(nivel);
    return;
  }

  const ahora = actual.currentTime;
  const gananciaMaestra = actual.createGain();
  const filtro = actual.createBiquadFilter();
  const bajo = crearFuente(actual, 55, "sine", filtro, 0.32);
  const armonico = crearFuente(actual, 82.41, "triangle", filtro, 0.09);
  const melodia = actual.createOscillator();
  const gananciaMelodia = actual.createGain();

  filtro.type = "lowpass";
  filtro.frequency.setValueAtTime(300, ahora);
  gananciaMaestra.gain.setValueAtTime(0, ahora);
  gananciaMaestra.gain.linearRampToValueAtTime(0.2, ahora + 0.8);
  gananciaMelodia.gain.setValueAtTime(0.0001, ahora);
  melodia.type = "triangle";
  melodia.frequency.setValueAtTime(82.41, ahora);
  melodia.connect(gananciaMelodia);
  gananciaMelodia.connect(filtro);
  filtro.connect(gananciaMaestra);
  gananciaMaestra.connect(actual.destination);

  bajo.oscilador.start(ahora);
  armonico.oscilador.start(ahora);
  melodia.start(ahora);

  musica = {
    contexto: actual,
    filtro,
    gananciaMaestra,
    notas: [bajo, armonico, { oscilador: melodia, ganancia: gananciaMelodia }],
    osciladorMelodia: melodia,
    gananciaMelodia,
    intervalo: null,
    paso: 0,
    nivel: Math.max(1, Math.min(15, nivel)),
  };

  actualizarTensionMusica(nivel);
}

export function actualizarTensionMusica(nivel: number): void {
  if (!musica) return;

  const actual = musica;
  const nivelSeguro = Math.max(1, Math.min(15, nivel));
  const tension = (nivelSeguro - 1) / 14;
  const ahora = actual.contexto.currentTime;

  actual.nivel = nivelSeguro;
  actual.filtro.frequency.setTargetAtTime(300 + tension * 700, ahora, 0.8);
  actual.gananciaMaestra.gain.setTargetAtTime(
    0.2 + tension * 0.06,
    ahora,
    1
  );
  programarNotasSuspense(actual);
}

export function detenerMusicaSuspense(): void {
  if (!musica) return;

  const actual = musica;
  musica = null;
  generacionMusica += 1;

  if (actual.intervalo !== null) {
    clearInterval(actual.intervalo);
  }

  const ahora = actual.contexto.currentTime;
  actual.gananciaMaestra.gain.cancelScheduledValues(ahora);
  actual.gananciaMaestra.gain.setTargetAtTime(0, ahora, 0.08);

  for (const fuente of actual.notas) {
    fuente.oscilador.onended = () => desconectarFuente(fuente);
    fuente.oscilador.stop(ahora + 0.35);
  }

  setTimeout(() => {
    actual.filtro.disconnect();
    actual.gananciaMaestra.disconnect();
  }, 500);
}

function crearNotaEfecto(
  actual: AudioContext,
  frecuencia: number,
  inicio: number,
  duracion: number,
  volumen: number,
  tipo: OscillatorType,
  duracionFundido = duracion,
  frecuenciaCorte?: number
): void {
  const oscilador = actual.createOscillator();
  const ganancia = actual.createGain();
  const filtro = frecuenciaCorte
    ? actual.createBiquadFilter()
    : null;
  const fuente = { oscilador, ganancia, filtro };
  const ataque = Math.min(0.025, duracion * 0.1);

  oscilador.type = tipo;
  oscilador.frequency.setValueAtTime(frecuencia, inicio);
  ganancia.gain.setValueAtTime(0.0001, inicio);
  ganancia.gain.exponentialRampToValueAtTime(volumen, inicio + ataque);
  const inicioFundido = inicio + duracion - duracionFundido;
  if (inicioFundido > inicio + ataque) {
    ganancia.gain.setValueAtTime(volumen, inicioFundido);
  }
  ganancia.gain.exponentialRampToValueAtTime(
    0.0001,
    inicio + duracion
  );

  if (filtro && frecuenciaCorte !== undefined) {
    filtro.type = "lowpass";
    filtro.frequency.setValueAtTime(frecuenciaCorte, inicio);
    filtro.Q.setValueAtTime(0.7, inicio);
    oscilador.connect(filtro);
    filtro.connect(ganancia);
  } else {
    oscilador.connect(ganancia);
  }

  ganancia.connect(actual.destination);
  fuentesEfectos.add(fuente);

  oscilador.addEventListener(
    "ended",
    () => {
      fuentesEfectos.delete(fuente);
      oscilador.disconnect();
      filtro?.disconnect();
      ganancia.disconnect();
    },
    { once: true }
  );
  oscilador.start(inicio);
  oscilador.stop(inicio + duracion + 0.03);
}

export async function reproducirEfectoTriviafriki(
  efecto: EfectoTriviafriki
): Promise<void> {
  detenerEfectosTriviafriki();
  const generacion = generacionEfectos;
  const actual = obtenerContexto();
  await reanudarContexto(actual);

  if (generacion !== generacionEfectos || actual !== contexto) return;

  const ahora = actual.currentTime + 0.04;

  if (efecto === "acierto") {
    crearNotaEfecto(actual, 659.25, ahora, 0.58, 0.055, "sine");
    crearNotaEfecto(
      actual,
      1318.51,
      ahora + 0.008,
      0.42,
      0.015,
      "sine"
    );
    return;
  }

  if (efecto === "fallo") {
    crearNotaEfecto(
      actual,
      110,
      ahora,
      0.68,
      0.045,
      "sawtooth",
      0.16,
      520
    );
    crearNotaEfecto(
      actual,
      114,
      ahora,
      0.68,
      0.035,
      "triangle",
      0.16,
      520
    );
    return;
  }

  crearNotaEfecto(actual, 392, ahora, 0.62, 0.045, "sine");
  crearNotaEfecto(actual, 493.88, ahora + 0.04, 0.58, 0.04, "sine");
  crearNotaEfecto(actual, 587.33, ahora + 0.08, 0.55, 0.035, "sine");
}

export function detenerEfectosTriviafriki(): void {
  generacionEfectos += 1;

  for (const fuente of fuentesEfectos) {
    const ahora = fuente.oscilador.context.currentTime;
    fuente.ganancia.gain.cancelScheduledValues(ahora);
    fuente.ganancia.gain.setTargetAtTime(0.0001, ahora, 0.01);
    fuente.oscilador.stop(ahora + 0.05);
  }
}

export function detenerTodoAudioTriviafriki(): void {
  detenerMusicaSuspense();
  detenerEfectosTriviafriki();

  if (!contexto || contexto.state === "closed") {
    contexto = null;
    return;
  }

  const anterior = contexto;
  contexto = null;
  void anterior.close().catch((error: unknown) => {
    console.error("No se pudo cerrar el contexto de audio de Triviafriki.", error);
  });
}
