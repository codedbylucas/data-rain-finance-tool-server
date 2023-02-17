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
      position: {
        connect: {
          name: 'Estagiário',
        },
      },
      allocated: false,
      role: {
        connect: {
          name: 'admin',
        },
      },
    },
    {
      id: uuid(),
      name: 'Pre Sale',
      email: 'presale@mail.com',
      password: 'Abcd@1234',
      billable: false,
      allocated: false,
      position: {
        connect: {
          name: 'Project manager',
        },
      },
      role: {
        connect: {
          name: 'pre sale',
        },
      },
    },
    {
      id: uuid(),
      name: 'financial',
      email: 'financial@mail.com',
      password: 'Abcd@1234',
      billable: false,
      position: {
        connect: {
          name: 'Cloud Solution Architect',
        },
      },
      allocated: false,
      role: {
        connect: {
          name: 'financial',
        },
      },
    },
    {
      id: uuid(),
      name: 'P.S.',
      email: 'ps@mail.com',
      password: 'Abcd@1234',
      billable: false,
      position: {
        connect: {
          name: 'Account Manager',
        },
      },
      allocated: false,
      role: {
        connect: {
          name: 'professional services',
        },
      },
    },
    {
      id: uuid(),
      name: 'Manager',
      email: 'manager@mail.com',
      password: 'Abcd@1234',
      billable: false,
      position: {
        connect: {
          name: 'IT Assistant',
        },
      },
      allocated: false,
      role: {
        connect: {
          name: 'manager',
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
      where: { email: obj.email },
      update: {},
      create: {
        ...obj,
      },
    });
  }
};
