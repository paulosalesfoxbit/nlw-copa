/*
  Warnings:

  - You are about to drop the column `secondTeamIsoContry` on the `Jogo` table. All the data in the column will be lost.
  - Added the required column `secondTeamIsoCountry` to the `Jogo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participanteId` to the `Palpite` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Jogo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "data" DATETIME NOT NULL,
    "firstTeamIsoCountry" TEXT NOT NULL,
    "secondTeamIsoCountry" TEXT NOT NULL
);
INSERT INTO "new_Jogo" ("data", "firstTeamIsoCountry", "id") SELECT "data", "firstTeamIsoCountry", "id" FROM "Jogo";
DROP TABLE "Jogo";
ALTER TABLE "new_Jogo" RENAME TO "Jogo";
CREATE TABLE "new_Palpite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstTeamPoints" INTEGER NOT NULL,
    "secondTeamPoints" INTEGER NOT NULL,
    "dtCriado" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jogoId" TEXT NOT NULL,
    "participanteId" TEXT NOT NULL,
    CONSTRAINT "Palpite_participanteId_fkey" FOREIGN KEY ("participanteId") REFERENCES "Participante" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Palpite_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "Jogo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Palpite" ("dtCriado", "firstTeamPoints", "id", "jogoId", "secondTeamPoints") SELECT "dtCriado", "firstTeamPoints", "id", "jogoId", "secondTeamPoints" FROM "Palpite";
DROP TABLE "Palpite";
ALTER TABLE "new_Palpite" RENAME TO "Palpite";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
