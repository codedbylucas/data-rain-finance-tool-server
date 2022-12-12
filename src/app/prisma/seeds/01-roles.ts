import { Prisma, PrismaClient } from '@prisma/client';

export const roles: Prisma.RolesCreateInput[] = [
  { name: 'admin', description: 'Chefe geral do sistema' },
  { name: 'financial', description: 'Gerencia valores de projetos' },
  { name: 'pre_sale', description: 'Analiza respostas de clientes' },
  {
    name: 'manager',
    description: 'Aprova chamado de um profissional services',
  },
  {
    name: 'profissional_services',
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
