import { Injectable } from '@nestjs/common';
import { stringify } from 'querystring';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { ProjectEntity } from '../entities/project.entity';
import { AddClientToProjectResponse } from '../protocols/add-client-to-project.response';
import { FindAllProjectsResponse } from '../protocols/find-all-projects.response';
import { DbCreateProjectProps } from '../protocols/props/db-create-project.props';
import { AddClientToProjectDto } from '../service/dto/add-client-to-project.dto';

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

  async addClientToProject(
    dto: AddClientToProjectDto,
  ): Promise<AddClientToProjectResponse> {
    const clientAddedInProject = await this.prisma.projects
      .update({
        where: { id: dto.projectId },
        data: {
          client: {
            connect: {
              id: dto.clientId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          client: {
            select: {
              id: true,
              companyName: true,
              email: true,
            },
          },
        },
      })
      .catch(serverError);

    return clientAddedInProject;
  }

  async findProjectById(id: string): Promise<ProjectEntity> {
    const projectOrNull = await this.prisma.projects
      .findUnique({
        where: { id },
      })
      .catch(serverError);

    return projectOrNull;
  }

  async findAllProjects(): Promise<FindAllProjectsResponse[]> {
    const projectsOrEmpty = await this.prisma.projects
      .findMany({
        select: {
          id: true,
          name: true,
          description: true,
          client: {
            select: {
              id: true,
              companyName: true,
            },
          },
          _count: true,
        },
      })
      .catch(serverError);

    return projectsOrEmpty;
  }
}
