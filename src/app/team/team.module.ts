import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './service/team.service';
import { TeamRepository } from './repositories/team.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from './entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TeamEntity])],
  controllers: [TeamController],
  providers: [TeamService, TeamRepository],
})
export class TeamModule {}
