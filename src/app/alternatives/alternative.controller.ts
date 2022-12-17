import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateAlternativeResponse } from './protocols/create-alternative-response';
import { AlternativeService } from './service/alternative.service';
import { CreateAlternativeDto } from './service/dto/create-alternative.dto';
import { UpdateAlternativeDto } from './service/dto/update-alternative.dto';

@Controller('alternative')
@ApiTags('alternative')
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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlternativeById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.alternativeService.deleteAlternativeById(id);
  }
}
