/*
  Warnings:

  - A unique constraint covering the columns `[jogoId,participanteId]` on the table `Palpite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Palpite_jogoId_participanteId_key" ON "Palpite"("jogoId", "participanteId");
