import { Prisma, PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';

export const positions: Prisma.PositionsCreateInput[] = [
  {
    id: uuid(),
    name: 'Estagiário',
  },
  {
    id: uuid(),
    name: 'Project manager',
  },
  {
    id: uuid(),
    name: 'Cloud Solution Architect',
  },
  {
    id: uuid(),
    name: 'Account Manager',
  },
  {
    id: uuid(),
    name: 'IT Assistant',
  },
  {
    id: uuid(),
    name: 'Solutions Architect',
  },
  {
    id: uuid(),
    name: 'Analista de Desenvolvimento de Sistemas',
  },
  {
    id: uuid(),
    name: 'Development',
  },
];

export const position = async (prisma: PrismaClient) => {
  for (const obj of Object.values(positions)) {
    await prisma.positions.upsert({
      where: { name: obj.name },
      update: {},
      create: {
        ...obj,
      },
    });
  }
};
