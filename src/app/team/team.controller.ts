import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateTeamResponse } from './protocols/create-team-response';
import { CreateTeamDto } from './service/dto/create-team.dto';
import { TeamService } from './service/team.service';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @ApiOperation({
    summary: 'Team is created',
  })
  async createTeam(@Body() dto: CreateTeamDto): Promise<CreateTeamResponse> {
    return await this.teamService.createTeam(dto);
  }
}
