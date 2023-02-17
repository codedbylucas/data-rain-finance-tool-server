import { Prisma, PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';

export const clients: Prisma.ClientsCreateInput[] = [
  {
    id: uuid(),
    companyName: 'company 01',
    email: 'company01@mail.com',
    phone: '11999339933',
    primaryContactName: 'João',
  },
  {
    id: uuid(),
    companyName: 'company 02',
    email: 'company02@mail.com',
    phone: '11999339933',
    primaryContactName: 'Lucas',
  },
  {
    id: uuid(),
    companyName: 'company 03',
    email: 'company03@mail.com',
    phone: '11999339933',
    primaryContactName: 'Arlysson',
  },
  {
    id: uuid(),
    companyName: 'company 04',
    email: 'company04@mail.com',
    phone: '11999339933',
    primaryContactName: 'Max',
  },
  {
    id: uuid(),
    companyName: 'company 05',
    email: 'company05@mail.com',
    phone: '11999339933',
    primaryContactName: 'Vini',
  },
  {
    id: uuid(),
    companyName: 'company 06',
    email: 'company06@mail.com',
    phone: '11999339933',
    primaryContactName: 'Alexandre',
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
