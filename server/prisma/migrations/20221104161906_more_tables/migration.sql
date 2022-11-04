-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "dtCriado" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Participante" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "bolaoId" TEXT NOT NULL,
    CONSTRAINT "Participante_bolaoId_fkey" FOREIGN KEY ("bolaoId") REFERENCES "Bolao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Participante_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Jogo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "data" DATETIME NOT NULL,
    "firstTeamIsoCountry" TEXT NOT NULL,
    "secondTeamIsoContry" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Palpite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstTeamPoints" INTEGER NOT NULL,
    "secondTeamPoints" INTEGER NOT NULL,
    "dtCriado" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jogoId" TEXT NOT NULL,
    CONSTRAINT "Palpite_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "Jogo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bolao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "dtCriado" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criadorId" TEXT,
    CONSTRAINT "Bolao_criadorId_fkey" FOREIGN KEY ("criadorId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Bolao" ("codigo", "dtCriado", "id", "titulo") SELECT "codigo", "dtCriado", "id", "titulo" FROM "Bolao";
DROP TABLE "Bolao";
ALTER TABLE "new_Bolao" RENAME TO "Bolao";
CREATE UNIQUE INDEX "Bolao_codigo_key" ON "Bolao"("codigo");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Participante_usuarioId_bolaoId_key" ON "Participante"("usuarioId", "bolaoId");
