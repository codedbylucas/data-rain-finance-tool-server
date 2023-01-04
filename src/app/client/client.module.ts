import { Module } from '@nestjs/common';
import { ClientService } from './service/client.service';
import { ClientController } from './client.controller';
import { ClientRepository } from './repositories/client.repository';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { BudgetRequestModule } from '../budget-request/budget-request.module';
import { QuestionModule } from '../question/question.module';

@Module({
  imports: [PrismaModule, BudgetRequestModule, QuestionModule],
  providers: [ClientService, ClientRepository],
  controllers: [ClientController],
})
export class ClientModule {}
