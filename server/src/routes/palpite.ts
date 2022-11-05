import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function PalpiteRouter(fastify: FastifyInstance) {
  fastify.get("/palpite/count", async () => {
    const count = await prisma.palpite.count();

    return { count };
  });

  fastify.post("/bolao/:bolaoId/jogos/:jogoId/palpite", async (req, res) => {
    try {
      const criarPalpiteParamsSchema = z.object({
        bolaoId: z.string(),
        jogoId: z.string(),
      });

      const criarPalpiteBodySchema = z.object({
        firstTeamPoints: z.number(),
        secondTeamPoints: z.number(),
      });

      const { bolaoId, jogoId } = criarPalpiteParamsSchema.parse(req.params);
      const { firstTeamPoints, secondTeamPoints } =
        criarPalpiteBodySchema.parse(req.body);

      const participante = await prisma.participante.findUniqueOrThrow({
        where: {
          usuarioId_bolaoId: {
            bolaoId,
            usuarioId: req.user.sub,
          },
        },
      });

      const palpite = await prisma.palpite.findUnique({
        where: {
          jogoId_participanteId: {
            jogoId,
            participanteId: participante.id,
          },
        },
      });

      if (palpite) {
        return res
          .status(400)
          .send({ message: "Você já palpitou neste jogo!" });
      }

      const jogo = await prisma.jogo.findUniqueOrThrow({
        where: { id: jogoId },
      });

      if (jogo.data < new Date()) {
        return res
          .status(400)
          .send({ message: "Jogo com data menor que a data atual!" });
      }

      const criadoParticipante = await prisma.palpite.create({
        data: {
          jogoId,
          participanteId: participante.id,
          firstTeamPoints,
          secondTeamPoints,
        },
      });

      return res.status(201).send(criadoParticipante);
    } catch (e: any) {
      console.error(e);
      return res.status(500).send({ message: "Erro no servidor!" });
    }
  });
}
