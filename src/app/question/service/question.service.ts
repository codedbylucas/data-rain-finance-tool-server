import { Injectable } from '@nestjs/common';
import { createUuid } from 'src/app/util/create-uuid';
import { CreateQuestionResponse } from '../protocols/create-question-response';
import { QuestionRepository } from '../repositories/question.repository';
import { CreateQuestionDto } from './dto/create-question.dto';

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
}
