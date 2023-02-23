import { Prisma, PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';

export const questions: Prisma.QuestionsCreateInput[] = [
  {
    id: uuid(),
    description: 'Qual a Região em que a aplicação pode ficar alocada?',
    position: 1,
  },
  {
    id: uuid(),
    description: 'Quantas máquinas serão migradas?',
    position: 2,
  },
  {
    id: uuid(),
    description: 'Qual Sistema operacional?',
    position: 3,
  },
  {
    id: uuid(),
    description: 'Quanto de vCpu tem as maquinas?',
    position: 4,
  },
  {
    id: uuid(),
    description: 'Quanto de memória Ram tem as maquinas?',
    position: 5,
  },
  {
    id: uuid(),
    description: 'Qual o armazenamento das maquinas?',
    position: 6,
  },
];

export const question = async (prisma: PrismaClient) => {
  for (const obj of Object.values(questions)) {
    await prisma.questions.upsert({
      where: { id: obj.id },
      update: {},
      create: {
        ...obj,
      },
    });
  }
};
