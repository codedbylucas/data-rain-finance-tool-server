import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientService } from 'src/app/client/service/client.service';
import { createUuid } from 'src/app/util/create-uuid';
import { ProjectEntity } from '../entities/project.entity';
import { AddClientToProjectResponse } from '../protocols/add-client-to-project.response';
import { CreateProjectResponse } from '../protocols/create-project.response';
import { FindAllProjectsResponse } from '../protocols/find-all-projects.response';
import { ProjectRepository } from '../repositorioes/project.repository';
import { AddClientToProjectDto } from './dto/add-client-to-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly clienService: ClientService,
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

  async addClientToProject(
    dto: AddClientToProjectDto,
  ): Promise<AddClientToProjectResponse> {
    const project = await this.verifyProjectExist(dto.projectId);
    await this.clienService.verifyClientExist(dto.clientId);

    if (project.clientId === dto.clientId) {
      throw new BadRequestException(
        `This project has already been related to this client`,
      );
    }

    const clientAddedInProject =
      await this.projectRepository.addClientToProject(dto);
    return clientAddedInProject;
  }

  async findAllProjects(): Promise<FindAllProjectsResponse[]> {
    const projectsOrEmpty = await this.projectRepository.findAllProjects();
    if (projectsOrEmpty.length === 0) {
      throw new NotFoundException(`No project found`);
    }
    return projectsOrEmpty;
  }

  async verifyProjectExist(id: string): Promise<ProjectEntity> {
    const projectOrNull = await this.projectRepository.findProjectById(id);
    if (!projectOrNull) {
      throw new BadRequestException(`Project with id '${id}' not found`);
    }
    return projectOrNull;
  }
}
