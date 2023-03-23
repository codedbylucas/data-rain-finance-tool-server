import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { ClientController } from './client.controller';
import { ClientRepository } from './repositories/client.repository';
import { ClientService } from './service/client.service';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    PrismaModule,
  ],
  providers: [ClientService, ClientRepository],
  controllers: [ClientController],
  exports: [ClientService],
})
export class ClientModule {}
