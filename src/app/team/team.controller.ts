import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionAdmin } from '../auth/decorators/admin.decorator';
import { UserPayload } from '../auth/protocols/user-payload';
import { TeamResponse } from './protocols/team-response';
import { CreateTeamDto } from './service/dto/create-team.dto';
import { UpdateTeamDto } from './service/dto/update-team.dto';
import { TeamService } from './service/team.service';

@Controller('team')
@ApiTags('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Team is created',
  })
  async createTeam(
    @PermissionAdmin() admin: UserPayload,
    @Body() dto: CreateTeamDto,
  ): Promise<BadRequestException | TeamResponse> {
    return await this.teamService.createTeam(dto);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find team by id',
  })
  async findTeamById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BadRequestException | TeamResponse> {
    return await this.teamService.findTeamById(id);
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find all teams',
  })
  async findAllTeams(): Promise<BadRequestException | TeamResponse[]> {
    return await this.teamService.findAllTeams();
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a team by id',
  })
  async updateTeamById(
    @PermissionAdmin() admin: UserPayload,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTeamDto,
  ): Promise<BadRequestException | void> {
    return await this.teamService.updateTeamById(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a team by id',
  })
  async deleteTeamById(
    @PermissionAdmin() admin: UserPayload,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BadRequestException | void> {
    return await this.teamService.deleteTeamById(id);
  }
}
