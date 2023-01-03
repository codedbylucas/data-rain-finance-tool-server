import { Injectable } from '@nestjs/common';
import { createUuid } from 'src/app/util/create-uuid';
import { BudgetRequestRepository } from '../repositories/budget-request.repository';
import { CreateBudgetRequestDto } from './dto/create-budget-request.dto';

@Injectable()
export class BudgetRequestService {
  constructor(
    private readonly budgetRequestRepository: BudgetRequestRepository,
  ) {}

  async createBudgetRequest(dto: CreateBudgetRequestDto) {
    const budgetRequestCreated =
      await this.budgetRequestRepository.createBudgetRequest({
        ...dto,
        id: createUuid(),
      });

    return budgetRequestCreated;
  }
}
