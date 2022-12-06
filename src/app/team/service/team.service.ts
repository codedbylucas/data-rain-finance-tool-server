import { BadRequestException, Injectable } from '@nestjs/common';
import { TeamResponse } from '../protocols/team-response';
import { TeamRepository } from '../repositories/team.repository';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamService {
  constructor(private readonly teamRepository: TeamRepository) {}

  async createTeam(dto: CreateTeamDto): Promise<TeamResponse> {
    const teamCrated = await this.teamRepository.createTeam(dto);
    return {
      id: teamCrated.id,
      name: teamCrated.name,
      valuePerHour: teamCrated.valuePerHour,
    };
  }

  async findTeamById(id: string): Promise<TeamResponse> {
    const teamOrNull = await this.teamRepository.findTeamById(id);
    if (!teamOrNull) {
      throw new BadRequestException(`Team with id '${id}' not found`);
    }
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
    const teamOrNull = await this.teamRepository.findTeamById(id);
    if (!teamOrNull) {
      throw new BadRequestException(`Team with id '${id}' not found`);
    }
    await this.teamRepository.updateTeamByEntity(teamOrNull, dto);
  }
}
