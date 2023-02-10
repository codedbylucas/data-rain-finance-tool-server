import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindPositionResponse } from './protocols/responses/find-position.response';
import { PositionService } from './services/position.service';

@Controller('position')
@ApiTags('position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Get()
  async findAllPositions(): Promise<
    NotFoundException | FindPositionResponse[]
  > {
    return await this.positionService.findAllPositions();
  }
}
