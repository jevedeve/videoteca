import type { TriviaMode } from "./types";

export const CLAVE_PROGRESO_TRIVIAFRIKI = "videoteca-triviafriki-v1";
export const EVENTO_PROGRESO_TRIVIAFRIKI = "triviafriki:progreso";

export type ProgresoTriviafriki = {
  premios: {
    oscar: number;
    emmy: number;
  };
  records: Record<TriviaMode, number>;
  partidasRecompensadas: string[];
};

type AlmacenLocal = Pick<Storage, "getItem" | "setItem">;

const progresoInicial: ProgresoTriviafriki = {
  premios: { oscar: 0, emmy: 0 },
  records: { cinefriki: 0, seriefriki: 0 },
  partidasRecompensadas: [],
};

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function esEnteroNoNegativo(valor: unknown): valor is number {
  return Number.isInteger(valor) && (valor as number) >= 0;
}

function validarProgreso(valor: unknown): ProgresoTriviafriki {
  if (
    !esObjeto(valor) ||
    !esObjeto(valor.premios) ||
    !esObjeto(valor.records) ||
    !esEnteroNoNegativo(valor.premios.oscar) ||
    !esEnteroNoNegativo(valor.premios.emmy) ||
    !esEnteroNoNegativo(valor.records.cinefriki) ||
    !esEnteroNoNegativo(valor.records.seriefriki) ||
    !Array.isArray(valor.partidasRecompensadas) ||
    !valor.partidasRecompensadas.every(
      (id): id is string => typeof id === "string" && id.length > 0
    )
  ) {
    throw new Error("Los datos guardados de Triviafriki no tienen un formato válido.");
  }

  return {
    premios: {
      oscar: valor.premios.oscar,
      emmy: valor.premios.emmy,
    },
    records: {
      cinefriki: valor.records.cinefriki,
      seriefriki: valor.records.seriefriki,
    },
    partidasRecompensadas: [...new Set(valor.partidasRecompensadas)],
  };
}

export function cargarProgresoTriviafriki(
  almacen: AlmacenLocal
): ProgresoTriviafriki {
  return decodificarProgresoTriviafriki(
    almacen.getItem(CLAVE_PROGRESO_TRIVIAFRIKI)
  );
}

export function decodificarProgresoTriviafriki(
  guardado: string | null
): ProgresoTriviafriki {
  if (guardado === null) {
    return {
      ...progresoInicial,
      premios: { ...progresoInicial.premios },
      records: { ...progresoInicial.records },
      partidasRecompensadas: [],
    };
  }

  let datos: unknown;

  try {
    datos = JSON.parse(guardado);
  } catch {
    throw new Error("No se pudieron leer los datos guardados de Triviafriki.");
  }

  return validarProgreso(datos);
}

export function registrarResultadoTriviafriki(
  almacen: AlmacenLocal,
  idPartida: string,
  modalidad: TriviaMode,
  puntuacion: number,
  concederPremio: boolean
): ProgresoTriviafriki {
  if (!idPartida.trim() || !Number.isInteger(puntuacion) || puntuacion < 0) {
    throw new Error("La victoria de Triviafriki no tiene datos válidos.");
  }

  const progreso = cargarProgresoTriviafriki(almacen);
  const yaRecompensada =
    concederPremio && progreso.partidasRecompensadas.includes(idPartida);
  const premio = modalidad === "cinefriki" ? "oscar" : "emmy";
  const actualizado: ProgresoTriviafriki = {
    premios: {
      ...progreso.premios,
      [premio]:
        progreso.premios[premio] +
        (concederPremio && !yaRecompensada ? 1 : 0),
    },
    records: {
      ...progreso.records,
      [modalidad]: Math.max(progreso.records[modalidad], puntuacion),
    },
    partidasRecompensadas:
      concederPremio && !yaRecompensada
        ? [...progreso.partidasRecompensadas, idPartida]
        : progreso.partidasRecompensadas,
  };

  almacen.setItem(CLAVE_PROGRESO_TRIVIAFRIKI, JSON.stringify(actualizado));
  return actualizado;
}

export function registrarVictoriaTriviafriki(
  almacen: AlmacenLocal,
  idPartida: string,
  modalidad: TriviaMode,
  puntuacion: number
): ProgresoTriviafriki {
  return registrarResultadoTriviafriki(
    almacen,
    idPartida,
    modalidad,
    puntuacion,
    true
  );
}

export function registrarRecordTriviafriki(
  almacen: AlmacenLocal,
  idPartida: string,
  modalidad: TriviaMode,
  puntuacion: number
): ProgresoTriviafriki {
  return registrarResultadoTriviafriki(
    almacen,
    idPartida,
    modalidad,
    puntuacion,
    false
  );
}
