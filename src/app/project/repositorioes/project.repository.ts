import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { ProjectEntity } from '../entities/project.entity';
import { AddClientToProjectResponse } from '../protocols/add-client-to-project.response';
import { FindAllProjectsResponse } from '../protocols/find-all-projects.response';
import { DbAddUserToProjectProps } from '../protocols/props/db-add-user-to-project.props';
import { DbCreateProjectProps } from '../protocols/props/db-create-project.props';
import { DbUpdateContainsManagerInProjectProps } from '../protocols/props/db-update-contains-manager-in-project.props';
import { UpdateProjectResponse } from '../protocols/update-project.response';
import { AddClientToProjectDto } from '../service/dto/add-client-to-project.dto';
import { UpdateProjectDto } from '../service/dto/update-project.dto';

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

  async addUserToProject(props: DbAddUserToProjectProps): Promise<void> {
    const data: Prisma.UsersProjectsCreateInput = {
      valuePerUserHour: props.valuePerUserHour,
      project: {
        connect: {
          id: props.projectId,
        },
      },
      user: {
        connect: {
          id: props.userId,
        },
      },
    };

    await this.prisma.usersProjects
      .create({
        data,
      })
      .catch(serverError);
  }

  async findProjectById(id: string) {
    const projectOrNull = await this.prisma.projects
      .findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          containsManager: true,
          summedTimeValueOfAllUsers: true,
          client: {
            select: {
              id: true,
              email: true,
              companyName: true,
              phone: true,
              primaryContactName: true,
            },
          },
          users: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  position: {
                    select: {
                      name: true,
                    },
                  },
                  role: {
                    select: {
                      name: true,
                    },
                  },
                  billable: true,
                  imageUrl: true,
                },
              },
              valuePerUserHour: true,
            },
          },
        },
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
          containsManager: true,
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

  async findManyUsersProjectsByProjectId(projectId: string) {
    const usersProjects = await this.prisma.usersProjects
      .findMany({
        where: {
          projectId: projectId,
        },
      })
      .catch(serverError);
    return usersProjects;
  }

  async deleteProjectById(id: string): Promise<void> {
    await this.prisma.projects.delete({ where: { id } }).catch(serverError);
  }

  async removeUserFromProject(
    projectId: string,
    userId: string,
  ): Promise<void> {
    await this.prisma.usersProjects
      .delete({
        where: {
          userId_projectId: {
            projectId,
            userId,
          },
        },
      })
      .catch(serverError);
  }

  async updateContainsManagerInProject(
    props: DbUpdateContainsManagerInProjectProps,
  ): Promise<ProjectEntity> {
    const projectUpdated = await this.prisma.projects
      .update({
        where: { id: props.id },
        data: {
          containsManager: props.containsManager,
        },
      })
      .catch(serverError);
    return projectUpdated;
  }

  async updateProjectById(
    id: string,
    dto: UpdateProjectDto,
  ): Promise<UpdateProjectResponse> {
    const projectUpdated = await this.prisma.projects
      .update({
        where: { id },
        data: { ...dto },
        select: {
          id: true,
          name: true,
          description: true,
        },
      })
      .catch(serverError);

    return projectUpdated;
  }

  async updateProjectAmount(id: string, value: number): Promise<void> {
    await this.prisma.projects
      .update({
        where: { id },
        data: {
          summedTimeValueOfAllUsers: value,
        },
      })
      .catch(serverError);
  }

  async findUserProjects(userId: string) {
    const userProjectsOrEmpty = await this.prisma.usersProjects
      .findMany({
        where: { userId },
        select: {
          id: true,
          project: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      })
      .catch(serverError);

    return userProjectsOrEmpty;
  }

  async findAUserProject(id: string) {
    const projectOrNull = await this.prisma.projects
      .findUnique({
        where: { id },
        select: {
          name: true,
          description: true,
          client: {
            select: {
              companyName: true,
            },
          },
          users: {
            select: {
              user: {
                select: {
                  name: true,
                  imageUrl: true,
                  position: {
                    select: {
                      name: true,
                    },
                  },
                  role: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      })
      .catch(serverError);

    return projectOrNull;
  }

  async findUserProjectById(userId: string, projectId: string) {
    const userProjectOrNull = await this.prisma.usersProjects
      .findUnique({
        where: {
          userId_projectId: {
            userId,
            projectId,
          },
        },
      })
      .catch(serverError);

    return userProjectOrNull;
  }
}
