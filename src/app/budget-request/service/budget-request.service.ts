import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Status } from '@prisma/client';
import { toASCII } from 'punycode';
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
import { UpdatedBudgetRequestDto } from './dto/update-budget-request.dto';

@Injectable()
export class BudgetRequestService {
  constructor(
    private readonly budgetRequestRepository: BudgetRequestRepository,
    private readonly clientService: ClientService,
    private readonly questionService: QuestionService,
    private readonly alternativeService: AlternativeService,
    private readonly userService: UserService,
  ) {}

  async createBudgetRequest(dto: CreateBudgetRequestDto): Promise<void> {
    const responses: BudgetRequest[] = dto.responses;
    const questionIds: string[] = [];
    const alternativeIds: string[] = [];
    for (const response of responses) {
      questionIds.push(response.questionId);
      if (response.alternativeId) {
        alternativeIds.push(response.alternativeId);
      }
    }
    checkHasDuplicates(questionIds, `Question Id cannot be duplicated`);
    checkHasDuplicates(alternativeIds, `Alternative Id cannot be duplicated`);
    await this.clientService.verifyClientExist(dto.clientId);

    for (const response of responses) {
      if (!response.alternativeId && !response.responseDetails) {
        throw new BadRequestException(`Altarnative id or details required`);
      }
      if (!response.alternativeId) {
        delete response.alternativeId;
      }
      await this.questionService.veryfiQuestionExist(response.questionId);
      if (response.alternativeId) {
        await this.questionService.verifyRelationshipBetweenQuestionAndAlternative(
          {
            questionId: response.questionId,
            alternativeId: response.alternativeId,
          },
        );
      }
    }

    let amount = 0;
    let totalHours = 0;
    const clientsResponsesPartial: DbCreateClientResponsesProps[] = [];

    for (const response of responses) {
      if (response.alternativeId) {
        const alternative =
          await this.alternativeService.findAlternativeAndTheirTeams(
            response.alternativeId,
          );

        if (alternative.teams.length > 0) {
          let workHours = 0;
          let valuePerHour = 0;
          alternative.teams.forEach((alternativesTeams) => {
            amount += alternativesTeams.team.valuePerHour;
            totalHours += alternativesTeams.workHours;

            valuePerHour += alternativesTeams.team.valuePerHour;
            workHours += alternativesTeams.workHours;
          });

          clientsResponsesPartial.push({
            id: createUuid(),
            valuePerHour: valuePerHour,
            workHours: workHours,
            responseDetails: response.responseDetails,
            alternativeId: response.alternativeId,
            questionId: response.questionId,
            budgetRequestId: 'id',
          });
          workHours = 0;
          valuePerHour = 0;
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

    const data: DbCreateClientResponsesProps[] = clientsResponsesPartial.map(
      (response) => {
        if (response.alternativeId === '') {
          delete response.alternativeId;
        }
        if (response.responseDetails === '') {
          delete response.responseDetails;
        }
        return {
          ...response,
          budgetRequestId: budgetRequestCreated.id,
        };
      },
    );
    await this.budgetRequestRepository.createClientResponses(data);
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
    const status = this.returnStatusThatUserHasPermission(user.roleName);
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
        },
      }),
    );

    return budgetRequestsOrFormatted;
  }

  async findBudgetRequestById(id: string) {
    const budgetRequestOrNull =
      await this.budgetRequestRepository.findBudgetRequestByIdWithClient(id);
    if (!budgetRequestOrNull) {
      throw new NotFoundException(`Budget request with id '${id}' not found`);
    }

    delete Object.assign(budgetRequestOrNull, {
      ['formResponses']: budgetRequestOrNull['clientsResponses'],
    })['clientsResponses'];
    Object.assign(budgetRequestOrNull, budgetRequestOrNull, {
      createdAt: this.formattedCurrentDate(budgetRequestOrNull.createdAt),
      updatedAt: this.formattedCurrentDate(budgetRequestOrNull.updatedAt),
    });

    return budgetRequestOrNull;
  }

  async updateBudgetRequest(dto: UpdatedBudgetRequestDto): Promise<void> {
    await this.verifyBudgetRequestExist(dto.budgetRequestId);
    for (const response of dto.formResponses) {
      if (!response.valuePerHour && !response.workHours) {
        throw new BadRequestException(
          `It is necessary to inform 'valuePerHour' or 'workHours'`,
        );
      }
      await this.verifyClientResponsesExist(response.id);
      await this.budgetRequestRepository.updateClientResponse(response);
    }
    const budgetRequest =
      await this.budgetRequestRepository.findBudgetRequestByIdWithClient(
        dto.budgetRequestId,
      );

    let workHours = 0;
    let valuePerHour = 0;
    budgetRequest.clientsResponses.map((response) => {
      workHours += response.workHours;
      valuePerHour += response.valuePerHour;
    });
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

  returnStatusThatUserHasPermission(roleName: string): Status {
    let status: Status;
    if (roleName === 'pre_sale') {
      status = Status.request;
    } else if (roleName === 'financial') {
      status = Status.review;
    }
    return status;
  }

  async verifyClientResponsesExist(id: string): Promise<void> {
    const clientResponsesOrNull =
      await this.budgetRequestRepository.findClientResponses(id);
    if (!clientResponsesOrNull) {
      throw new BadRequestException(
        `Form response with id '${id}' not found to update`,
      );
    }
  }
}
