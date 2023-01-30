import { Module } from '@nestjs/common';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { NormalHourController } from './normal-hour.controller';
import { NormalHourRepository } from './repositories/normal-hour.repository';
import { NormalHourService } from './service/normal-hour.service';

@Module({
  imports: [PrismaModule],
  controllers: [NormalHourController],
  providers: [NormalHourService, NormalHourRepository],
})
export class NormalHourModule {}
