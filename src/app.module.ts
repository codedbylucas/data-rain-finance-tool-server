import { Module } from '@nestjs/common';
import { AlternativeModule } from './app/alternatives/alternative.module';
import { AuthModule } from './app/auth/auth.module';
import { CriptographyModule } from './app/infra/criptography/criptography.module';
import { MailModule } from './app/infra/mail/mail.module';
import { PrismaModule } from './app/infra/prisma/prisma.module';
import { QuestionModule } from './app/question/question.module';
import { TeamModule } from './app/team/team.module';
import { UserModule } from './app/user/user.module';

import { BudgetRequestModule } from './app/budget-request/budget-request.module';
import { ClientModule } from './app/client/client.module';
import { RoleModule } from './app/role/role.module';
import { ProjectModule } from './app/project/project.module';
import { NormalHourModule } from './app/normal-hour/normal-hour.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    TeamModule,
    MailModule,
    CriptographyModule,
    QuestionModule,
    AlternativeModule,
    ClientModule,
    RoleModule,
    BudgetRequestModule,
    ProjectModule,
    NormalHourModule,
  ],
})
export class AppModule {}
