import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { ClientEntity } from '../entities/client.entity';
import { FindAllClientsResponse } from '../protocols/find-all-clients-response';
import { FindClientByIdResponse } from '../protocols/find-client-by-id-response';
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

  async createClientResponses(
    props: DbCreateClientResponsesProps[],
  ): Promise<void> {
    const data: Prisma.Enumerable<Prisma.ClientsResponsesCreateManyInput> =
      props.map((response) => ({ ...response }));
    await this.prisma.clientsResponses.createMany({ data });
  }

  async findAllClients(): Promise<FindAllClientsResponse[]> {
    const clientsOrEmpty = await this.prisma.clients
      .findMany({
        select: {
          id: true,
          name: true,
          companyName: true,
          email: true,
          phone: true,
        },
      })
      .catch(serverError);

    return clientsOrEmpty;
  }

  async findClientById(id: string): Promise<FindClientByIdResponse> {
    const clientOrNull = await this.prisma.clients
      .findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          companyName: true,
          email: true,
          phone: true,
          budgetRequests: {
            select: {
              clientsResponses: {
                select: {
                  responseDetails: true,
                  question: {
                    select: {
                      id: true,
                      description: true,
                    },
                  },
                  alternative: {
                    select: {
                      id: true,
                      description: true,
                      teams: {
                        select: {
                          team: {
                            select: {
                              id: true,
                              name: true,
                              valuePerHour: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      })
      .catch(serverError);
    return clientOrNull;
  }

  async deleteClientById(id: string): Promise<void> {
    await this.prisma.clients.delete({ where: { id } }).catch(serverError);
  }
}
