import { BadRequestException, Injectable } from '@nestjs/common';
import { QuestionRepository } from 'src/app/question/repositories/question.repository';
import { createUuid } from 'src/app/util/create-uuid';
import { CreateAlternativeResponse } from '../protocols/create-alternative-response';
import { AlternativeRepository } from '../repositories/alternative.repository';
import { CreateAlternativeDto } from './dto/create-alternative.dto';

@Injectable()
export class AlternativeService {
  constructor(
    private readonly alternativeRepository: AlternativeRepository,
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
