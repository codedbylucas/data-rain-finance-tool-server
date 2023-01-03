import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { BudgetRequestEntity } from '../entities/budget-request.entity';
import { DbCreateBudgetRequestrops } from '../protocols/props/db-create-budget-request.props';

@Injectable()
export class BudgetRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBudgetRequest(
    props: DbCreateBudgetRequestrops,
  ): Promise<BudgetRequestEntity> {
    const data: Prisma.BudgetRequestCreateInput = {
      id: props.id,
      client: {
        connect: {
          id: props.clientId,
        },
      },
    };
    const budgetRequestCreated = await this.prisma.budgetRequest
      .create({
        data,
      })
      .catch(serverError);

    return budgetRequestCreated;
  }
}
