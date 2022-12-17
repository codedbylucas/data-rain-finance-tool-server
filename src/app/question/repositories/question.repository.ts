import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { QuestionEntity } from '../entities/question.entity';
import { DbCreateQuestionProps } from './props/db-create-question.props';

@Injectable()
export class QuestionRepository {
  constructor(private readonly prisma: PrismaService) {}
  // private readonly prismaClient = new PrismaClient();

  async createQuestion(data: DbCreateQuestionProps): Promise<QuestionEntity> {
    const question = await this.prisma.questions
      .create({ data })
      .catch(serverError);
    return question;
  }
}
