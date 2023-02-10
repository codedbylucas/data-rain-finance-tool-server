import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { FindPositionResponse } from '../protocols/responses/find-position.response';

@Injectable()
export class PositionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPositions(): Promise<FindPositionResponse[]> {
    const positionsOrEmpty = await this.prisma.positions
      .findMany({
        select: {
          id: true,
          name: true,
        },
      })
      .catch(serverError);
    return positionsOrEmpty;
  }

  async findPositionById(id: string): Promise<FindPositionResponse> {
    const positionOrNull = await this.prisma.positions
      .findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
        },
      })
      .catch(serverError);
    return positionOrNull;
  }
}
