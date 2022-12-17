import { Module } from '@nestjs/common';
import { AuthModule } from './app/auth/auth.module';
import { PrismaModule } from './app/infra/prisma/prisma.module';
import { TeamModule } from './app/team/team.module';
import { UserModule } from './app/user/user.module';
import { MailModule } from './app/infra/mail/mail.module';
import { CriptographyModule } from './app/infra/criptography/criptography.module';
import { QuestionModule } from './app/question/question.module';
import { AlternativesModule } from './app/alternatives/alternatives.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    TeamModule,
    MailModule,
    CriptographyModule,
    QuestionModule,
    AlternativesModule,
  ],
})
export class AppModule {}
