import { FastifyInstance } from "fastify";
import z from "zod";

import { prisma } from "../lib/prisma";
import { AuthPlugin } from "../plugins/authenticate";

export async function AuthRouter(fastify: FastifyInstance) {
  fastify.get("/me", { onRequest: [AuthPlugin] }, async (req, res) => {
    return res.send({ user: req.user });
  });

  fastify.post("/signUp", async (req, res) => {
    const createUserBody = z.object({
      access_token: z.string(),
    });

    const { access_token } = createUserBody.parse(req.body);
    const resUsuario = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const dataUsuario = await resUsuario.json();

    const userInfoSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url(),
    });

    const userInfo = userInfoSchema.parse(dataUsuario);

    console.log("...... Google.userinfo", userInfo);

    const criadoUsuario = await prisma.usuario.upsert({
      where: {
        email: userInfo.email,
      },
      create: {
        googleId: userInfo.id,
        email: userInfo.email,
        nome: userInfo.name,
        avatarUrl: userInfo.picture,
      },
      update: {},
    });

    const token = fastify.jwt.sign(
      {
        nome: criadoUsuario.nome,
        avatarUrl: criadoUsuario.avatarUrl,
      },
      {
        sub: criadoUsuario.id,
        // Não deixar tão alto alem de 1 dia em prod, fazer refresh token
        expiresIn: "7 days",
      }
    );

    return res.status(200).send(token);
  });
}
