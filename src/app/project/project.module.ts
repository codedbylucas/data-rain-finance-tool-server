import { Module } from '@nestjs/common';
import { ClientModule } from '../client/client.module';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { ProjectController } from './project.controller';
import { ProjectRepository } from './repositorioes/project.repository';
import { ProjectService } from './service/project.service';

@Module({
  imports: [PrismaModule, ClientModule],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository],
})
export class ProjectModule {}
