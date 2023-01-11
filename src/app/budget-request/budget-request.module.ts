import { Module } from '@nestjs/common';
import { AlternativeModule } from '../alternatives/alternative.module';
import { ClientModule } from '../client/client.module';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { QuestionModule } from '../question/question.module';
import { BudgetRequestController } from './budget-request.controller';
import { BudgetRequestRepository } from './repositories/budget-request.repository';
import { BudgetRequestService } from './service/budget-request.service';

@Module({
  imports: [PrismaModule, ClientModule, QuestionModule, AlternativeModule],
  providers: [BudgetRequestService, BudgetRequestRepository],
  exports: [BudgetRequestService],
  controllers: [BudgetRequestController],
})
export class BudgetRequestModule {}
