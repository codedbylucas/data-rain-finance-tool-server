import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { ClientEntity } from '../entities/client.entity';
import { DbCreateClientProps } from '../protocols/props/db-create-client-props';
import { DbCreateClientResponsesProps } from '../protocols/props/db-create-client-responses.props';

@Injectable()
export class ClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createClient(data: DbCreateClientProps): Promise<ClientEntity> {
    const clientCreated = await this.prisma.clients
      .create({ data })
      .catch(serverError);
    return clientCreated;
  }

  async findClientByCompanyName(companyName: string): Promise<ClientEntity> {
    const clientOrNull = await this.prisma.clients
      .findUnique({ where: { companyName } })
      .catch(serverError);
    return clientOrNull;
  }

  async createClientResponses(props: DbCreateClientResponsesProps[]) {
    console.log(props)
    const data: Prisma.Enumerable<Prisma.ClientsResponsesCreateManyInput> =
      props.map((response) => ({ ...response }));

    const clientResponsesCreated =
      await this.prisma.clientsResponses.createMany({ data });

    return clientResponsesCreated;
  }
}
