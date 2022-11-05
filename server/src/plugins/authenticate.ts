import { FastifyRequest } from "fastify";

export async function AuthPlugin(req: FastifyRequest) {
  await req.jwtVerify();
}
