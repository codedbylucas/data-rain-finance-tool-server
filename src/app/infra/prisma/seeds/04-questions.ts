import { Prisma, PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';

export const questions: Prisma.QuestionsCreateInput[] = [
  {
    id: uuid(),
    description: 'Qual a Região em que a aplicação pode ficar alocada?',
  },
  {
    id: uuid(),
    description: 'Quantas máquinas serão migradas?',
  },
  {
    id: uuid(),
    description: 'Qual Sistema operacional?',
  },
  {
    id: uuid(),
    description: 'Quanto de vCpu tem as maquinas?',
  },
  {
    id: uuid(),
    description: 'Quanto de memória Ram tem as maquinas?',
  },
  {
    id: uuid(),
    description: 'Quanto de armazenamento das maquinas? SSD ou HD?',
  },
  {
    id: uuid(),
    description: 'Quais parâmetros de backup?',
  },
  {
    id: uuid(),
    description: 'Quantas horas no mês as maquinas ficam em uso?',
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
