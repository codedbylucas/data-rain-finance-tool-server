import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateAlternativeResponse } from './protocols/create-alternative-response';
import { AlternativeService } from './service/alternative.service';
import { CreateAlternativeDto } from './service/dto/create-alternative.dto';
import { UpdateAlternativeDto } from './service/dto/update-alternative.dto';

@Controller('alternative')
export class AlternativeController {
  constructor(private readonly alternativeService: AlternativeService) {}

  @Post()
  async createAlternative(
    @Body() dto: CreateAlternativeDto,
  ): Promise<CreateAlternativeResponse> {
    return await this.alternativeService.createAlternative(dto);
  }

  @Patch(':id')
  async updateAlternativeById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateAlternativeDto,
  ) {
    return await this.alternativeService.updateAlternative(id, dto);
  }
}
