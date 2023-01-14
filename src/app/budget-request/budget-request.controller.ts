import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role, RolesAccess } from '../auth/decorators/roles.decorator';
import { FindAllBudgetRequestsResponse } from './protocols/find-all-budget-requests-response';
import { BudgetRequestService } from './service/budget-request.service';
import { ApprovedBudgetRequestDto } from './service/dto/approved-budget-request.dto';
import { CreateBudgetRequestDto } from './service/dto/create-budget-request.dto';

@Controller('budget-request')
@ApiTags('budget-request')
export class BudgetRequestController {
  constructor(private readonly budgetRequestService: BudgetRequestService) {}

  @Post()
  async createBudgetRequest(@Body() dto: CreateBudgetRequestDto) {
    return await this.budgetRequestService.createBudgetRequest(dto);
  }

  @Post('approved')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async approvedBudgetRequest(
    @RolesAccess([Role.preSale, Role.financial]) userId: string,
    @Body() dto: ApprovedBudgetRequestDto,
  ): Promise<void> {
    return await this.budgetRequestService.approvedBudgetRequest(userId, dto);
  }

  @Get()
  async findAllBudgetRequest(): Promise<FindAllBudgetRequestsResponse[]> {
    return await this.budgetRequestService.findAllBudgetRequests();
  }
}
