import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const usuario = await prisma.usuario.upsert({
    where: { email: "john.doe@gmail.com" },
    create: {
      nome: "John Doe",
      email: "john.doe@gmail.com",
      avatarUrl: "https://github.com/salespaulo.png",
    },
    update: {},
  });

  const bolao = await prisma.bolao.create({
    data: {
      titulo: "Exemplo Bolao 01",
      codigo: "BOL123",
      criadorId: usuario.id,
      participantes: {
        create: {
          usuarioId: usuario.id,
        },
      },
    },
  });

  await prisma.jogo.create({
    data: {
      data: "2022-11-02T12:00:00.000Z",
      firstTeamIsoCountry: "DE",
      secondTeamIsoCountry: "BR",
    },
  });

  await prisma.jogo.create({
    data: {
      data: "2022-11-02T12:00:00.000Z",
      firstTeamIsoCountry: "BR",
      secondTeamIsoCountry: "AR",

      palpites: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,
          participante: {
            connect: {
              usuarioId_bolaoId: {
                usuarioId: usuario.id,
                bolaoId: bolao.id,
              },
            },
          },
        },
      },
    },
  });
}

main();
