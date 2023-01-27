import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindRoleResponse } from './protocols/find-role-response';
import { RoleService } from './service/role.service';

@Controller('role')
@ApiTags('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({
    summary: 'Find all roles',
  })
  async findAllRoles(): Promise<FindRoleResponse[]> {
    return await this.roleService.findAllRoles();
  }
}
