import { Module } from '@nestjs/common';
import { RequestSendOvertimeService } from './service/request-send-overtime.service';
import { RequestSendOvertimeController } from './request-send-overtime.controller';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { RequestSendOvertimeRepository } from './repositories/request-send-overtime.repository';

@Module({
  imports: [PrismaModule],
  providers: [RequestSendOvertimeService, RequestSendOvertimeRepository],
  controllers: [RequestSendOvertimeController],
})
export class RequestSendOvertimeModule {}
