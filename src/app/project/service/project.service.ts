import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientService } from 'src/app/client/service/client.service';
import { UserService } from 'src/app/user/service/user.service';
import { createUuid } from 'src/app/util/create-uuid';
import { CreateProjectResponse } from '../protocols/create-project.response';
import { FindAllProjectsResponse } from '../protocols/find-all-projects.response';
import { ProjectRepository } from '../repositorioes/project.repository';
import { AddClientToProjectDto } from './dto/add-client-to-project.dto';
import { AddUserToProjectDto } from './dto/add-user-to-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly clienService: ClientService,
    private readonly userService: UserService,
  ) {}

  async createProject(dto: CreateProjectDto): Promise<CreateProjectResponse> {
    const data = {
      ...dto,
      id: createUuid(),
    };
    const userCraeted = await this.projectRepository.createProject(data);

    return {
      id: userCraeted.id,
      name: userCraeted.name,
      description: userCraeted.description,
    };
  }

  async addClientToProject(dto: AddClientToProjectDto): Promise<void> {
    const project = await this.findProjectById(dto.projectId);
    await this.clienService.verifyClientExist(dto.clientId);
    if (project.client) {
      if (project.client.id === dto.clientId) {
        throw new BadRequestException(
          `This project has already been related to this client`,
        );
      }
    }
    await this.projectRepository.addClientToProject(dto);
  }

  async addUserToProject(dto: AddUserToProjectDto): Promise<void> {
    const project = await this.findProjectById(dto.projectId);
    const user = await this.userService.findUserById(dto.userId);
    if (!project.client) {
      throw new BadRequestException(
        `Add a customer before adding a user to the project`,
      );
    }
    if (
      user.roleName !== 'professional services' &&
      user.roleName !== 'manager'
    ) {
      throw new BadRequestException(
        `Only 'professional services' and 'manager' users can be allcated to a project`,
      );
    }
    const usersProjects = await this.verifyIfUserAllocatedInProjetct(
      dto.userId,
      dto.projectId,
    );
    if (!project.containsManager && user.roleName !== 'manager') {
      throw new BadRequestException(
        'This project does not contain a manager, add one before adding a new professional services',
      );
    }
    if (usersProjects.length > 0) {
      if (project.containsManager && user.roleName === 'manager') {
        throw new BadRequestException('A project can contain only one manager');
      }
    }

    await this.projectRepository.addUserToProject({
      ...dto,
    });

    if (user.roleName === 'manager') {
      await this.projectRepository.updateContainsManagerInProject({
        id: project.id,
        containsManager: true,
      });
    }

    await this.userService.updateUserAllocated({
      id: user.id,
      allocated: true,
    });
  }

  async findAllProjects(): Promise<FindAllProjectsResponse[]> {
    const projectsOrEmpty = await this.projectRepository.findAllProjects();
    if (projectsOrEmpty.length === 0) {
      throw new NotFoundException(`No project found`);
    }
    return projectsOrEmpty;
  }

  async findProjectById(id: string) {
    const projectOrNull = await this.projectRepository.findProjectById(id);
    if (!projectOrNull) {
      throw new NotFoundException(`Project with Id '${id}' not found`);
    }
    return projectOrNull;
  }

  async deleteProjectById(id: string) {
    await this.findProjectById(id);
    await this.projectRepository.deleteProjectById(id);
  }

  async removeUserFromProject(
    projectId: string,
    userId: string,
  ): Promise<void> {
    await this.findProjectById(projectId);
    const user = await this.userService.findUserById(userId);
    await this.projectRepository.removeUserFromProject(projectId, userId);

    if (user.roleName === 'manager') {
      await this.projectRepository.updateContainsManagerInProject({
        id: projectId,
        containsManager: false,
      });
    }
  }

  async verifyIfUserAllocatedInProjetct(userId: string, projectId: string) {
    const usersProjects =
      await this.projectRepository.findManyUsersProjectsByProjectId(projectId);
    for (const item of usersProjects) {
      if (item.userId === userId && item.projectId === projectId) {
        throw new BadRequestException(
          `User is already allocated in this project`,
        );
      }
    }
    return usersProjects;
  }
}
