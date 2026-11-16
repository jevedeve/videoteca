-- CreateTable
CREATE TABLE "Pelicula" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "comentario" TEXT,
    "vista" BOOLEAN NOT NULL DEFAULT false,
    "guardadaEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pelicula_pkey" PRIMARY KEY ("id")
);
