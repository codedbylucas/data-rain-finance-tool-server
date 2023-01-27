import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role, RolesAccess } from '../auth/decorators/roles.decorator';
import { UserPayload } from '../auth/protocols/user-payload';
import { FindAllBudgetRequestsResponse } from './protocols/find-all-budget-requests-response';
import { BudgetRequestService } from './service/budget-request.service';
import { ApprovedBudgetRequestDto } from './service/dto/approved-budget-request.dto';
import { CreateBudgetRequestDto } from './service/dto/create-budget-request.dto';
import { UpdatedBudgetRequestDto } from './service/dto/update-budget-request.dto';

@Controller('budget-request')
@ApiTags('budget-request')
export class BudgetRequestController {
  constructor(private readonly budgetRequestService: BudgetRequestService) {}

  @Post()
  @ApiOperation({
    summary: 'Create budget request',
  })
  async createBudgetRequest(
    @Body() dto: CreateBudgetRequestDto,
  ): Promise<void> {
    return await this.budgetRequestService.createBudgetRequest(dto);
  }

  @Post('approved')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Aproved budget request',
  })
  async approvedBudgetRequest(
    @RolesAccess([Role.preSale, Role.financial]) user: UserPayload,
    @Body() dto: ApprovedBudgetRequestDto,
  ): Promise<void> {
    return await this.budgetRequestService.approvedBudgetRequest(
      user.userId,
      dto,
    );
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find all budget requests',
  })
  async findAllBudgetRequest(
    @RolesAccess([Role.preSale, Role.financial, Role.admin]) user: UserPayload,
  ): Promise<FindAllBudgetRequestsResponse[]> {
    return await this.budgetRequestService.findAllBudgetRequests(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find by id budget request',
  })
  async findBudgetRequestById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @RolesAccess([Role.preSale, Role.financial, Role.admin])
    user: UserPayload,
  ) {
    return await this.budgetRequestService.findBudgetRequestById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update by id budget request ',
  })
  async updateBudgetRequest(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdatedBudgetRequestDto,
  ) {
    return await this.budgetRequestService.updateBudgetRequest(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete by id budget request ',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a Budget Request by id',
  })
  async deleteBudgetRequestById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.budgetRequestService.deleteBudgetRequestById(id);
  }
}
