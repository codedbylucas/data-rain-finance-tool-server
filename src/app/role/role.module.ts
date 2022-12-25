import { Module } from '@nestjs/common';
import { RoleService } from './service/role.service';
import { RoleController } from './role.controller';
import { RoleRepository } from './repositories/role.repository';
import { PrismaModule } from '../infra/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RoleService, RoleRepository],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
