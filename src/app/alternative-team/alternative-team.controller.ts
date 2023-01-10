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

  
}
