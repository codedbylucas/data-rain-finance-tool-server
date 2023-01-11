import { Module } from '@nestjs/common';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { ClientController } from './client.controller';
import { ClientRepository } from './repositories/client.repository';
import { ClientService } from './service/client.service';

@Module({
  imports: [PrismaModule],
  providers: [ClientService, ClientRepository],
  controllers: [ClientController],
  exports: [ClientService],
})
export class ClientModule {}
