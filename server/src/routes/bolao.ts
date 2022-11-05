import { FastifyInstance, FastifyRequest } from "fastify";
import ShortUniqueId from "short-unique-id";
import z from "zod";

import { prisma } from "../lib/prisma";
import { AuthPlugin } from "../plugins/authenticate";

const getCriadorId = async (req: FastifyRequest): Promise<string | null> => {
  try {
    await req.jwtVerify();
    return req.user.sub;
  } catch (e: any) {
    console.warn(e);
    //podemos ter bolao sendo criado sem criado, orfao
    return null;
  }
};

export async function BolaoRouter(fastify: FastifyInstance) {
  fastify.get("/bolao/:id", { onRequest: [AuthPlugin] }, async (req) => {
    const getBolaoSchema = z.object({
      id: z.string(),
    });

    const { id } = getBolaoSchema.parse(req.params);

    const bolao = await prisma.bolao.findUniqueOrThrow({
      where: { id },
      include: {
        _count: {
          select: {
            participantes: true,
          },
        },
        participantes: {
          select: {
            id: true,
            usuario: {
              select: {
                avatarUrl: true,
              },
            },
          },
          take: 4,
        },
        criador: {
          select: {
            id: true,
            nome: true,
            avatarUrl: true,
          },
        },
      },
    });

    return bolao;
  });

  fastify.get("/bolao/count", { onRequest: [AuthPlugin] }, async () => {
    const count = await prisma.bolao.count();

    return { count };
  });

  fastify.get("/bolao/list", { onRequest: [AuthPlugin] }, async (req, res) => {
    const lista = await prisma.bolao.findMany({
      where: {
        participantes: {
          some: {
            usuarioId: req.user.sub,
          },
        },
      },
      include: {
        _count: {
          select: {
            participantes: true,
          },
        },
        participantes: {
          select: {
            id: true,
            usuario: {
              select: {
                avatarUrl: true,
              },
            },
          },
          take: 4,
        },
        criador: {
          select: {
            id: true,
            nome: true,
            avatarUrl: true,
          },
        },
      },
    });

    return res.send(lista);
  });

  fastify.post(
    "/bolao/:id/participar",
    { onRequest: [AuthPlugin] },
    async (req, res) => {
      const participarSchema = z.object({
        codigo: z.string(),
      });

      const { codigo } = participarSchema.parse(req.body);

      try {
        const bolao = await prisma.bolao.findUniqueOrThrow({
          where: { codigo },
          include: {
            participantes: {
              where: {
                id: req.user.sub,
              },
            },
          },
        });

        const jahParticipaDoBolao = bolao.participantes.length > 0;
        const semCriadorDoBolao = !bolao.criadorId;

        if (jahParticipaDoBolao) {
          return res
            .status(400)
            .send({ message: `Você já está participando deste bolão!` });
        }

        if (semCriadorDoBolao) {
          await prisma.bolao.update({
            where: { id: bolao.id },
            data: {
              criadorId: req.user.sub,
            },
          });
        }

        const criadoParticipante = await prisma.participante.create({
          data: {
            bolaoId: bolao.id,
            usuarioId: req.user.sub,
          },
        });

        return res.status(201).send(criadoParticipante);
      } catch (e: any) {
        console.error(e);
        return res.status(500).send({ message: `Erro no servidor!` });
      }
    }
  );

  fastify.post("/bolao", async (req, res) => {
    const createBody = z.object({
      titulo: z.string(),
    });

    const codigoGen = new ShortUniqueId({ length: 6 });

    const { body } = req;
    const { titulo } = createBody.parse(body);

    const codigo = String(codigoGen()).toUpperCase();
    const criadorId = await getCriadorId(req);
    const participante = criadorId
      ? {
          participantes: {
            create: {
              usuarioId: criadorId,
            },
          },
        }
      : null;

    const bolao = await prisma.bolao.create({
      data: {
        titulo,
        codigo,
        criadorId,
        ...participante,
      },
    });

    return res.status(201).send(bolao);
  });
}
