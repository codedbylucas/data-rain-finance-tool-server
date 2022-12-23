import { Controller, Get } from '@nestjs/common';
import { FindRoleResponse } from './protocols/find-role-response';
import { RoleService } from './service/role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async findAllRoles(): Promise<FindRoleResponse[]> {
    return await this.roleService.findAllRoles();
  }
}
