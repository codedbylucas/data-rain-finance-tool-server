import { Module } from '@nestjs/common';
import { AlternativeModule } from '../alternatives/alternative.module';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { TeamModule } from '../team/team.module';
import { AlternativeTeamController } from './alternative-team.controller';
import { AlternativeTeamRepository } from './repositories/alternative-team.repository';
import { AlternativeTeamService } from './service/alternative-team.service';

@Module({
  imports: [PrismaModule, AlternativeModule, TeamModule],
  controllers: [AlternativeTeamController],
  providers: [AlternativeTeamService, AlternativeTeamRepository],
})
export class AlternativeTeamModule {}
