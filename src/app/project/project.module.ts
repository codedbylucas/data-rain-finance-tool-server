import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ClientModule } from '../client/client.module';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { ProjectController } from './project.controller';
import { ProjectRepository } from './repositorioes/project.repository';
import { ProjectService } from './service/project.service';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    PrismaModule,
    ClientModule,
    UserModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository],
})
export class ProjectModule {}
