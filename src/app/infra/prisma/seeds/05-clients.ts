import { Prisma, PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';

export const clients: Prisma.ClientsCreateInput[] = [
  {
    id: uuid(),
    companyName: 'company 01',
    email: 'company01@mail.com',
    phone: '11999339933',
    mainContact: 'João',
  },
  {
    id: uuid(),
    companyName: 'company 02',
    email: 'company02@mail.com',
    phone: '11999339933',
    mainContact: 'Lucas',
  },
  {
    id: uuid(),
    companyName: 'company 03',
    email: 'company03@mail.com',
    phone: '11999339933',
    mainContact: 'Arlysson',
  },
  {
    id: uuid(),
    companyName: 'company 04',
    email: 'company04@mail.com',
    phone: '11999339933',
    mainContact: 'Max',
  },
  {
    id: uuid(),
    companyName: 'company 05',
    email: 'company05@mail.com',
    phone: '11999339933',
    mainContact: 'Vini',
  },
  {
    id: uuid(),
    companyName: 'company 06',
    email: 'company06@mail.com',
    phone: '11999339933',
    mainContact: 'Alexandre',
  },
];

export const client = async (prisma: PrismaClient) => {
  for (const obj of Object.values(clients)) {
    await prisma.clients.upsert({
      where: { id: obj.id },
      update: {},
      create: {
        ...obj,
      },
    });
  }
};
