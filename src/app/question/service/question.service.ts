import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createUuid } from 'src/app/util/create-uuid';
import { QuestionEntity } from '../entities/question.entity';
import { CreateQuestionResponse } from '../protocols/create-question-response';
import { FindQuestionResponse } from '../protocols/find-questions-response';
import { QuestionRepository } from '../repositories/question.repository';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionService {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async createQuestion(
    dto: CreateQuestionDto,
  ): Promise<CreateQuestionResponse> {
    const questionOrError = await this.questionRepository.createQuestion({
      ...dto,
      id: createUuid(),
    });
    return {
      id: questionOrError.id,
      description: questionOrError.description,
    };
  }

  async findAllQuestions(): Promise<FindQuestionResponse[]> {
    const questions = await this.questionRepository.findAllQuestions();
    if (questions.length === 0) {
      throw new NotFoundException('Questions not found');
    }
    return questions;
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
}
