import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createUuid } from 'src/app/util/create-uuid';
import { QuestionEntity } from '../entities/question.entity';
import { CreateQuestionResponse } from '../protocols/create-question-response';
import { FindAllQuestionsResponse } from '../protocols/find-all-questions-response';
import { RelationshipQuestionAndAlternativeProps } from '../protocols/props/find-relationship-between-question-and-alternative.props';
import { QuestionRepository } from '../repositories/question.repository';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionService {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async createQuestion(
    dto: CreateQuestionDto,
  ): Promise<CreateQuestionResponse> {
    const questionsOrEmpty = await this.questionRepository.findAllQuestions();
    const position = questionsOrEmpty.length + 1;

    const questionOrError = await this.questionRepository.createQuestion({
      ...dto,
      id: createUuid(),
      position,
    });
    return {
      id: questionOrError.id,
      description: questionOrError.description,
    };
  }

  async findAllQuestions(): Promise<FindAllQuestionsResponse[]> {
    const questions = await this.questionRepository.findAllQuestions();
    if (questions.length === 0) {
      throw new NotFoundException('Questions not found');
    }
    const questionsReponse: FindAllQuestionsResponse[] = questions.map(
      (question) => ({
        id: question.id,
        description: question.description,
        position: question.position,
        alternatives: question.alternatives.map((alternative) => ({
          id: alternative.id,
          description: alternative.description,
          teams: alternative.teams.map((team, i) => ({
            id: team.team.id,
            name: team.team.name,
            valuePerHour: team.team.valuePerHour,
            workHours: alternative.teams[i].workHours,
          })),
        })),
      }),
    );

    return questionsReponse;
  }

  async updateQuestionById(id: string, dto: UpdateQuestionDto): Promise<void> {
    await this.veryfiQuestionExist(id);
    await this.questionRepository.updateQuestionById(id, dto);
  }

  async deleteQuestionById(id: string): Promise<void> {
    await this.veryfiQuestionExist(id);
    await this.questionRepository.deleteQuestionById(id);
  }

  async veryfiQuestionExist(id: string): Promise<QuestionEntity> {
    const questionOrNull = await this.questionRepository.findQuestionById(id);
    if (!questionOrNull) {
      throw new BadRequestException(`Question with '${id}' not found`);
    }
    return questionOrNull;
  }

  async verifyRelationshipBetweenQuestionAndAlternative(
    props: RelationshipQuestionAndAlternativeProps,
  ): Promise<void> {
    const relation =
      await this.questionRepository.findRelationshipBetweenQuestionAndAlternative(
        props,
      );

    if (relation.alternatives.length === 0) {
      throw new BadRequestException(
        `Alternative with id '${props.alternativeId}' is not related to the question with id '${props.questionId}'`,
      );
    }
  }
}
