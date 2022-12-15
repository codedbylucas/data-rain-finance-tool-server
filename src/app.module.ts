import { Module } from '@nestjs/common';
import { AuthModule } from './app/auth/auth.module';
import { PrismaModule } from './app/infra/prisma/prisma.module';
import { TeamModule } from './app/team/team.module';
import { UserModule } from './app/user/user.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, TeamModule],
})
export class AppModule {}
