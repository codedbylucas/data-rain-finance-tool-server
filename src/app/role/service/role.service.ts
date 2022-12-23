import { Injectable } from '@nestjs/common';
import { FindRoleResponse } from '../protocols/find-role-response';
import { RoleRepository } from '../repositories/role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async findAllRoles(): Promise<FindRoleResponse[]> {
    return await this.roleRepository.findAllRoles();
  }
}
