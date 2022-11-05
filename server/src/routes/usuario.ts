import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function UsuarioRouter(fastify: FastifyInstance) {
  fastify.get("/usuario/count", async () => {
    const count = await prisma.usuario.count();

    return { count };
  });
}
