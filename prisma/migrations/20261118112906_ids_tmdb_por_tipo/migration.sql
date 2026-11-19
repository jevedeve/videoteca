/*
  Warnings:

  - A unique constraint covering the columns `[tipo,tmdbId]` on the table `Pelicula` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Pelicula_tmdbId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Pelicula_tipo_tmdbId_key" ON "Pelicula"("tipo", "tmdbId");
