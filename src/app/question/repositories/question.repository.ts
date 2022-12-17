import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { QuestionEntity } from '../entities/question.entity';
import { FindQuestionResponse } from '../protocols/find-all-questions-response';
import { DbCreateQuestionProps } from './props/db-create-question.props';

@Injectable()
export class QuestionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createQuestion(data: DbCreateQuestionProps): Promise<QuestionEntity> {
    const question = await this.prisma.questions
      .create({ data })
      .catch(serverError);
    return question;
  }

  async findAllQuestions(): Promise<FindQuestionResponse[]> {
    const questions = await this.prisma.questions.findMany({
      select: {
        id: true,
        description: true,
      },
    });
    return questions;
  }
}
