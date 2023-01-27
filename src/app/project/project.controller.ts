import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddClientToProjectResponse } from './protocols/add-client-to-project.response';
import { CreateProjectResponse } from './protocols/create-project.response';
import { FindAllProjectsResponse } from './protocols/find-all-projects.response';
import { AddClientToProjectDto } from './service/dto/add-client-to-project.dto';
import { AddUserToProjectDto } from './service/dto/add-user-to-project.dto';
import { CreateProjectDto } from './service/dto/create-project.dto';
import { ProjectService } from './service/project.service';

@Controller('project')
@ApiTags('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOperation({
    summary: 'Create project',
  })
  async createUser(
    @Body() dto: CreateProjectDto,
  ): Promise<CreateProjectResponse> {
    return await this.projectService.createProject(dto);
  }

  @Post('add-client')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Add client to project',
  })
  async addClientToProject(
    @Body() dto: AddClientToProjectDto,
  ): Promise<AddClientToProjectResponse> {
    return await this.projectService.addClientToProject(dto);
  }

  @Post('add-user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Add user to project',
  })
  async addUserToProject(@Body() dto: AddUserToProjectDto): Promise<void> {
    return await this.projectService.addUserToProject(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all projects',
  })
  async findAllProjects(): Promise<FindAllProjectsResponse[]> {
    return await this.projectService.findAllProjects();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find project by id',
  })
  async findProjectById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.projectService.findProjectById(id);
  }
}
