import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateAlternativeTeamResponse } from './protocols/update-alternative-team-response';
import { AlternativeTeamService } from './service/alternative-team.service';
import { CreateAlternativeTeamDto } from './service/dto/create-alternative-team.dto';
import { UpdateAlternativeTeamDto } from './service/dto/update-alternative-team.dto';

@Controller('alternative-team')
@ApiTags('alternative-team')
export class AlternativeTeamController {
  constructor(
    private readonly alternativeTeamService: AlternativeTeamService,
  ) {}

  @Post()
  async createAlternativeTeam(
    @Body() dto: CreateAlternativeTeamDto,
  ): Promise<void> {
    return await this.alternativeTeamService.createAlternativeTeam(dto);
  }

  @Patch(':alternativeId/:teamId')
  async updateAlternativeTeamByIds(
    @Param('alternativeId', new ParseUUIDPipe()) alternativeId: string,
    @Param('teamId', new ParseUUIDPipe()) teamId: string,
    @Body() dto: UpdateAlternativeTeamDto,
  ): Promise<UpdateAlternativeTeamResponse> {
    return await this.alternativeTeamService.updateAlternativeTeamByIds({
      alternativeId,
      teamId,
      workHours: dto.workHours,
    });
  }
}
