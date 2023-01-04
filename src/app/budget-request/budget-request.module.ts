import { Module } from '@nestjs/common';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { BudgetRequestRepository } from './repositories/budget-request.repository';
import { BudgetRequestService } from './service/budget-request.service';

@Module({
  imports: [PrismaModule],
  providers: [BudgetRequestService, BudgetRequestRepository],
  exports: [BudgetRequestService],
})
export class BudgetRequestModule {}
