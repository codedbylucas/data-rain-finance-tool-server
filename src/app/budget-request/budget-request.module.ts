import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AlternativeModule } from '../alternatives/alternative.module';
import { ClientModule } from '../client/client.module';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { QuestionModule } from '../question/question.module';
import { UserModule } from '../user/user.module';
import { BudgetRequestController } from './budget-request.controller';
import { BudgetRequestRepository } from './repositories/budget-request.repository';
import { BudgetRequestService } from './service/budget-request.service';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    PrismaModule,
    ClientModule,
    QuestionModule,
    AlternativeModule,
    UserModule,
  ],
  providers: [BudgetRequestService, BudgetRequestRepository],
  exports: [BudgetRequestService],
  controllers: [BudgetRequestController],
})
export class BudgetRequestModule {}
