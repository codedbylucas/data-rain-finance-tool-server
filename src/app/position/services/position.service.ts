import { Injectable, NotFoundException } from '@nestjs/common';
import { FindPositionResponse } from '../protocols/responses/find-position.response';
import { PositionRepository } from '../repositories/position.repository';

@Injectable()
export class PositionService {
  constructor(private readonly positionRepository: PositionRepository) {}

  async findAllPositions(): Promise<FindPositionResponse[]> {
    const positionsOrEmpty = await this.positionRepository.findAllPositions();
    if (positionsOrEmpty.length === 0) {
      throw new NotFoundException(`No position was found`);
    }
    return positionsOrEmpty;
  }

  async findPositionById(id: string): Promise<FindPositionResponse> {
    const positionOrNull = await this.positionRepository.findPositionById(id);
    if (!positionOrNull) {
      throw new NotFoundException(`Position with id '${id} not found'`);
    }
    return positionOrNull;
  }
}
