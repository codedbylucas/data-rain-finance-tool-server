import { Prisma, PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';

export const roles: Prisma.RolesCreateInput[] = [
  {
    id: uuid(),
    name: 'admin',
    description: 'Chefe geral do sistema',
  },
  {
    id: uuid(),
    name: 'financial',
    description: 'Gerencia valores de projetos',
  },
  {
    id: uuid(),
    name: 'pre sale',
    description: 'Analiza respostas de clientes',
  },
  {
    id: uuid(),
    name: 'manager',
    description: 'Aprova chamado de um profissional services',
  },
  {
    id: uuid(),
    name: 'profissional services',
    description: 'Funcionário alocado em projetos',
  },
];

export const role = async (prisma: PrismaClient) => {
  for (const obj of Object.values(roles)) {
    await prisma.roles.upsert({
      where: { name: obj.name },
      update: {},
      create: {
        ...obj,
      },
    });
  }
};
