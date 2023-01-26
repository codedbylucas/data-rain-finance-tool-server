import { Injectable } from '@nestjs/common';
import { createUuid } from 'src/app/util/create-uuid';
import { CreateProjectResponse } from '../protocols/create-project.response';
import { ProjectRepository } from '../repositorioes/project.repository';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

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
}
