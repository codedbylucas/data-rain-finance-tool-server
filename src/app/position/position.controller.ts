import { Controller, Get, NotFoundException } from '@nestjs/common';
import { FindPositionResponse } from './protocols/responses/find-position.response';
import { PositionService } from './services/position.service';

@Controller('position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Get()
  async findAllPositions(): Promise<
    NotFoundException | FindPositionResponse[]
  > {
    return await this.positionService.findAllPositions();
  }
}
