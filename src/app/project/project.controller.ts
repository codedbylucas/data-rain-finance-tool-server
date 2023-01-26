import { Body, Controller, Post } from '@nestjs/common';
import { CreateProjectResponse } from './protocols/create-project.response';
import { CreateProjectDto } from './service/dto/create-project.dto';
import { ProjectService } from './service/project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async createUser(
    @Body() dto: CreateProjectDto,
  ): Promise<CreateProjectResponse> {
    return await this.projectService.createProject(dto);
  }
}
