import { Body, Controller, Post } from '@nestjs/common';
import { CreateAlternativeResponse } from './protocols/create-alternative-response';
import { AlternativeService } from './service/alternative.service';
import { CreateAlternativeDto } from './service/dto/create-alternative.dto';

@Controller('alternatives')
export class AlternativeController {
  constructor(private readonly alternativeService: AlternativeService) {}

  @Post()
  createAlternative(
    @Body() dto: CreateAlternativeDto,
  ): Promise<CreateAlternativeResponse> {
    return this.alternativeService.createAlternative(dto);
  }
}
