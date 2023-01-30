import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { checkIfEmailIsValid } from 'src/app/util/check-if-email-is-valid';
import { createUuid } from 'src/app/util/create-uuid';
import { CreateClienteResponse } from '../protocols/create-client-response';
import { FindAllClientsResponse } from '../protocols/find-all-clients-response';
import { FindClientByIdResponse } from '../protocols/find-client-by-id-response';
import { ClientRepository } from '../repositories/client.repository';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async createClient(dto: CreateClientDto): Promise<CreateClienteResponse> {
    dto.phone = dto.phone.replace(/\s/g, '').replace(/[^0-9]/g, '');
    if (dto.technicalContactPhone) {
      dto.technicalContactPhone = dto.technicalContactPhone
        .replace(/\s/g, '')
        .replace(/[^0-9]/g, '');
    }

    if (!dto.technicalContact) {
      delete dto.technicalContact;
    }
    if (!dto.technicalContactPhone) {
      delete dto.technicalContactPhone;
    }
    if (!dto.technicalContactEmail) {
      delete dto.technicalContactEmail;
    } else {
      checkIfEmailIsValid(dto.technicalContactEmail);
    }

    const clientOrNull = await this.clientRepository.findClientByEmail(
      dto.email,
    );
    if (clientOrNull) {
      return {
        id: clientOrNull.id,
        companyName: clientOrNull.companyName,
      };
    }
    const clientCreated = await this.clientRepository.createClient({
      ...dto,
      id: createUuid(),
    });
    return {
      id: clientCreated.id,
      companyName: clientCreated.companyName,
    };
  }

  async findAllClients(): Promise<FindAllClientsResponse[]> {
    const clientsOrEmpty = await this.clientRepository.findAllClients();
    if (!clientsOrEmpty || clientsOrEmpty.length === 0) {
      throw new NotFoundException('Clients not found');
    }
    return clientsOrEmpty;
  }

  async findClientById(id: string): Promise<FindClientByIdResponse> {
    const clientOrNull = await this.clientRepository.findClientById(id);
    if (!clientOrNull) {
      throw new NotFoundException(`Client with id '${id}' not found`);
    }

    clientOrNull.budgetRequests.forEach((budgetRequest) => {
      delete Object.assign(budgetRequest, {
        ['formResponses']: budgetRequest['clientsResponses'],
      })['clientsResponses'];
    });

    return clientOrNull;
  }

  async updateClientById(id: string, dto: UpdateClientDto): Promise<void> {
    const clientOrError = await this.verifyClientExist(id);
    if (dto.email) {
      const clientOrNull = await this.clientRepository.findClientByEmail(
        dto.email,
      );

      if (clientOrNull) {
        if (clientOrError.email !== clientOrNull.email) {
          throw new BadRequestException(
            `Unable to create a customer with an existing email`,
          );
        }
      }

      if (dto.email === clientOrError.email) {
        delete dto.email;
      }
    }
    await this.clientRepository.updateClientById(id, dto);
  }

  async deleteClientById(id: string): Promise<void> {
    await this.verifyClientExist(id);
    await this.clientRepository.deleteClientById(id);
  }

  async verifyClientExist(id: string): Promise<FindClientByIdResponse> {
    const clientOrNull = await this.clientRepository.findClientById(id);
    if (!clientOrNull) {
      throw new BadRequestException(`Client with id '${id}' not found`);
    }
    return clientOrNull;
  }
}
