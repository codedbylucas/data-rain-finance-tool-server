import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { ProjectModule } from '../project/project.module';
import { RequestSendOvertimeModule } from '../request-send-overtime/request-send-overtime.module';
import { OvertimeController } from './overtime.controller';
import { OvertimeRepository } from './repositories/overtime.repository';
import { OvertimeService } from './service/overtime.service';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    PrismaModule,
    RequestSendOvertimeModule,
    ProjectModule,
  ],
  providers: [OvertimeService, OvertimeRepository],
  controllers: [OvertimeController],
})
export class OvertimeModule {}
