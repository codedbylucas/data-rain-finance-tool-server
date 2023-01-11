import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BudgetRequestService } from './service/budget-request.service';
import { CreateBudgetRequestDto } from './service/dto/create-budget-request.dto';

@Controller('budget-request')
@ApiTags('budget-request')
export class BudgetRequestController {
  constructor(private readonly budgetRequestService: BudgetRequestService) {}

  @Post()
  async createBudgetRequest(@Body() dto: CreateBudgetRequestDto) {
    return await this.budgetRequestService.createBudgetRequest(dto);
  }
}
