import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../lib/prisma";
import { AuthPlugin } from "../plugins/authenticate";

export async function JogoRouter(fastify: FastifyInstance) {
  fastify.get(
    "/bolao/:id/jogos",
    { onRequest: [AuthPlugin] },
    async (req, res) => {
      const getJogosSchema = z.object({
        id: z.string(),
      });

      const { id } = getJogosSchema.parse(req.params);

      const jogos = await prisma.jogo.findMany({
        where: {
          data: {
            gte: new Date(),
          },
        },
        orderBy: {
          data: "desc",
        },
        include: {
          palpites: {
            where: {
              participante: {
                bolaoId: id,
                usuarioId: req.user.sub,
              },
            },
            include: {
              participante: {
                include: {
                  bolao: true,
                },
              },
            },
          },
        },
      });

      return res.send(jogos);
    }
  );
}
