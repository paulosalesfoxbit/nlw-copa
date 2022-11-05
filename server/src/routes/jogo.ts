import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function JogoRouter(fastify: FastifyInstance) {
  fastify.get("/bolao/:id/jogos", async (req, res) => {
    const getJogosSchema = z.object({
      id: z.string(),
    });

    const { id } = getJogosSchema.parse(req.params);

    const jogos = await prisma.jogo.findMany({
      orderBy: {
        data: "desc",
      },
      include: {
        palpites: {
          where: {
            participante: {
              usuarioId: req.user.sub,
              bolaoId: id,
            },
          },
        },
      },
    });

    return res.send(jogos);
  });
}
