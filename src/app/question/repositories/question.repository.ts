import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { QuestionEntity } from '../entities/question.entity';
import { DbFindAllQuestionResponse } from '../protocols/db-find-all-questions-response';
import { UpdateQuestionDto } from '../service/dto/update-question.dto';
import { DbCreateQuestionProps } from '../protocols/props/db-create-question.props';
import { RelationshipQuestionAndAlternativeProps } from '../protocols/props/find-relationship-between-question-and-alternative.props';

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

  async findAllQuestions(): Promise<DbFindAllQuestionResponse[]> {
    const questions = await this.prisma.questions
      .findMany({
        select: {
          id: true,
          description: true,
          position: true,
          alternatives: {
            select: {
              id: true,
              description: true,
              teams: {
                select: {
                  team: {
                    select: {
                      id: true,
                      name: true,
                      valuePerHour: true,
                    },
                  },
                  workHours: true,
                },
              },
            },
          },
        },
        orderBy: {
          position: 'asc',
        },
      })
      .catch(serverError);
    return questions;
  }

  async updateQuestionById(id: string, data: UpdateQuestionDto): Promise<void> {
    await this.prisma.questions
      .update({
        where: { id },
        data,
      })
      .catch(serverError);
  }

  async updateQuestionPositionById(
    id: string,
    position: number,
  ): Promise<void> {
    await this.prisma.questions
      .update({
        where: { id },
        data: {
          position,
        },
      })
      .catch(serverError);
  }

  async deleteQuestionById(id: string): Promise<void> {
    await this.prisma.questions.delete({ where: { id } }).catch(serverError);
  }

  async verifyRelation(dto: { questionId: string; alternativeId: string }) {
    await this.prisma.questions
      .findUnique({
        where: { id: dto.questionId },
        select: { alternatives: { where: { id: dto.alternativeId } } },
      })
      .catch(serverError);
  }

  async findRelationshipBetweenQuestionAndAlternative(
    props: RelationshipQuestionAndAlternativeProps,
  ) {
    const questionOrNull = await this.prisma.questions
      .findUnique({
        where: { id: props.questionId },
        select: { alternatives: { where: { id: props.alternativeId } } },
      })
      .catch(serverError);

    return questionOrNull;
  }
}
