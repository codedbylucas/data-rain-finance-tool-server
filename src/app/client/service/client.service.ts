import { BadRequestException, Injectable } from '@nestjs/common';
import { createUuid } from 'src/app/util/create-uuid';
import { ClientEntity } from '../entities/client.entity';
import { CreateClienteResponse } from '../protocols/create-client-response';
import { DbCreateClientResponsesProps } from '../protocols/props/db-create-client-responses.props';
import { ClientRepository } from '../repositories/client.repository';
import { ClientResponse, ClientResponsesDto } from './dto/client-responses.dto';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async createClient(dto: CreateClientDto): Promise<CreateClienteResponse> {
    dto.name = dto.name.trim();
    dto.companyName = dto.companyName.toLowerCase().trim();
    dto.phone = dto.phone.replace(/\s/g, '').replace(/[^0-9]/g, '');

    const clientOrNull = await this.clientRepository.findClientByCompanyName(
      dto.companyName,
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

  async createClientResponses(dto: ClientResponsesDto): Promise<void> {
    const responses: ClientResponse[] = dto.responses;

    responses.forEach((response) => {
      if (!response.alternativeId && !response.answerDetails) {
        throw new BadRequestException(`Altarnative id or details required`);
      }
    });

    const questionIds = responses.map((response) => response.questionId);
    const alternativeIds = responses.map((response) => response.alternativeId);
    const questionDuplicate = this.hasDuplicates(questionIds);
    const alternativeDuplicate = this.hasDuplicates(alternativeIds);
    if (questionDuplicate || alternativeDuplicate) {
      throw new BadRequestException(
        `Question Id or Alternative Id cannot be dubbed`,
      );
    }

    await this.verifyClientExist(dto.clientId);

    const data: DbCreateClientResponsesProps[] = responses.map((response) => ({
      ...response,
      id: createUuid(),
      clientId: dto.clientId,
    }));

    await this.clientRepository.createClientResponses(data);
  }

  async deleteClientById(id: string): Promise<void> {
    await this.verifyClientExist(id);
    await this.clientRepository.deleteClientById(id);
  }

  async verifyClientExist(id: string): Promise<ClientEntity> {
    const clientOrNull = await this.clientRepository.findClientById(id);
    if (!clientOrNull) {
      throw new BadRequestException(`Client with id '${id}' not found`);
    }
    return clientOrNull;
  }

  hasDuplicates(array: string[]) {
    return new Set(array).size !== array.length;
  }
}
