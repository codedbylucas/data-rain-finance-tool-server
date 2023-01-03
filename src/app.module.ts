import { Module } from '@nestjs/common';
import { AuthModule } from './app/auth/auth.module';
import { PrismaModule } from './app/infra/prisma/prisma.module';
import { TeamModule } from './app/team/team.module';
import { UserModule } from './app/user/user.module';
import { MailModule } from './app/infra/mail/mail.module';
import { CriptographyModule } from './app/infra/criptography/criptography.module';
import { QuestionModule } from './app/question/question.module';
import { AlternativeModule } from './app/alternatives/alternative.module';
import { AlternativeTeamModule } from './app/alternative-team/alternative-team.module';
import { ClientModule } from './app/client/client.module';
import { RoleModule } from './app/role/role.module';
import { BudgetRequestModule } from './app/budget-request/budget-request.module';

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
    AlternativeTeamModule,
    ClientModule,
    RoleModule,
    BudgetRequestModule,
  ],
})
export class AppModule {}
