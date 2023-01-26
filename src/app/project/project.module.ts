import { Module } from '@nestjs/common';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { ProjectController } from './project.controller';
import { ProjectRepository } from './repositorioes/project.repository';
import { ProjectService } from './service/project.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository],
})
export class ProjectModule {}
