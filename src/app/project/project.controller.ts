import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role, RolesAccess } from '../auth/decorators/roles.decorator';
import { UserPayload } from '../auth/protocols/user-payload';
import { CreateProjectResponse } from './protocols/create-project.response';
import { FindAllProjectsResponse } from './protocols/find-all-projects.response';
import { AddClientToProjectDto } from './service/dto/add-client-to-project.dto';
import { AddUserToProjectDto } from './service/dto/add-user-to-project.dto';
import { CreateProjectDto } from './service/dto/create-project.dto';
import { UpdateProjectDto } from './service/dto/update-project.dto';
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
  async addClientToProject(@Body() dto: AddClientToProjectDto): Promise<void> {
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

  @Get('/user')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find user projects',
  })
  async findUserProjects(
    @RolesAccess([Role.professionalServices, Role.manager])
    payload: UserPayload,
  ) {
    return await this.projectService.findUserProjects(payload.userId);
  }

  @Get('/:id/user')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find a user project',
  })
  async findAUserProject(
    @Param('id', new ParseUUIDPipe()) projectId: string,
    @RolesAccess([Role.professionalServices, Role.manager])
    payload: UserPayload,
  ) {
    return await this.projectService.findAUserProject(
      payload.userId,
      projectId,
    );
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

  @Patch(':id')
  @ApiOperation({
    summary: 'Update project by id',
  })
  async updateProjectById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return await this.projectService.updateProjectById(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete project by id',
  })
  async deleteProjectById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.projectService.deleteProjectById(id);
  }

  @Delete('/remove-user/:projectId/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove user from project',
  })
  async removeUserFromProject(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<void> {
    return await this.projectService.removeUserFromProject(projectId, userId);
  }
}
