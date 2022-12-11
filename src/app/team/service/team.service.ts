import { BadRequestException, Injectable } from '@nestjs/common';
import { createUuid } from 'src/app/util/create-uuid';
import { TeamEntity } from '../entities/team.entity';
import { TeamResponse } from '../protocols/team-response';
import { DbCreateTeamDto } from '../repositories/dto/db-create-team.dto';
import { TeamRepository } from '../repositories/team.repository';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamService {
  constructor(private readonly teamRepository: TeamRepository) {}

  async createTeam(dto: CreateTeamDto): Promise<TeamResponse> {
    const data: DbCreateTeamDto = {
      ...dto,
      id: createUuid(),
    };
    const teamCrated = await this.teamRepository.createTeam(data);
    return {
      id: teamCrated.id,
      name: teamCrated.name,
      valuePerHour: teamCrated.valuePerHour,
    };
  }

  async findTeamById(id: string): Promise<TeamResponse> {
    const teamOrNull = await this.verifyTeamExist(id);
    return {
      id: teamOrNull.id,
      name: teamOrNull.name,
      valuePerHour: teamOrNull.valuePerHour,
    };
  }

  async findAllTeams(): Promise<TeamResponse[]> {
    const teamsOrEmpty = await this.teamRepository.findAllTeams();
    if (!teamsOrEmpty || teamsOrEmpty.length === 0) {
      throw new BadRequestException(`No team was found`);
    }
    const formattedTeams = teamsOrEmpty.map((team) => ({
      id: team.id,
      name: team.name,
      valuePerHour: team.valuePerHour,
    }));
    return formattedTeams;
  }

  async updateTeamById(id: string, dto: UpdateTeamDto): Promise<void> {
    const teamOrNull = await this.verifyTeamExist(id);
    await this.teamRepository.updateTeamByEntity(teamOrNull.id, dto);
  }

  async deleteTeamById(id: string): Promise<void> {
    await this.verifyTeamExist(id);
    await this.teamRepository.deleteTeamById(id);
  }

  async verifyTeamExist(id: string): Promise<TeamEntity> {
    const teamOrNull = await this.teamRepository.findTeamById(id);
    if (!teamOrNull) {
      throw new BadRequestException(`Team with id '${id}' not found`);
    }
    return teamOrNull;
  }
}
