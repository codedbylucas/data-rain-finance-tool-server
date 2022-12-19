import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { ClientEntity } from '../entities/client.entity';
import { DbCreateClientProps } from '../protocols/props/db-create-client-props';

@Injectable()
export class ClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createClient(data: DbCreateClientProps): Promise<ClientEntity> {
    const clientCreated = await this.prisma.clients.create({
      data,
    });
    return clientCreated;
  }
}
