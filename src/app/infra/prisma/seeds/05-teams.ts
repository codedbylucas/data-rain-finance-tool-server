import { Prisma, PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';

export const teams: Prisma.TeamsCreateInput[] = [
  {
    id: uuid(),
    name: 'Back-End Developer',
    valuePerHour: 159.42,
  },
  {
    id: uuid(),
    name: 'Front-End Developer',
    valuePerHour: 159.42,
  },
  {
    id: uuid(),
    name: 'Full Stack Developer',
    valuePerHour: 159.42,
  },
  {
    id: uuid(),
    name: 'DevOps',
    valuePerHour: 231.61,
  },
  {
    id: uuid(),
    name: 'Design',
    valuePerHour: 129.22,
  },
  {
    id: uuid(),
    name: 'Cloud computing',
    valuePerHour: 167.15,
  },
];

export const team = async (prisma: PrismaClient) => {
  for (const obj of Object.values(teams)) {
    await prisma.teams.upsert({
      where: { id: obj.id },
      update: {},
      create: {
        ...obj,
      },
    });
  }
};
