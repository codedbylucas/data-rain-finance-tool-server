import { Module } from '@nestjs/common';
import { ClientService } from './service/client.service';
import { ClientController } from './client.controller';
import { ClientRepository } from './repositories/client.repository';
import { PrismaModule } from '../infra/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ClientService, ClientRepository],
  controllers: [ClientController],
})
export class ClientModule {}
