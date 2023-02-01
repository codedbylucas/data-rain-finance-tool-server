import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { ProjectModule } from '../project/project.module';
import { UserModule } from '../user/user.module';
import { NormalHourController } from './normal-hour.controller';
import { NormalHourRepository } from './repositories/normal-hour.repository';
import { NormalHourService } from './service/normal-hour.service';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    PrismaModule,
    ProjectModule,
    UserModule,
  ],
  controllers: [NormalHourController],
  providers: [NormalHourService, NormalHourRepository],
})
export class NormalHourModule {}
