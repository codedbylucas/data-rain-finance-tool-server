import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { TeamEntity } from '../entities/team.entity';
import { UpdateTeamDto } from '../service/dto/update-team.dto';
import { DbCreateTeamProps } from './props/db-create-team.props';

@Injectable()
export class TeamRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTeam(data: DbCreateTeamProps): Promise<TeamEntity> {
    const teamCreated = await this.prisma.teams
      .create({ data })
      .catch(serverError);
    return teamCreated;
  }

  async findTeamById(id: string): Promise<TeamEntity> {
    const team = await this.prisma.teams
      .findUnique({ where: { id } })
      .catch(serverError);
    return team;
  }

  async findAllTeams(): Promise<TeamEntity[]> {
    const teams = await this.prisma.teams.findMany().catch(serverError);
    return teams;
  }

  async updateTeamByEntity(
    id: string,
    data: UpdateTeamDto,
  ): Promise<TeamEntity> {
    const teamUpdated = await this.prisma.teams
      .update({ where: { id }, data })
      .catch(serverError);
    return teamUpdated;
  }

  async deleteTeamById(id: string): Promise<void> {
    await this.prisma.teams.delete({ where: { id } }).catch(serverError);
  }
}
