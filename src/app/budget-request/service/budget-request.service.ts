import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Status } from '@prisma/client';
import { AlternativeService } from 'src/app/alternatives/service/alternative.service';
import { UserPayload } from 'src/app/auth/protocols/user-payload';
import { ClientService } from 'src/app/client/service/client.service';
import { QuestionService } from 'src/app/question/service/question.service';
import { UserService } from 'src/app/user/service/user.service';
import { checkHasDuplicates } from 'src/app/util/check-has-duplicates-in-array';
import { createUuid } from 'src/app/util/create-uuid';
import { BudgetRequestEntity } from '../entities/budget-request.entity';
import { FindAllBudgetRequestsResponse } from '../protocols/find-all-budget-requests-response';
import { DbCreateClientResponsesProps } from '../protocols/props/db-create-client-responses.props';
import { BudgetRequestRepository } from '../repositories/budget-request.repository';
import { ApprovedBudgetRequestDto } from './dto/approved-budget-request.dto';
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
    private readonly alternativeService: AlternativeService,
    private readonly userService: UserService,
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

    let amount = 0;
    let totalHours = 0;
    for (const response of responses) {
      if (response.alternativeId) {
        const alternative =
          await this.alternativeService.findAlternativeAndTheirTeams(
            response.alternativeId,
          );

        if (alternative.teams.length > 0) {
          alternative.teams.forEach((team) => {
            amount += team.workHours * team.team.valuePerHour;
            totalHours += team.workHours;
          });
        }
      }
    }

    const budgetRequestCreated =
      await this.budgetRequestRepository.createBudgetRequest({
        id: createUuid(),
        clientId: dto.clientId,
        status: Status.request,
        amount: Number(amount.toFixed(2)),
        totalHours: totalHours,
      });

    const data: DbCreateClientResponsesProps[] = responses.map((response) => ({
      ...response,
      id: createUuid(),
      budgetRequestId: budgetRequestCreated.id,
    }));

    return await this.budgetRequestRepository.createClientResponses(data);
  }

  async approvedBudgetRequest(
    userId: string,
    dto: ApprovedBudgetRequestDto,
  ): Promise<void> {
    const budgetRequest = await this.verifyBudgetRequestExist(
      dto.budgetRequestId,
    );
    const user = await this.userService.findUserById(userId);
    if (budgetRequest.verifyByPreSaleId && user.roleName === 'pre_sale') {
      throw new BadRequestException(
        'Budget request has already been validaded by pre sale',
      );
    }
    if (budgetRequest.verifyByFinancialId && user.roleName === 'financial') {
      throw new BadRequestException(
        'Budget request has already been validaded by financial',
      );
    }
    if (!budgetRequest.verifyByPreSaleId && user.roleName === 'financial') {
      throw new BadRequestException(
        'A budget request needs to be validated first by the pre-sale',
      );
    }

    if (user.roleName === 'pre_sale') {
      await this.budgetRequestRepository.aprrovedByPreSaleBudgetRequest({
        ...dto,
        verify_by_pre_sale_id: userId,
        status: Status.review,
      });
      return;
    }
    if (user.roleName === 'financial') {
      await this.budgetRequestRepository.aprrovedByFinancialBudgetRequest({
        ...dto,
        verify_by_financial_id: userId,
        status: Status.approved,
      });
      return;
    }
  }

  async findAllBudgetRequests(
    user: UserPayload,
  ): Promise<FindAllBudgetRequestsResponse[]> {
    let status: Status;
    if (user.roleName === 'pre_sale') {
      status = Status.request;
    } else if (user.roleName === 'financial') {
      status = Status.review;
    }

    let budgetRequestsOrEmpty =
      await this.budgetRequestRepository.findAllBudgetRequests(status);
    if (budgetRequestsOrEmpty.length === 0) {
      throw new NotFoundException('No budget request found');
    }
    const budgetRequestsOrFormatted = budgetRequestsOrEmpty.map(
      (budgetRequest) => ({
        id: budgetRequest.id,
        status: budgetRequest.status,
        createdAt: this.formattedCurrentDate(budgetRequest.createdAt),
        updatedAt: this.formattedCurrentDate(budgetRequest.updatedAt),
        client: {
          id: budgetRequest.client.id,
          companyName: budgetRequest.client.companyName,
          name: budgetRequest.client.name,
        },
      }),
    );

    return budgetRequestsOrFormatted;
  }

  async verifyBudgetRequestExist(id: string): Promise<BudgetRequestEntity> {
    const budgetRequstOrNull =
      await this.budgetRequestRepository.findBudgetRequestById(id);
    if (!budgetRequstOrNull) {
      throw new BadRequestException(`Budget request with id '${id}' not found`);
    }
    return budgetRequstOrNull;
  }

  formattedCurrentDate(data: Date) {
    const day = data.getDate().toString(),
      dayformatted = day.length == 1 ? '0' + day : day,
      month = (data.getMonth() + 1).toString(),
      monthformatted = month.length == 1 ? '0' + month : month,
      yearformatted = data.getFullYear();
    return dayformatted + '/' + monthformatted + '/' + yearformatted;
  }
}
