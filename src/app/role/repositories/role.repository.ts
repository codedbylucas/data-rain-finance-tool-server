import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { FindRoleResponse } from '../protocols/find-role-response';

@Injectable()
export class RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllRoles(): Promise<FindRoleResponse[]> {
    return await this.prisma.roles
      .findMany({
        select: { id: true, name: true, description: true },
      })
      .catch(serverError);
  }
}
