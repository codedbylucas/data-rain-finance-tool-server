import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TeamResponse } from './protocols/team-response';
import { CreateTeamDto } from './service/dto/create-team.dto';
import { UpdateTeamDto } from './service/dto/update-team.dto';
import { TeamService } from './service/team.service';

@Controller('team')
@ApiTags('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @ApiOperation({
    summary: 'Team is created',
  })
  async createTeam(
    @Body() dto: CreateTeamDto,
  ): Promise<BadRequestException | TeamResponse> {
    return await this.teamService.createTeam(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find team by id',
  })
  async findTeamById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BadRequestException | TeamResponse> {
    return await this.teamService.findTeamById(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all teams',
  })
  async findAllTeams(): Promise<BadRequestException | TeamResponse[]> {
    return await this.teamService.findAllTeams();
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a team by id',
  })
  async updateTeamById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTeamDto,
  ): Promise<BadRequestException | void> {
    return await this.teamService.updateTeamById(id, dto);
  }
}
