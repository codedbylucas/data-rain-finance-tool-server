import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { ProjectEntity } from '../entities/project.entity';
import { DbCreateProjectProps } from '../protocols/props/db-create-project.props';

@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(props: DbCreateProjectProps): Promise<ProjectEntity> {
    const projectCreated = await this.prisma.projects
      .create({
        data: {
          ...props,
        },
      })
      .catch(serverError);

    return projectCreated;
  }
}
