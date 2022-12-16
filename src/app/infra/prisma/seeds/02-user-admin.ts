import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export const userAdmin = async (): Promise<Prisma.UsersCreateInput[]> => {
  const admin: Prisma.UsersCreateInput[] = [
    {
      id: '123',
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
  ];
  return admin;
};

export const users = async (prisma: PrismaClient) => {
  for (const obj of Object.values(await userAdmin())) {
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
