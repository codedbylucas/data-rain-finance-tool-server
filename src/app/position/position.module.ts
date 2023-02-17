import { Module } from '@nestjs/common';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { PositionController } from './position.controller';
import { PositionRepository } from './repositories/position.repository';
import { PositionService } from './services/position.service';

@Module({
  imports: [PrismaModule],
  providers: [PositionService, PositionRepository],
  controllers: [PositionController],
  exports: [PositionService],
})
export class PositionModule {}
