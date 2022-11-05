import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import Fastify from "fastify";
import { AuthRouter } from "./routes/auth";

import { BolaoRouter } from "./routes/bolao";
import { JogoRouter } from "./routes/jogo";
import { PalpiteRouter } from "./routes/palpite";
import { UsuarioRouter } from "./routes/usuario";

async function start() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(jwt, {
    secret: "meusegredo-nlwcopa",
  });

  await fastify.register(AuthRouter);
  await fastify.register(BolaoRouter);
  await fastify.register(PalpiteRouter);
  await fastify.register(UsuarioRouter);
  await fastify.register(JogoRouter);

  await fastify.listen({ port: 3333, host: "0.0.0.0" });
}

start();
