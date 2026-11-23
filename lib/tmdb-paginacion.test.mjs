import assert from "node:assert/strict";
import test from "node:test";
import {
  crearEnlacePaginaBusqueda,
  consultarPaginaBusquedaTMDB,
  normalizarPaginaBusqueda,
} from "./tmdb-paginacion.ts";

test("normaliza páginas inválidas y limita el máximo de TMDB", () => {
  assert.equal(normalizarPaginaBusqueda(undefined), 1);
  assert.equal(normalizarPaginaBusqueda("0"), 1);
  assert.equal(normalizarPaginaBusqueda("2.5"), 1);
  assert.equal(normalizarPaginaBusqueda(["3", "4"]), 3);
  assert.equal(normalizarPaginaBusqueda("900"), 500);
});

test("consulta solamente la página solicitada y conserva la metadata TMDB", async () => {
  let llamadas = 0;
  const respuesta = await consultarPaginaBusquedaTMDB(
    "movie",
    "Star Wars",
    "test-key",
    "es-ES",
    2,
    async (input, init) => {
      llamadas += 1;
      const url = new URL(input);
      assert.equal(url.pathname, "/3/search/movie");
      assert.equal(url.searchParams.get("query"), "Star Wars");
      assert.equal(url.searchParams.get("language"), "es-ES");
      assert.equal(url.searchParams.get("page"), "2");
      assert.equal(init.next.revalidate, 3600);

      return new Response(
        JSON.stringify({
          page: 2,
          total_pages: 9,
          total_results: 177,
          results: [{ id: 1893, title: "Star Wars: Episode I" }],
        }),
        { status: 200 }
      );
    }
  );

  assert.equal(llamadas, 1);
  assert.equal(respuesta.page, 2);
  assert.equal(respuesta.total_pages, 9);
  assert.equal(respuesta.total_results, 177);
});

test("los enlaces de página conservan query y tipo", () => {
  const enlace = new URL(
    crearEnlacePaginaBusqueda("Star Wars", "pelicula", 2),
    "https://videoteca.test"
  );

  assert.equal(enlace.searchParams.get("q"), "Star Wars");
  assert.equal(enlace.searchParams.get("tipo"), "pelicula");
  assert.equal(enlace.searchParams.get("page"), "2");
});
