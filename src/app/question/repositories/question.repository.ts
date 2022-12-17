import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { QuestionEntity } from '../entities/question.entity';
import { FindQuestionResponse } from '../protocols/find-questions-response';
import { UpdateQuestionDto } from '../service/dto/update-question.dto';
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

  async findQuestionById(id: string): Promise<QuestionEntity> {
    const questionOrNull = await this.prisma.questions
      .findUnique({
        where: { id },
      })
      .catch(serverError);
    return questionOrNull;
  }

  async findAllQuestions(): Promise<FindQuestionResponse[]> {
    const questions = await this.prisma.questions
      .findMany({
        select: {
          id: true,
          description: true,
          alternatives: {
            select: {
              id: true,
              description: true,
            },
          },
        },
      })
      .catch(serverError);
    return questions;
  }

  async updateQuestionById(id: string, data: UpdateQuestionDto): Promise<void> {
    await this.prisma.questions
      .update({
        where: { id },
        data: {
          description: data.description,
        },
      })
      .catch(serverError);
  }

  async deleteQuestionById(id: string): Promise<void> {
    await this.prisma.questions.delete({ where: { id } }).catch(serverError);
  }
}
