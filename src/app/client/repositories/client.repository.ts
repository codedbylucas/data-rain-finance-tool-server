import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { ClientTechnicalContactsEntity } from '../entities/client-technical-contacts.entity';
import { ClientEntity } from '../entities/client.entity';
import { FindAllClientsResponse } from '../protocols/find-all-clients-response';
import { FindClientByIdResponse } from '../protocols/find-client-by-id-response';
import { DbCreateTechnicalContactProps } from '../protocols/props/db-create-client-technical-contact.props';
import { DbCreateClientProps } from '../protocols/props/db-create-client.props';
import { DbUpdateClientProps } from '../protocols/props/db-update-client.props';
import {
  UpdateClientDto,
  UpdateTechnicalContactDto,
} from '../service/dto/update-client.dto';

@Injectable()
export class ClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createClient(data: DbCreateClientProps): Promise<ClientEntity> {
    const clientCreated = await this.prisma.clients
      .create({ data })
      .catch(serverError);
    return clientCreated;
  }

  async createClientTechnicalContact(
    props: DbCreateTechnicalContactProps,
  ): Promise<ClientTechnicalContactsEntity> {
    const data: Prisma.ClientTechnicalContactsCreateInput = {
      id: props.id,
      name: props.name,
      email: props.email,
      phone: props.phone,
      client: {
        connect: {
          id: props.clientId,
        },
      },
    };

    const technicalContactCreated = await this.prisma.clientTechnicalContacts
      .create({
        data,
      })
      .catch(serverError);

    return technicalContactCreated;
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
          primaryContactName: true,
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
          primaryContactName: true,
          technicalContact: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
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

  async updateClientById(id: string, dto: DbUpdateClientProps): Promise<void> {
    const data: Prisma.ClientsUpdateInput = { ...dto };
    await this.prisma.clients
      .update({
        where: { id },
        data,
      })
      .catch(serverError);
  }

  async updateClientTechnicalContactById(
    clientId: string,
    dto: UpdateTechnicalContactDto,
  ) {
    const data: Prisma.ClientTechnicalContactsUpdateInput = { ...dto };
    await this.prisma.clientTechnicalContacts
      .update({
        where: { clientId },
        data,
      })
      .catch(serverError);
  }

  async deleteClientById(id: string): Promise<void> {
    await this.prisma.clients.delete({ where: { id } }).catch(serverError);
  }
}
