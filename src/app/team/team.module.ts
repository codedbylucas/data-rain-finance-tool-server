import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './service/team.service';
import { TeamRepository } from './repositories/team.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from './entities/team.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamEntity]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [TeamController],
  providers: [TeamService, TeamRepository],
})
export class TeamModule {}
