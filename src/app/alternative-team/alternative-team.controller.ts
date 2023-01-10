import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AlternativeTeamService } from './service/alternative-team.service';

@Controller('alternative-team')
@ApiTags('alternative-team')
export class AlternativeTeamController {
  constructor(
    private readonly alternativeTeamService: AlternativeTeamService,
  ) {}

  @Delete(':alternativeId/:teamId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlternativeTeamByIds(
    @Param('alternativeId', new ParseUUIDPipe()) alternativeId: string,
    @Param('teamId', new ParseUUIDPipe()) teamId: string,
  ): Promise<void> {
    return await this.alternativeTeamService.deleteAlternativeTeamByIds(
      alternativeId,
      teamId,
    );
  }
}
