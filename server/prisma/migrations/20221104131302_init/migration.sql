-- CreateTable
CREATE TABLE "Bolao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "dtCriado" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Bolao_codigo_key" ON "Bolao"("codigo");
