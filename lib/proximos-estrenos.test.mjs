import assert from "node:assert/strict";
import test from "node:test";
import {
  CACHE_REVALIDATE_SEGUNDOS,
  MAX_PAGINAS_DISCOVER_ES,
  MAX_PAGINAS_DISCOVER_INTERNACIONAL,
  combinarEstrenosFuturos,
  esFechaISO,
  obtenerFechaHoyMadrid,
  obtenerHastaPaginas,
  sumarDoceMeses,
} from "./proximos-estrenos.ts";

test("valida fechas ISO reales y calcula el horizonte de doce meses", () => {
  assert.equal(esFechaISO("2028-02-29"), true);
  assert.equal(esFechaISO("2027-02-29"), false);
  assert.equal(esFechaISO("2027-13-01"), false);
  assert.equal(sumarDoceMeses("2028-02-29"), "2029-02-28");
  assert.equal(CACHE_REVALIDATE_SEGUNDOS, 21600);
});

test("usa la fecha local de España para el inicio del horizonte", () => {
  assert.equal(
    obtenerFechaHoyMadrid(new Date("2026-11-23T23:30:00.000Z")),
    "2026-11-24"
  );
});

test("filtra fechas inválidas, pasadas y fuera del horizonte", () => {
  const results = combinarEstrenosFuturos(
    [
      { id: 1, release_date: "2027-01-10" },
      { id: 2, release_date: "2026-11-22" },
      { id: 3, release_date: "2027-11-24" },
      { id: 4, release_date: "2027-02-30" },
      { id: 0, release_date: "2027-01-01" },
    ],
    [
      { id: 5, release_date: "2026-11-23" },
      { id: 6, release_date: null },
    ],
    "2026-11-23",
    "2027-11-23"
  );

  assert.deepEqual(
    results.map(({ id, origenFecha }) => [id, origenFecha]),
    [
      [5, "internacional"],
      [1, "es"],
    ]
  );
});

test("deduplica por ID y prioriza una fecha española válida", () => {
  const results = combinarEstrenosFuturos(
    [
      { id: 7, release_date: "2027-03-10", title: "España" },
      { id: 7, release_date: "2027-03-11", title: "Duplicado local" },
    ],
    [
      { id: 7, release_date: "2027-02-01", title: "Internacional" },
      { id: 8, release_date: "2027-01-01", title: "Solo internacional" },
    ],
    "2026-11-23",
    "2027-11-23"
  );

  assert.deepEqual(
    results.map(({ id, release_date, origenFecha }) => [
      id,
      release_date,
      origenFecha,
    ]),
    [
      [8, "2027-01-01", "internacional"],
      [7, "2027-03-10", "es"],
    ]
  );
});

test("consulta hasta cinco páginas españolas y dos internacionales", async () => {
  const llamadas = [];
  const consultar = (origen) => async (pagina) => {
    llamadas.push([origen, pagina]);
    return {
      results: [{ id: `${origen}-${pagina}` }],
      total_pages: 99,
    };
  };

  const [es, internacional] = await Promise.all([
    obtenerHastaPaginas(consultar("es"), MAX_PAGINAS_DISCOVER_ES),
    obtenerHastaPaginas(
      consultar("internacional"),
      MAX_PAGINAS_DISCOVER_INTERNACIONAL
    ),
  ]);

  assert.equal(llamadas.length, 7);
  assert.deepEqual(
    llamadas.sort((a, b) => a[0].localeCompare(b[0]) || a[1] - b[1]),
    [
      ["es", 1],
      ["es", 2],
      ["es", 3],
      ["es", 4],
      ["es", 5],
      ["internacional", 1],
      ["internacional", 2],
    ]
  );
  assert.equal(es.length, MAX_PAGINAS_DISCOVER_ES);
  assert.equal(internacional.length, MAX_PAGINAS_DISCOVER_INTERNACIONAL);
});
