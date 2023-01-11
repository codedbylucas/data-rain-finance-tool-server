import { BadRequestException, Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { ClientService } from 'src/app/client/service/client.service';
import { QuestionService } from 'src/app/question/service/question.service';
import { checkHasDuplicates } from 'src/app/util/check-has-duplicates-in-array';
import { createUuid } from 'src/app/util/create-uuid';
import { DbCreateBudgetRequestProps } from '../protocols/props/db-create-budget-request.props';
import { DbCreateClientResponsesProps } from '../protocols/props/db-create-client-responses.props';
import { BudgetRequestRepository } from '../repositories/budget-request.repository';
import {
  BudgetRequest,
  CreateBudgetRequestDto,
} from './dto/create-budget-request.dto';

@Injectable()
export class BudgetRequestService {
  constructor(
    private readonly budgetRequestRepository: BudgetRequestRepository,
    private readonly clientService: ClientService,
    private readonly questionService: QuestionService,
  ) {}

  async createBudgetRequest(dto: CreateBudgetRequestDto) {
    const responses: BudgetRequest[] = dto.responses;
    const questionIds = responses.map((response) => response.questionId);
    const alternativeIds = responses.map((response) => response.alternativeId);
    checkHasDuplicates(questionIds, `Question Id cannot be duplicated`);
    checkHasDuplicates(alternativeIds, `Alternative Id cannot be duplicated`);

    await this.clientService.verifyClientExist(dto.clientId);

    for (const response of responses) {
      if (!response.alternativeId && !response.responseDetails) {
        throw new BadRequestException(`Altarnative id or details required`);
      }
      await this.questionService.veryfiQuestionExist(response.questionId);
      await this.questionService.verifyRelationshipBetweenQuestionAndAlternative(
        {
          questionId: response.questionId,
          alternativeId: response.alternativeId,
        },
      );
    }

    const budgetRequestCreated =
      await this.budgetRequestRepository.createBudgetRequest({
        id: createUuid(),
        clientId: dto.clientId,
        status: Status.request,
        amount: 30,
        totalHours: 22,
      });

    const data: DbCreateClientResponsesProps[] = responses.map((response) => ({
      ...response,
      id: createUuid(),
      budgetRequestId: budgetRequestCreated.id,
    }));

    return await this.budgetRequestRepository.createClientResponses(data);
  }
}
