import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { serverError } from 'src/app/util/server-error';
import { Repository } from 'typeorm';
import { TeamEntity } from '../entities/team.entity';
import { CreateTeamDto } from '../service/dto/create-team.dto';
import { UpdateTeamDto } from '../service/dto/update-team.dto';
import { DbCreateTeamDto } from './dto/db-create-team.dto';

@Injectable()
export class TeamRepository {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
  ) {}

  async createTeam(data: DbCreateTeamDto): Promise<TeamEntity> {
    const createdTeam = this.teamRepository.create(data);
    const savedTeam = await this.teamRepository
      .save(createdTeam)
      .catch(serverError);
    return savedTeam;
  }

  async findTeamById(id: string): Promise<TeamEntity> {
    const teamOrNull = await this.teamRepository
      .findOne({
        where: { id },
      })
      .catch(serverError);
    return teamOrNull;
  }

  async findAllTeams(): Promise<TeamEntity[]> {
    const teamOrEmpty = await this.teamRepository.find().catch(serverError);
    return teamOrEmpty;
  }

  async updateTeamByEntity(
    team: TeamEntity,
    data: UpdateTeamDto,
  ): Promise<TeamEntity> {
    const teamMerge = this.teamRepository.merge(team, data);
    const teamUpdated = await this.teamRepository
      .save(teamMerge)
      .catch(serverError);
    return teamUpdated;
  }

  async deleteTeamById(id: string): Promise<void> {
    await this.teamRepository.softDelete(id).catch(serverError);
  }
}
