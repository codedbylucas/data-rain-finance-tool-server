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
import { UpdateProjectResponse } from '../protocols/update-project.response';
import { ProjectRepository } from '../repositorioes/project.repository';
import { AddClientToProjectDto } from './dto/add-client-to-project.dto';
import { AddUserToProjectDto } from './dto/add-user-to-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

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
    if (project.client) {
      throw new BadRequestException(`This project already contains a customer`);
    }
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
      user.role.name !== 'professional services' &&
      user.role.name !== 'manager'
    ) {
      throw new BadRequestException(
        `Only 'professional services' and 'manager' users can be allcated to a project`,
      );
    }
    const usersProjects = await this.verifyIfUserAllocatedInProjetct(
      dto.userId,
      dto.projectId,
    );
    if (!project.containsManager && user.role.name !== 'manager') {
      throw new BadRequestException(
        'This project does not contain a manager, add one before adding a new professional services',
      );
    }

    let summedTimeValueOfAllUsers = 0;
    if (usersProjects.length > 0) {
      if (project.containsManager && user.role.name === 'manager') {
        throw new BadRequestException('A project can contain only one manager');
      }
      usersProjects.forEach((user) => {
        summedTimeValueOfAllUsers += user.valuePerUserHour;
      });
    }
    await this.projectRepository.addUserToProject({
      ...dto,
    });

    summedTimeValueOfAllUsers += dto.valuePerUserHour;
    await this.projectRepository.updateProjectAmount(
      dto.projectId,
      summedTimeValueOfAllUsers,
    );

    if (user.role.name === 'manager') {
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

  async updateProjectById(
    id: string,
    dto: UpdateProjectDto,
  ): Promise<UpdateProjectResponse> {
    if (!dto.description && !dto.name) {
      throw new BadRequestException(`Name or descripton must be informed`);
    }
    await this.findProjectById(id);
    const projectUpdated = await this.projectRepository.updateProjectById(
      id,
      dto,
    );
    return projectUpdated;
  }

  async deleteProjectById(id: string) {
    await this.findProjectById(id);
    await this.projectRepository.deleteProjectById(id);
  }

  async removeUserFromProject(
    projectId: string,
    userId: string,
  ): Promise<void> {
    const user = await this.userService.findUserById(userId);
    await this.verifyRelationUserAndProject(userId, projectId);
    await this.projectRepository.removeUserFromProject(projectId, userId);

    const usersInProject =
      await this.projectRepository.findManyUsersProjectsByProjectId(projectId);
    let summedTimeValueOfAllUsers = 0;
    if (usersInProject.length > 0) {
      usersInProject.forEach((user) => {
        summedTimeValueOfAllUsers += user.valuePerUserHour;
      });
    }
    await this.projectRepository.updateProjectAmount(
      projectId,
      summedTimeValueOfAllUsers,
    );

    if (user.role.name === 'manager') {
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

  async findUserProjects(userId: string) {
    await this.userService.findUserById(userId);
    const userProjectsOrEmpty = await this.projectRepository.findUserProjects(
      userId,
    );

    if (userProjectsOrEmpty.length === 0) {
      throw new NotFoundException(`User is not in any project`);
    }

    const userProjects = userProjectsOrEmpty.map((userProject) => ({
      project: {
        id: userProject.project.id,
        name: userProject.project.name,
        description: userProject.project.description,
      },
      client: {
        companyName: userProject.project.client?.companyName,
      },
      manager: {
        name: userProject.project.users[0]?.user?.name,
        email: userProject.project.users[0]?.user?.email,
      },
    }));

    return userProjects;
  }

  async findAUserProject(userId: string, projectId: string) {
    await this.verifyRelationUserAndProject(userId, projectId);
    const projectOrNull = await this.projectRepository.findAUserProject(
      projectId,
    );
    return projectOrNull;
  }

  async verifyRelationUserAndProject(userId: string, projectId: string) {
    const userProjectOrNull = await this.projectRepository.findUserProjectById(
      userId,
      projectId,
    );
    if (!userProjectOrNull) {
      throw new BadRequestException(
        `Relationship between user and project not found`,
      );
    }
    return userProjectOrNull;
  }
}
