import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { AlternativeEntity } from '../entities/alternative.entity';
import { UpdateAlternativeDto } from '../service/dto/update-alternative.dto';
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

    const alternativeCreated = await this.prisma.alternatives
      .create({ data: alternative })
      .catch(serverError);

    return alternativeCreated;
  }

  async findAlternativeById(id: string): Promise<AlternativeEntity> {
    const alternativeOrNull = await this.prisma.alternatives
      .findUnique({ where: { id } })
      .catch(serverError);
    return alternativeOrNull;
  }

  async updateAlternativeById(
    id: string,
    dto: UpdateAlternativeDto,
  ): Promise<AlternativeEntity> {
    const alternativeUpdated = await this.prisma.alternatives
      .update({
        where: { id },
        data: { description: dto.description },
      })
      .catch(serverError);
    return alternativeUpdated;
  }

  async deleteAlternativeById(id: string): Promise<void> {
    await this.prisma.alternatives.delete({ where: { id } }).catch(serverError);
  }
}
