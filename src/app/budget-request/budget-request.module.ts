import { Module } from '@nestjs/common';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { BudgetRequestRepository } from './repositories/budget-request.repository';
import { BudgetRequestService } from './service/budget-request.service';
import { BudgetRequestController } from './budget-request.controller';
import { ClientModule } from '../client/client.module';
import { QuestionModule } from '../question/question.module';

@Module({
  imports: [PrismaModule, ClientModule, QuestionModule],
  providers: [BudgetRequestService, BudgetRequestRepository],
  exports: [BudgetRequestService],
  controllers: [BudgetRequestController],
})
export class BudgetRequestModule {}
