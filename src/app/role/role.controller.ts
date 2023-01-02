import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindRoleResponse } from './protocols/find-role-response';
import { RoleService } from './service/role.service';

@Controller('role')
@ApiTags('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async findAllRoles(): Promise<FindRoleResponse[]> {
    return await this.roleService.findAllRoles();
  }
}
