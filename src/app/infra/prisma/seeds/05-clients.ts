import { Prisma, PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';

export const clients: Prisma.ClientsCreateInput[] = [
  {
    id: uuid(),
    name: 'Lucas Marques',
    companyName: 'company 01',
    email: 'company01@mail.com',
    phone: '(11) 9 9933-9933',
  },
  {
    id: uuid(),
    name: 'João Pedro Thuler',
    companyName: 'company 02',
    email: 'company02@mail.com',
    phone: '(11) 9 9923-9933',
  },
  {
    id: uuid(),
    name: 'Max Cleiton',
    companyName: 'company 03',
    email: 'company03@mail.com',
    phone: '(11) 9 9913-9933',
  },
  {
    id: uuid(),
    name: 'Arlyson Mathias',
    companyName: 'company 04',
    email: 'company04@mail.com',
    phone: '(11) 9 9213-9933',
  },
  {
    id: uuid(),
    name: 'Alexandre Silvestre',
    companyName: 'company 05',
    email: 'company05@mail.com',
    phone: '(11) 9 9113-9933',
  },
  {
    id: uuid(),
    name: 'Vinícius Oliveira Gonçalves',
    companyName: 'company 06',
    email: 'company06@mail.com',
    phone: '(11) 9 9113-9933',
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
