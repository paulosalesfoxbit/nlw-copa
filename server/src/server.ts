import cors from "@fastify/cors";
import Fastify from "fastify";

import { PrismaClient } from "@prisma/client";
import ShortUniqueId from "short-unique-id";
import z from "zod";

const prisma = new PrismaClient({
  log: ["query"],
});

async function start() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  fastify.get("/usuario/count", async () => {
    const count = await prisma.usuario.count();

    return { count };
  });

  fastify.get("/palpite/count", async () => {
    const count = await prisma.palpite.count();

    return { count };
  });

  fastify.get("/bolao/count", async () => {
    const count = await prisma.bolao.count();

    return { count };
  });

  fastify.post("/bolao", async (req, res) => {
    const createBody = z.object({
      titulo: z.string(),
    });

    const codigoGen = new ShortUniqueId({ length: 6 });

    const { body } = req;
    const { titulo } = createBody.parse(body);
    const codigo = String(codigoGen()).toUpperCase();

    const bolao = await prisma.bolao.create({
      data: {
        titulo,
        codigo,
      },
    });

    return res.status(201).send(bolao);
  });

  await fastify.listen({ port: 3333 /*host: "0.0.0.0"*/ });
}

start();
