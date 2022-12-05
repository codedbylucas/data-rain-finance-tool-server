import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TeamResponse } from './protocols/team-response';
import { CreateTeamDto } from './service/dto/create-team.dto';
import { TeamService } from './service/team.service';

@Controller('team')
@ApiTags('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @ApiOperation({
    summary: 'Team is created',
  })
  async createTeam(@Body() dto: CreateTeamDto): Promise<TeamResponse> {
    return await this.teamService.createTeam(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find team by id',
  })
  async findTeamById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.teamService.findTeamById(id);
  }
}
