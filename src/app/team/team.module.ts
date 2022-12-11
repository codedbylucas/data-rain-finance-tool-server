import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { TeamRepository } from './repositories/team.repository';
import { TeamService } from './service/team.service';
import { TeamController } from './team.controller';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    PrismaModule,
  ],
  controllers: [TeamController],
  providers: [TeamService, TeamRepository],
})
export class TeamModule {}
