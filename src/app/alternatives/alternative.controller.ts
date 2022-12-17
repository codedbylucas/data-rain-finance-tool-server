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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAlternativeResponse } from './protocols/create-alternative-response';
import { UpdateAlternativeResponse } from './protocols/update-alternative-response';
import { AlternativeService } from './service/alternative.service';
import { CreateAlternativeDto } from './service/dto/create-alternative.dto';
import { UpdateAlternativeDto } from './service/dto/update-alternative.dto';

@Controller('alternative')
@ApiTags('alternative')
export class AlternativeController {
  constructor(private readonly alternativeService: AlternativeService) {}

  @Post()
  @ApiOperation({
    summary: 'Alternative is create',
  })
  async createAlternative(
    @Body() dto: CreateAlternativeDto,
  ): Promise<CreateAlternativeResponse> {
    return await this.alternativeService.createAlternative(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update alternative by id',
  })
  async updateAlternativeById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateAlternativeDto,
  ): Promise<UpdateAlternativeResponse> {
    return await this.alternativeService.updateAlternative(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete alternative by id',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlternativeById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return await this.alternativeService.deleteAlternativeById(id);
  }
}
