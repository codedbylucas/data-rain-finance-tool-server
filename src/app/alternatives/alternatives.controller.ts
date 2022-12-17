import { Body, Controller, Post } from '@nestjs/common';
import { CreateAlternativeResponse } from './protocols/create-alternative-response';
import { AlternativesService } from './service/alternatives.service';
import { CreateAlternativeDto } from './service/dto/create-alternative.dto';

@Controller('alternatives')
export class AlternativesController {
  constructor(private readonly alternativeService: AlternativesService) {}

  @Post()
  createAlternative(
    @Body() dto: CreateAlternativeDto,
  ): Promise<CreateAlternativeResponse> {
    return this.alternativeService.createAlternative(dto);
  }
}
