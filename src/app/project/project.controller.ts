import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateProjectResponse } from './protocols/create-project.response';
import { AddClientToProjectDto } from './service/dto/add-client-to-project.dto';
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

  @Post('add-client')
  async addClientToProject(@Body() dto: AddClientToProjectDto) {
    return await this.projectService.addClientToProject(dto);
  }

  @Get()
  async findAllProjects() {
    return await this.projectService.findAllProjects();
  }
}
