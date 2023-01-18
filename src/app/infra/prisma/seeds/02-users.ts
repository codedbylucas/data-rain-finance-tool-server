import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export const users = async (): Promise<Prisma.UsersCreateInput[]> => {
  const users: Prisma.UsersCreateInput[] = [
    {
      id: uuid(),
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'Admin@1234',
      billable: false,
      position: 'Admin',
      allocated: false,
      role: {
        connect: {
          name: 'admin',
        },
      },
    },
    {
      id: uuid(),
      name: 'User 01',
      email: 'user01@mail.com',
      password: 'Abcd@1234',
      billable: false,
      position: 'Dev Ops',
      allocated: false,
      role: {
        connect: {
          name: 'profissional_services',
        },
      },
    },
    {
      id: uuid(),
      name: 'User 02',
      email: 'user02@mail.com',
      password: 'Abcd@1234',
      billable: false,
      position: 'Back-end developer',
      allocated: false,
      role: {
        connect: {
          name: 'profissional_services',
        },
      },
    },
    {
      id: uuid(),
      name: 'User 03',
      email: 'user03@mail.com',
      password: 'Abcd@1234',
      billable: false,
      position: 'Front-end developer',
      allocated: false,
      role: {
        connect: {
          name: 'profissional_services',
        },
      },
    },
  ];
  return users;
};

export const user = async (prisma: PrismaClient) => {
  for (const obj of Object.values(await users())) {
    obj.id = uuid();
    obj.password = await bcrypt.hash(obj.password, 12);

    await prisma.users.upsert({
      where: { id: obj.id },
      update: {},
      create: {
        ...obj,
      },
    });
  }
};
