import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { ClientEntity } from '../entities/client.entity';
import { FindAllClientsResponse } from '../protocols/find-all-clients-response';
import { FindClientByIdResponse } from '../protocols/find-client-by-id-response';
import { DbCreateClientProps } from '../protocols/props/db-create-client-props';
import { UpdateClientDto } from '../service/dto/update-client.dto';

@Injectable()
export class ClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createClient(data: DbCreateClientProps): Promise<ClientEntity> {
    const clientCreated = await this.prisma.clients
      .create({ data })
      .catch(serverError);
    return clientCreated;
  }

  async findClientByEmail(email: string): Promise<ClientEntity> {
    const clientOrNull = await this.prisma.clients
      .findUnique({ where: { email } })
      .catch(serverError);
    return clientOrNull;
  }

  async findAllClients(): Promise<FindAllClientsResponse[]> {
    const clientsOrEmpty = await this.prisma.clients
      .findMany({
        select: {
          id: true,
          mainContact: true,
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
          companyName: true,
          email: true,
          phone: true,
          mainContact: true,
          projectName: true,
          applicationDescription: true,
          technicalContact: true,
          technicalContactEmail: true,
          technicalContactPhone: true,
          timeProject: true,
          budgetRequests: {
            select: {
              id: true,
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

  async updateClientById(id: string, dto: UpdateClientDto): Promise<void> {
    const data: Prisma.ClientsUpdateInput = { ...dto };
    await this.prisma.clients
      .update({
        where: { id },
        data,
      })
      .catch(serverError);
  }

  async deleteClientById(id: string): Promise<void> {
    await this.prisma.clients.delete({ where: { id } }).catch(serverError);
  }
}
