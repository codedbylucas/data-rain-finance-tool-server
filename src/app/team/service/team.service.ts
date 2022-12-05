import { Injectable } from '@nestjs/common';
import { CreateTeamResponse } from '../protocols/create-team-response';
import { TeamRepository } from '../repositories/team.repository';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamService {
  constructor(private readonly teamRepository: TeamRepository) {}

  async createTeam(dto: CreateTeamDto): Promise<CreateTeamResponse> {
    const teamCrated = await this.teamRepository.createTeam(dto);
    return {
      id: teamCrated.id,
      name: teamCrated.name,
    };
  }
}
