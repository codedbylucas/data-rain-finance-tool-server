import { BadRequestException, Injectable } from '@nestjs/common';
import { QuestionRepository } from 'src/app/question/repositories/question.repository';
import { createUuid } from 'src/app/util/create-uuid';
import { CreateAlternativeResponse } from '../protocols/create-alternative-response';
import { AlternativesRepository } from '../repositories/alternatives.repository';
import { CreateAlternativeDto } from './dto/create-alternative.dto';

@Injectable()
export class AlternativesService {
  constructor(
    private readonly alternativeRepository: AlternativesRepository,
    private readonly questionRepository: QuestionRepository,
  ) {}

  async createAlternative(
    dto: CreateAlternativeDto,
  ): Promise<CreateAlternativeResponse> {
    const questionOrNull = await this.questionRepository.findQuestionById(
      dto.questionId,
    );
    if (!questionOrNull) {
      throw new BadRequestException(
        `Question with id '${dto.questionId}' not found`,
      );
    }

    const alternative = await this.alternativeRepository.createAlternative({
      ...dto,
      id: createUuid(),
    });
    return {
      id: alternative.id,
      description: alternative.description,
      questionId: alternative.questionId,
    };
  }
}
