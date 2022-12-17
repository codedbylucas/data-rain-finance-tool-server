import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { AlternativeEntity } from '../entities/alternative.entity';
import { CreateAlternativeProps } from './props/create-alternative.props';

@Injectable()
export class AlternativeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAlternative(
    props: CreateAlternativeProps,
  ): Promise<AlternativeEntity> {
    const alternative: Prisma.AlternativesCreateInput = {
      id: props.id,
      description: props.description,
      question: {
        connect: {
          id: props.questionId,
        },
      },
    };

    const userCreated = await this.prisma.alternatives
      .create({ data: alternative })
      .catch(serverError);

    return userCreated;
  }
}
